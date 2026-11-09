import {
  MercatorCoordinate,
  type CustomLayerInterface,
  type Map as CityMap,
} from "maplibre-gl"

export type ProjectionSettings = {
  altitude: number
  strength: number
  occlusion: boolean
  frozen: boolean
}

export type DrawableMapCanvas = HTMLCanvasElement & {
  content: string
  requestPaint(): void
  getElementImageDefaultSize(element: Element): {
    width: number
    height: number
  }
  updateElementGeometry(
    element: Element,
    options: { canvasTransform: DOMMatrix }
  ): void
  clearElementGeometry(element: Element): void
}

type NativeGL = WebGL2RenderingContext & {
  texElementSubImage2D(
    target: number,
    level: number,
    x: number,
    y: number,
    element: Element
  ): void
}

const vertexSource = `#version 300 es
in vec2 a_position;
uniform mat4 u_matrix;
uniform vec2 u_size;
out vec2 v_uv;
void main() {
  v_uv = a_position;
  gl_Position = u_matrix * vec4(a_position * u_size, 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_strength;
uniform float u_opacity;
in vec2 v_uv;
out vec4 color;
void main() {
  vec4 pixel = texture(u_texture, v_uv);
  if (pixel.a < 0.01) discard;
  float lines = 0.92 + 0.08 * sin(v_uv.y * 850.0);
  float sweep = pow(max(0.0, 1.0 - abs(v_uv.y - fract(u_time * 0.15)) * 22.0), 2.0);
  vec3 tint = vec3(0.16, 1.0, 0.8);
  vec3 rgb = pixel.rgb * mix(1.0, lines, u_strength);
  rgb += tint * sweep * u_strength * 0.18 * pixel.a;
  color = vec4(rgb, pixel.a) * u_opacity;
}`

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("Unable to create projection shader")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message =
      gl.getShaderInfoLog(shader) || "Projection shader compilation failed"
    gl.deleteShader(shader)
    throw new Error(message)
  }
  return shader
}

