"use client"

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useSyncExternalStore,
} from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
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
  onError: (message: string) => void,
  onHardwareAction: (action: "play" | "pause" | "previous" | "next") => void
) {
  const hardwareAction = useEffectEvent(onHardwareAction)
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
    glitchUntil: 0,
    pendingGlitch: false,
  })

  const signalGlitch = useCallback(() => {
    settings.current.pendingGlitch = true
  }, [])

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
    const screenGeometry = new THREE.BufferGeometry()
    const screen = new THREE.Mesh(screenGeometry, material)
    screen.visible = false
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
    glass.visible = false
    scene.add(glass)

    let disposed = false
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
    const pixelToLocal = new THREE.Matrix4()
    const hardwareButtons = new Map<
      THREE.Object3D,
      {
        action: "play" | "pause" | "previous" | "next"
        label: string
      }
    >()
    const presses = new Map<THREE.Object3D, { z: number; start: number }>()
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hardwareModel: THREE.Group | null = null
    let buttonGesture: {
      id: number
      x: number
      y: number
      button: THREE.Object3D
    } | null = null
    function pickButton(event: PointerEvent) {
      if (!hardwareModel) return null
      const bounds = canvas!.getBoundingClientRect()
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        1 - ((event.clientY - bounds.top) / bounds.height) * 2
      )
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster
        .intersectObject(hardwareModel, true)
        .find(({ object }) => {
          for (
            let node: THREE.Object3D | null = object;
            node;
            node = node.parent
          )
            if (!node.visible) return false
          return true
        })
      return hit && hardwareButtons.has(hit.object) ? hit.object : null
    }
    function hardwareDown(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return
      const button = pickButton(event)
      if (!button) return
      buttonGesture = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        button,
      }
      controls.enabled = false
      canvas!.setPointerCapture(event.pointerId)
      event.stopImmediatePropagation()
    }
    function hardwareUp(event: PointerEvent) {
      if (buttonGesture?.id !== event.pointerId) return
      const { x, y, button } = buttonGesture
      buttonGesture = null
      controls.enabled = true
      if (canvas!.hasPointerCapture(event.pointerId))
        canvas!.releasePointerCapture(event.pointerId)
      event.stopImmediatePropagation()
      if (
        Math.hypot(event.clientX - x, event.clientY - y) > 6 ||
        pickButton(event) !== button
      )
        return
      const binding = hardwareButtons.get(button)!
      presses.set(button, {
        z: presses.get(button)?.z ?? button.position.z,
        start: performance.now(),
      })
      dirty = true
      hardwareAction(binding.action)
    }
    function hardwareCancel() {
      if (!buttonGesture) return
      buttonGesture = null
      controls.enabled = true
    }
    function hardwareHover(event: PointerEvent) {
      if (event.buttons) return
      const button = pickButton(event)
      canvas!.style.cursor = button ? "pointer" : ""
      canvas!.title = button ? hardwareButtons.get(button)!.label : ""
    }
    canvas.addEventListener("pointerdown", hardwareDown, true)
    canvas.addEventListener("pointerup", hardwareUp, true)
    canvas.addEventListener("pointercancel", hardwareCancel, true)
    canvas.addEventListener("lostpointercapture", hardwareCancel)
    canvas.addEventListener("pointermove", hardwareHover)

    function disposeModel(root: THREE.Object3D) {
      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      const textures = new Set<THREE.Texture>()
      root.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        geometries.add(object.geometry)
        for (const item of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          materials.add(item)
          for (const value of Object.values(item)) {
            if (value instanceof THREE.Texture) textures.add(value)
          }
        }
      })
      geometries.forEach((item) => item.dispose())
      materials.forEach((item) => item.dispose())
      textures.forEach((item) => item.dispose())
    }
    new GLTFLoader().load(
      "/models/rea-felix-room/tv.glb",
      ({ scene: model }) => {
        if (disposed) {
          disposeModel(model)
          return
        }
        const modelScreen = model.getObjectByName("screen")
        if (!(modelScreen instanceof THREE.Mesh)) {
          disposeModel(model)
          onError("TV 模型缺少螢幕，已切回 HTML 播放器。")
          return
        }
        // The loose cassette is separate from the TV/VCR hardware.
        const hardware = new THREE.Box3()
        for (const child of model.children) {
          if (child.name.startsWith("tape_")) child.visible = false
          else hardware.expandByObject(child, true)
        }
        const center = hardware.getCenter(new THREE.Vector3())
        const scale = 6 / hardware.getSize(new THREE.Vector3()).y
        model.scale.setScalar(scale)
        model.position.set(
          -center.x * scale,
          -hardware.min.y * scale,
          -center.z * scale
        )
        model.updateMatrixWorld(true)
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = object.receiveShadow = true
          }
        })
        hardwareModel = model
        const bindings = [
          { action: "play", label: "播放" },
          { action: "pause", label: "暫停" },
          { action: "previous", label: "上一首" },
          { action: "next", label: "下一首" },
        ] as const
        bindings.forEach((binding, index) => {
          for (const name of [`btn_${index}`, `vcr_btn_${index}`]) {
            const button = model.getObjectByName(name)
            if (button) hardwareButtons.set(button, binding)
          }
        })
        scene.add(model)
        const geometry = modelScreen.geometry.clone()
        geometry.applyMatrix4(modelScreen.matrixWorld)
        geometry.computeBoundingBox()
        const bounds = geometry.boundingBox!
        const size = bounds.getSize(new THREE.Vector3())
        const origin = bounds.getCenter(new THREE.Vector3())
        origin.z = bounds.min.z + 0.005
        geometry.translate(-origin.x, -origin.y, -origin.z)
        // The glTF uses top-down UVs; our canvas shader uses bottom-up UVs.
        const uv = geometry.attributes.uv
        for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i))
        uv.needsUpdate = true
        screen.geometry.dispose()
        screen.geometry = geometry
        screen.position.copy(origin)
        screen.visible = true
        modelScreen.visible = false
        glass.geometry.dispose()
        glass.geometry = geometry.clone()
        glass.position.copy(origin)
        glass.position.z += 0.012
        glass.visible = true
        pixelToLocal.set(
          size.x / source.clientWidth,
          0,
          0,
          -size.x / 2,
          0,
          -size.y / source.clientHeight,
          0,
          size.y / 2,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        )
        glow.position.copy(origin).add(new THREE.Vector3(0, 0, 1))
        dirty = true
        source.requestPaint()
      },
      undefined,
      () => {
        if (!disposed) onError("TV 模型載入失敗，已切回 HTML 播放器。")
      }
    )
    const transform = new THREE.Matrix4()
    const viewport = new THREE.Matrix4()
    renderer.setAnimationLoop((time) => {
      if (failed || document.hidden) return
      if (!dirty && motion.matches && presses.size === 0) return
      dirty = false
      try {
        for (const [button, press] of presses) {
          const progress = Math.min(1, (time - press.start) / 160)
          button.position.z =
            press.z -
            (motion.matches ? 0 : Math.sin(progress * Math.PI) * 0.0024)
          if (progress === 1) presses.delete(button)
        }
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
        material.uniforms.u_strength.value = 0.65
        material.uniforms.u_glitch.value =
          !motion.matches && time / 1000 < settings.current.glitchUntil ? 1 : 0
        glassMaterial.uniforms.u_strength.value = 0.65
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
      disposed = true
      renderer.setAnimationLoop(null)
      disconnectScreenInput()
      canvas.removeEventListener("pointerdown", hardwareDown, true)
      canvas.removeEventListener("pointerup", hardwareUp, true)
      canvas.removeEventListener("pointercancel", hardwareCancel, true)
      canvas.removeEventListener("lostpointercapture", hardwareCancel)
      canvas.removeEventListener("pointermove", hardwareHover)
      canvas.style.cursor = ""
      canvas.removeAttribute("title")
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
      disposeModel(scene)
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
