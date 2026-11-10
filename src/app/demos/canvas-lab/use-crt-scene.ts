"use client"

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js"
import { connectCurvedScreenInput } from "./curved-screen-input"
import { supportsHtmlCanvas } from "../html-in-canvas/use-html-canvas"

type DrawableCanvas = HTMLCanvasElement & {
  requestPaint(): void
  updateElementGeometry(
    element: Element,
    options: { canvasTransform: DOMMatrix }
  ): void
  clearElementGeometry(element: Element): void
}
type DrawableContext = CanvasRenderingContext2D & {
  drawElementImage(
    element: Element,
    x: number,
    y: number,
    w: number,
    h: number
  ): void
}
const subscribe = () => () => {}

export function useCrtScene(
  enabled: boolean,
  effects: boolean,
  strength: number,
  onError: (message: string) => void
) {
  const supported = useSyncExternalStore(
    subscribe,
    supportsHtmlCanvas,
    () => false
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<HTMLCanvasElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const sceneControls = useRef<{ reset(): void; front(): void } | null>(null)
  const settings = useRef({
    effects: true,
    strength: 0.65,
    glitchUntil: 0,
    pendingGlitch: false,
  })

  const signalGlitch = useCallback(() => {
    settings.current.pendingGlitch = true
  }, [])
  useEffect(() => {
    settings.current.effects = effects
    settings.current.strength = strength
    ;(sourceRef.current as DrawableCanvas | null)?.requestPaint()
  }, [effects, strength])

  useEffect(() => {
    if (!enabled || !supported) return
    const canvas = canvasRef.current as DrawableCanvas | null
    const source = sourceRef.current as DrawableCanvas | null
    const panel = panelRef.current
    if (!canvas || !source || !panel) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      })
    } catch {
      onError("無法啟動 WebGL，已切回 HTML 播放器。")
      return
    }
    const ctx = source.getContext("2d") as DrawableContext | null
    if (!ctx || typeof canvas.updateElementGeometry !== "function") {
      renderer.dispose()
      onError("這個瀏覽器缺少原生互動幾何 API，已切回 HTML 播放器。")
      return
    }
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#111513")
    scene.fog = new THREE.Fog("#111513", 17, 38)
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 70)
    camera.position.set(4.8, 4.5, 13.5)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 2.7, 0)
    controls.enablePan = false
    controls.minDistance = 10
    controls.maxDistance = 20
    controls.minPolarAngle = Math.PI * 0.27
    controls.maxPolarAngle = Math.PI * 0.49
    controls.minAzimuthAngle = -Math.PI * 0.36
    controls.maxAzimuthAngle = Math.PI * 0.36
    controls.update()
    controls.saveState()
    sceneControls.current = {
      reset: () => controls.reset(),
      front: () => {
        camera.position.set(0, 3.35, 13)
        controls.target.set(0, 2.8, 0)
        controls.update()
      },
    }
    // Keep React's delegated events intact while excluding screen gestures from orbit.
    let screenGesture = false
    function beginScreenGesture() {
      screenGesture = true
      controls.enabled = false
    }
    function endScreenGesture() {
      screenGesture = false
      controls.enabled = true
    }
    function screenWheel() {
      controls.enabled = false
      queueMicrotask(() => {
        controls.enabled = !screenGesture
      })
    }
    source.addEventListener("pointerdown", beginScreenGesture)
    source.addEventListener("wheel", screenWheel)
    window.addEventListener("pointerup", endScreenGesture, true)
    window.addEventListener("pointercancel", endScreenGesture, true)
    scene.add(new THREE.HemisphereLight(0xb4c9bd, 0x24231c, 2.3))
    const key = new THREE.DirectionalLight(0xffecd6, 4)
    key.position.set(-5, 10, 7)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = key.shadow.camera.bottom = -9
    key.shadow.camera.right = key.shadow.camera.top = 9
    key.shadow.normalBias = 0.035
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x76a797, 2.5)
    rim.position.set(5, 6, -5)
    scene.add(rim)
    const desk = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      new THREE.MeshStandardMaterial({ color: 0x303a30, roughness: 0.87 })
    )
    desk.rotation.x = -Math.PI / 2
    desk.receiveShadow = true
    scene.add(desk)
    function box(
      w: number,
      h: number,
      d: number,
      radius: number,
      color: number,
      x: number,
      y: number,
      z: number
    ) {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        metalness: 0.12,
      })
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(w, h, d, 4, radius),
        material
      )
      mesh.position.set(x, y, z)
      mesh.castShadow = mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }
    box(5.45, 5.1, 3.25, 0.3, 0x252c29, 0, 3.05, -0.15)
    box(5.25, 4.95, 0.38, 0.3, 0x111815, 0, 3.1, 1.5)
    box(4.8, 4.48, 0.18, 0.3, 0x030b06, 0, 3.2, 1.73)
    box(2.5, 0.25, 1.95, 0.1, 0x242c27, 0, 0.2, 0)
    box(1.25, 0.55, 1, 0.1, 0x202923, 0, 0.53, -0.15)
    for (let i = 0; i < 9; i++)
      box(
        0.025,
        0.7,
        0.05,
        0.008,
        0x0c100e,
        -2.73,
        3.1,
        -1.25 + i * 0.22
      ).rotation.y = Math.PI / 2
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.035),
      new THREE.MeshBasicMaterial({ color: 0x8eff68 })
    )
    led.position.set(1.94, 0.89, 1.72)
    scene.add(led)
    const button = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.07, 24),
      new THREE.MeshStandardMaterial({
        color: 0x4a554a,
        metalness: 0.4,
        roughness: 0.5,
      })
    )
    button.rotation.x = Math.PI / 2
    button.position.set(2.25, 0.9, 1.75)
    scene.add(button)
    const glow = new THREE.PointLight(0x50ff74, 5, 7, 2)
    glow.position.set(0, 2.4, 2.6)
    scene.add(glow)
    const texture = new THREE.CanvasTexture(source)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_map: { value: texture },
        u_time: { value: 0 },
        u_strength: { value: 0.65 },
        u_glitch: { value: 0 },
      },
      vertexShader: `varying vec2 v_uv; void main(){ v_uv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `
        uniform sampler2D u_map; uniform float u_time,u_strength,u_glitch; varying vec2 v_uv;
        vec3 phosphor(vec2 uv, float blur){
          vec3 c=texture2D(u_map,uv).rgb*.4;
          c+=texture2D(u_map,uv+vec2(blur,0.)).rgb*.15;
          c+=texture2D(u_map,uv-vec2(blur,0.)).rgb*.15;
          c+=texture2D(u_map,uv+vec2(0.,blur)).rgb*.15;
          c+=texture2D(u_map,uv-vec2(0.,blur)).rgb*.15;
          return c;
        }
        void main(){
          vec2 uv=v_uv;
          vec2 q=abs((uv-.5)*2.);
          float radius=pow(pow(q.x,6.)+pow(q.y,6.),1./6.);
          if(radius>1.) discard;
          float outer=smoothstep(.52,1.,radius);
          float blur=outer*outer*.0045*u_strength;
          float fringe=(.0005+outer*outer*.006)*u_strength;
          vec3 c=phosphor(uv,blur);
          c.r=phosphor(uv+vec2(fringe,0.),blur).r;
          c.b=phosphor(uv-vec2(fringe,0.),blur).b;
          c*=mix(1.,.89+.11*sin(uv.y*1280.),u_strength);
          c*=1.-.4*outer*outer;
          float band=exp(-pow((uv.y-fract(u_time*.09))*40.,2.));
          c+=vec3(.008,.06,.015)*band*u_strength;
          if(u_glitch>0. && abs(uv.y-.55-sin(u_time*23.)*.05)<.006) c=phosphor(uv+vec2(.025,0.),blur);
          float rim=exp(-pow((radius-.987)*200.,2.));
          vec3 rainbow=.5+.5*cos(vec3(0.,2.1,4.2)+uv.x*5.+uv.y*3.);
          c+=rim*rainbow*.65*u_strength;
          c+=exp(-pow((radius-.965)*55.,2.))*vec3(.025,.1,.055)*u_strength;
          gl_FragColor=vec4(c,1.);
          #include <colorspace_fragment>
        }`,
    })
    const screenGeometry = new THREE.PlaneGeometry(4.5, 4.25, 64, 64)
    const vertices = screenGeometry.attributes.position
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i) / 2.25
      const y = vertices.getY(i) / 2.125
      vertices.setZ(i, 0.42 * (1 - x * x) * (1 - y * y))
    }
    screenGeometry.computeVertexNormals()
    const screen = new THREE.Mesh(screenGeometry, material)
    screen.position.set(0, 3.2, 1.835)
    scene.add(screen)
    const disconnectScreenInput = connectCurvedScreenInput(
      canvas,
      panel,
      screen,
      camera
    )

    const glassGeometry = screenGeometry.clone()
    glassGeometry.computeVertexNormals()
    const glassMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { u_strength: { value: 0.65 } },
      vertexShader: `varying vec2 v_uv; varying vec3 v_normal; varying vec3 v_world;
        void main(){v_uv=uv; v_normal=normalize(mat3(modelMatrix)*normal); v_world=(modelMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*viewMatrix*vec4(v_world,1.);}`,
      fragmentShader: `uniform float u_strength; varying vec2 v_uv; varying vec3 v_normal; varying vec3 v_world;
        void main(){
          vec2 q=abs((v_uv-.5)*2.);
          float radius=pow(pow(q.x,6.)+pow(q.y,6.),1./6.);
          if(radius>1.) discard;
          vec3 n=normalize(v_normal);
          vec3 view=normalize(cameraPosition-v_world);
          vec3 reflected=reflect(-view,n);
          float studio=pow(max(dot(reflected,normalize(vec3(-.45,.8,1.6))),0.),36.);
          float softbox=exp(-pow((v_uv.y-(.88-.1*v_uv.x))*22.,2.))*exp(-pow((v_uv.x-.3)*2.,2.));
          float fresnel=pow(1.-max(dot(view,n),0.),2.);
          vec3 color=mix(vec3(.43,.72,.65),vec3(.86,.94,1.),studio);
          float alpha=(studio*.14+softbox*.07+fresnel*.22)*u_strength;
          gl_FragColor=vec4(color,alpha);
          #include <colorspace_fragment>
        }`,
    })
    const glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.copy(screen.position)
    glass.position.z += 0.012
    scene.add(glass)

    let dirty = true
    let failed = false
    function paint() {
      try {
        ctx!.reset()
        ctx!.drawElementImage(panel!, 0, 0, source!.width, source!.height)
        texture.needsUpdate = true
        dirty = true
      } catch (error) {
        failed = true
        onError(
          `原生 HTML 繪製失敗：${error instanceof Error ? error.message : "unknown error"}`
        )
      }
    }
    source.addEventListener("paint", paint)
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      dirty = true
    })
    observer.observe(canvas)
    controls.addEventListener("change", () => {
      dirty = true
    })
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const pixelToLocal = new THREE.Matrix4().set(
      4.5 / 640,
      0,
      0,
      -2.25,
      0,
      -4.25 / 640,
      0,
      2.125,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    )
    const transform = new THREE.Matrix4()
    const viewport = new THREE.Matrix4()
    renderer.setAnimationLoop((time) => {
      if (failed || document.hidden) return
      if (!dirty && (motion.matches || !settings.current.effects)) return
      dirty = false
      try {
        scene.updateMatrixWorld()
        camera.updateMatrixWorld()
        viewport.set(
          canvas.clientWidth / 2,
          0,
          0,
          canvas.clientWidth / 2,
          0,
          -canvas.clientHeight / 2,
          0,
          canvas.clientHeight / 2,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        )
        transform
          .copy(viewport)
          .multiply(camera.projectionMatrix)
          .multiply(camera.matrixWorldInverse)
          .multiply(screen.matrixWorld)
          .multiply(pixelToLocal)
        canvas.updateElementGeometry(source, {
          canvasTransform: new DOMMatrix(transform.elements),
        })
        if (settings.current.pendingGlitch) {
          settings.current.glitchUntil = time / 1000 + 0.3
          settings.current.pendingGlitch = false
        }
        material.uniforms.u_time.value = motion.matches ? 0 : time / 1000
        material.uniforms.u_strength.value = settings.current.effects
          ? settings.current.strength
          : 0
        material.uniforms.u_glitch.value =
          !motion.matches && time / 1000 < settings.current.glitchUntil ? 1 : 0
        glassMaterial.uniforms.u_strength.value = settings.current.effects
          ? settings.current.strength
          : 0
        glow.intensity = settings.current.effects ? 5 : 2
        renderer.render(scene, camera)
      } catch (error) {
        failed = true
        onError(
          `3D 繪製失敗：${error instanceof Error ? error.message : "unknown error"}`
        )
      }
    })
    source.requestPaint()
    function lost(event: Event) {
      event.preventDefault()
      failed = true
      onError("WebGL context 遺失，已切回 HTML 播放器。")
    }
    canvas.addEventListener("webglcontextlost", lost)
    return () => {
      renderer.setAnimationLoop(null)
      disconnectScreenInput()
      observer.disconnect()
      source.removeEventListener("paint", paint)
      source.removeEventListener("pointerdown", beginScreenGesture)
      source.removeEventListener("wheel", screenWheel)
      window.removeEventListener("pointerup", endScreenGesture, true)
      window.removeEventListener("pointercancel", endScreenGesture, true)
      canvas.removeEventListener("webglcontextlost", lost)
      canvas.clearElementGeometry(source)
      controls.dispose()
      sceneControls.current = null
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material]
          materials.forEach((item) => item.dispose())
        }
      })
      texture.dispose()
      renderer.dispose()
    }
  }, [enabled, supported, onError])
  return {
    supported,
    canvasRef,
    sourceRef,
    panelRef,
    sceneControls,
    signalGlitch,
  }
}
