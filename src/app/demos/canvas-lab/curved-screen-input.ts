import * as THREE from "three"

/** Map curved-screen pointer positions back into the native HTML layout plane. */
export function connectCurvedScreenInput(
  canvas: HTMLCanvasElement,
  panel: HTMLElement,
  screen: THREE.Mesh<THREE.PlaneGeometry>,
  camera: THREE.PerspectiveCamera
) {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const local = new THREE.Vector3()
  const flatPlane = new THREE.Plane()
  const flatNormal = new THREE.Vector3()
  const flatOrigin = new THREE.Vector3()
  const forwarded = new WeakSet<Event>()
  let gesture: { id: number; target: Element } | null = null

  function mapPoint(event: MouseEvent, allowOutside: boolean) {
    const bounds = canvas.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      1 - ((event.clientY - bounds.top) / bounds.height) * 2
    )
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObject(screen, false)[0]
    if (hit?.uv) {
      const x = Math.abs(hit.uv.x * 2 - 1)
      const y = Math.abs(hit.uv.y * 2 - 1)
      if (!allowOutside && x ** 6 + y ** 6 > 1) return null
      local.set((hit.uv.x - 0.5) * 4.5, (hit.uv.y - 0.5) * 4.25, 0)
    } else {
      if (!allowOutside) return null
      flatNormal.set(0, 0, 1).transformDirection(screen.matrixWorld)
      flatOrigin.setFromMatrixPosition(screen.matrixWorld)
      flatPlane.setFromNormalAndCoplanarPoint(flatNormal, flatOrigin)
      if (!raycaster.ray.intersectPlane(flatPlane, local)) return null
      screen.worldToLocal(local)
      local.z = 0
    }
    local.applyMatrix4(screen.matrixWorld).project(camera)
    return {
      x: bounds.left + ((local.x + 1) * bounds.width) / 2,
      y: bounds.top + ((1 - local.y) * bounds.height) / 2,
    }
  }

  function routePointer(event: PointerEvent) {
    if (forwarded.has(event)) return
    if (event.type !== "pointerdown" && gesture?.id !== event.pointerId) return
    const point = mapPoint(event, gesture !== null)
    if (!point) return
    const target =
      gesture?.target ?? document.elementFromPoint(point.x, point.y)
    if (!target || !panel.contains(target)) return
    if (event.type === "pointerdown") {
      gesture = { id: event.pointerId, target }
      const focusable = target.closest<HTMLElement>(
        "input, button, [tabindex]:not([tabindex='-1'])"
      )
      focusable?.focus({ preventScroll: true })
    }
    event.preventDefault()
    event.stopImmediatePropagation()
    const mapped = new PointerEvent(event.type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: point.x,
      clientY: point.y,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      isPrimary: event.isPrimary,
      button: event.button,
      buttons: event.buttons,
      pressure: event.pressure,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
    })
    forwarded.add(mapped)
    target.dispatchEvent(mapped)
    // preventDefault on the real pointer suppresses compatibility mouse events.
    // Base UI uses mousedown for opening Autocomplete, so mirror that sequence.
    if (event.pointerType === "mouse" && !mapped.defaultPrevented) {
      const mouseType =
        event.type === "pointerdown"
          ? "mousedown"
          : event.type === "pointerup"
            ? "mouseup"
            : null
      if (mouseType) {
        const mouse = new MouseEvent(mouseType, {
          bubbles: true,
          cancelable: true,
          composed: true,
          clientX: point.x,
          clientY: point.y,
          button: event.button,
          buttons: event.buttons,
          shiftKey: event.shiftKey,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
        })
        forwarded.add(mouse)
        target.dispatchEvent(mouse)
      }
    }
    if (event.type === "pointerup" || event.type === "pointercancel")
      gesture = null
  }

  function routeClick(event: MouseEvent) {
    if (forwarded.has(event) || event.detail === 0) return
    const point = mapPoint(event, false)
    if (!point) return
    const target = document.elementFromPoint(point.x, point.y)
    if (!target || !panel.contains(target)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    const mapped = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: point.x,
      clientY: point.y,
      button: event.button,
      detail: event.detail,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
    })
    forwarded.add(mapped)
    target.dispatchEvent(mapped)
  }

  const pointerEvents = [
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
  ] as const
  pointerEvents.forEach((type) =>
    canvas.addEventListener(type, routePointer, true)
  )
  canvas.addEventListener("click", routeClick, true)
  return () => {
    pointerEvents.forEach((type) =>
      canvas.removeEventListener(type, routePointer, true)
    )
    canvas.removeEventListener("click", routeClick, true)
    gesture = null
  }
}