export function createHtmlProjectionLayer(
  elements: HTMLElement[],
  initial: ProjectionSettings,
  onError: (message: string) => void
) {
  let settings = initial
  let map: CityMap
  let gl: NativeGL
  let program: WebGLProgram | null = null
  let vao: WebGLVertexArrayObject | null = null
  let buffer: WebGLBuffer | null = null
  let rayBuffer: WebGLBuffer | null = null
  let rayVao: WebGLVertexArrayObject | null = null
  let rayTexture: WebGLTexture | null = null
  let failed = false
  const textures: {
    texture: WebGLTexture
    width: number
    height: number
    ready: boolean
    lean: number
  }[] = []
  const uniforms: Record<string, WebGLUniformLocation | null> = {}
  const canvas = () => map.getCanvas() as DrawableMapCanvas

  function upload() {
    if (failed) return
    const active = gl.getParameter(gl.ACTIVE_TEXTURE) as number
    gl.activeTexture(gl.TEXTURE0)
    const binding = gl.getParameter(
      gl.TEXTURE_BINDING_2D
    ) as WebGLTexture | null
    try {
      elements.forEach((element, index) => {
        const entry = textures[index]
        const size = canvas().getElementImageDefaultSize(element)
        const width = Math.ceil(size.width)
        const height = Math.ceil(size.height)
        if (!width || !height) return
        gl.bindTexture(gl.TEXTURE_2D, entry.texture)
        if (entry.width !== width || entry.height !== height) {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            width,
            height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
          )
          entry.width = width
          entry.height = height
        }
        gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, element)
        entry.ready = true
      })
      map.triggerRepaint()
    } catch (error) {
      failed = true
      onError(
        error instanceof Error
          ? error.message
          : "Native HTML texture upload failed"
      )
    } finally {
      gl.bindTexture(gl.TEXTURE_2D, binding)
      gl.activeTexture(active)
    }
  }

  const layer: CustomLayerInterface & {
    configure(next: ProjectionSettings): void
  } = {
    id: "html-projections",
    type: "custom",
    renderingMode: "3d",
    configure(next) {
      settings = next
      map?.triggerRepaint()
    },
    onAdd(instance, context) {
      map = instance
      gl = context as NativeGL
      const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
      const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
      program = gl.createProgram()
      if (!program) throw new Error("Unable to create projection program")
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(
          gl.getProgramInfoLog(program) || "Projection shader link failed"
        )
      for (const name of [
        "u_matrix",
        "u_size",
        "u_texture",
        "u_time",
        "u_strength",
        "u_opacity",
      ])
        uniforms[name] = gl.getUniformLocation(program, name)
      vao = gl.createVertexArray()
      buffer = gl.createBuffer()
      gl.bindVertexArray(vao)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
        gl.STATIC_DRAW
      )
      const position = gl.getAttribLocation(program, "a_position")
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      gl.bindVertexArray(null)
      rayVao = gl.createVertexArray()
      rayBuffer = gl.createBuffer()
      gl.bindVertexArray(rayVao)
      gl.bindBuffer(gl.ARRAY_BUFFER, rayBuffer)
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      gl.bindVertexArray(null)
      rayTexture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, rayTexture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([170, 125, 72, 190])
      )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      elements.forEach(() => {
        const texture = gl.createTexture()
        if (!texture) throw new Error("Unable to allocate HTML texture")
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        textures.push({ texture, width: 0, height: 0, ready: false, lean: 0 })
      })
      canvas().addEventListener("paint", upload)
      canvas().requestPaint()
    },
    render(context, options) {
      if (failed || !program) return
      const projection = new DOMMatrix(
        Array.from(options.defaultProjectionData.mainMatrix)
      )
      const viewport = new DOMMatrix()
        .translate(canvas().clientWidth / 2, canvas().clientHeight / 2)
        .scale(canvas().clientWidth / 2, -canvas().clientHeight / 2, 1)

      context.useProgram(program)
      context.bindVertexArray(vao)
      context.activeTexture(context.TEXTURE0)
      context.uniform1i(uniforms.u_texture, 0)
      context.uniform1f(
        uniforms.u_time,
        settings.frozen ? 0 : performance.now() / 1000
      )
      context.uniform1f(uniforms.u_strength, settings.strength)
      context.enable(context.BLEND)
      context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA)
      if (settings.occlusion) context.enable(context.DEPTH_TEST)
      else context.disable(context.DEPTH_TEST)
      context.depthMask(false)
      context.disable(context.CULL_FACE)

      let transitioning = false
      elements.forEach((element, index) => {
        if (!textures[index]?.ready) return
        const width = element.offsetWidth,
          height = element.offsetHeight
        const origin = MercatorCoordinate.fromLngLat([
          Number(element.dataset.longitude),
          Number(element.dataset.latitude),
        ])
        const unit = origin.meterInMercatorCoordinateUnits()
        const anchor = projection.transformPoint(
          new DOMPoint(origin.x, origin.y, settings.altitude * unit, 1)
        )
        if (anchor.w <= 0) {
          canvas().clearElementGeometry(element)
          return
        }
        // Clip-space offsets multiplied by w keep HTML dimensions in CSS pixels.
        const sx = (2 * anchor.w) / canvas().clientWidth
        const sy = (2 * anchor.w) / canvas().clientHeight
        const screenX = ((anchor.x / anchor.w + 1) * canvas().clientWidth) / 2
        const screenY = ((1 - anchor.y / anchor.w) * canvas().clientHeight) / 2
        const rank = elements.length - index - 1
        const cardX = Math.max(
          24,
          Math.min(screenX + 25 + rank * 14, canvas().clientWidth - width - 24)
        )
        const cardY = Math.max(
          45,
          Math.min(
            screenY - height * 0.72 - rank * 12,
            canvas().clientHeight - height - 45
          )
        )
        const left = cardX - screenX
        const top = cardY - screenY
        const billboard = new DOMMatrix([
          sx,
          0,
          0,
          0,
          0,
          -sy,
          0,
          0,
          0,
          0,
          1,
          0,
          anchor.x + left * sx,
          anchor.y - top * sy,
          anchor.z,
          anchor.w,
        ])
        const hover = element.matches(":hover, :focus-within") ? 1 : 0
        const entry = textures[index]
        const targetLean = settings.frozen ? 0 : hover
        entry.lean += (targetLean - entry.lean) * 0.14
        if (Math.abs(targetLean - entry.lean) > 0.001) transitioning = true
        const lens = new DOMMatrix()
        lens.m34 = -1 / 900
        const pose = new DOMMatrix()
          .translate(width / 2, height / 2)
          .multiply(lens)
          .rotateAxisAngle(1, 0, 0, entry.lean * 35)
          .rotate(0, 0, -Math.min(rank, 4) * 1.5)
          .scale(1 - entry.lean * 0.06)
          .translate(-width / 2, -height / 2)
        const clip = billboard.multiply(pose)
        const depth = anchor.z / anchor.w
        clip.m13 = depth * clip.m14
        clip.m23 = depth * clip.m24
        clip.m43 = depth * clip.m44
        clip.m33 = 1
        context.bindVertexArray(vao)
        context.uniform1f(uniforms.u_strength, settings.strength)
        context.uniform1f(
          uniforms.u_opacity,
          element.dataset.active === "true" ? 1 : 0.85
        )
        context.uniformMatrix4fv(
          uniforms.u_matrix,
          false,
          new Float32Array(clip.toFloat64Array())
        )
        context.uniform2f(uniforms.u_size, width, height)
        context.bindTexture(context.TEXTURE_2D, textures[index].texture)
        context.drawArrays(context.TRIANGLES, 0, 6)
        const ground = projection.transformPoint(
          new DOMPoint(origin.x, origin.y, 0, 1)
        )
        const groundX = ((ground.x / ground.w + 1) * canvas().clientWidth) / 2
        const groundY = ((1 - ground.y / ground.w) * canvas().clientHeight) / 2
        context.bindVertexArray(rayVao)
        context.bindBuffer(context.ARRAY_BUFFER, rayBuffer)
        context.bufferData(
          context.ARRAY_BUFFER,
          new Float32Array([
            0.5,
            1,
            (groundX - cardX) / width,
            (groundY - cardY) / height,
          ]),
          context.DYNAMIC_DRAW
        )
        context.uniformMatrix4fv(
          uniforms.u_matrix,
          false,
          new Float32Array(billboard.toFloat64Array())
        )
        context.uniform1f(uniforms.u_strength, 0)
        context.uniform1f(uniforms.u_opacity, 0.5 + entry.lean * 0.5)
        context.bindTexture(context.TEXTURE_2D, rayTexture)
        context.drawArrays(context.LINES, 0, 2)
        const groundClip = new DOMMatrix([
          2 / canvas().clientWidth,
          0,
          0,
          0,
          0,
          -2 / canvas().clientHeight,
          0,
          0,
          0,
          0,
          1,
          0,
          -1,
          1,
          ground.z / ground.w,
          1,
        ])
        context.uniformMatrix4fv(
          uniforms.u_matrix,
          false,
          new Float32Array(groundClip.toFloat64Array())
        )
        context.uniform2f(uniforms.u_size, 1, 1)
        for (let ring = 0; ring < 3; ring++) {
          const phase =
            ((settings.frozen ? 0 : performance.now() / 6000) + ring / 3) % 1
          const radius = (20 + phase * 75) * unit
          const points = new Float32Array(130)
          for (let step = 0; step <= 64; step++) {
            const angle = (step / 64) * Math.PI * 2
            const point = projection.transformPoint(
              new DOMPoint(
                origin.x + Math.cos(angle) * radius,
                origin.y + Math.sin(angle) * radius,
                0,
                1
              )
            )
            points[step * 2] =
              ((point.x / point.w + 1) * canvas().clientWidth) / 2
            points[step * 2 + 1] =
              ((1 - point.y / point.w) * canvas().clientHeight) / 2
          }
          context.uniform1f(
            uniforms.u_opacity,
            (1 - phase) * (0.25 + entry.lean * 0.75)
          )
          context.bufferData(context.ARRAY_BUFFER, points, context.DYNAMIC_DRAW)
          context.drawArrays(context.LINE_STRIP, 0, 65)
        }
        canvas().updateElementGeometry(element, {
          canvasTransform: viewport.multiply(clip),
        })
      })
      context.bindVertexArray(null)
      if (transitioning || (!settings.frozen && settings.strength > 0))
        map.triggerRepaint()
    },
    onRemove() {
      canvas().removeEventListener("paint", upload)
      elements.forEach((element) => canvas().clearElementGeometry(element))
      textures.forEach(({ texture }) => gl.deleteTexture(texture))
      gl.deleteBuffer(buffer)
      gl.deleteBuffer(rayBuffer)
      gl.deleteVertexArray(rayVao)
      gl.deleteTexture(rayTexture)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
    },
  }
  return layer
}
