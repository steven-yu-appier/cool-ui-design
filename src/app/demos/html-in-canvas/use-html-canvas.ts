"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

type HtmlCanvas = HTMLCanvasElement & { requestPaint(): void; content: string }
type HtmlContext = CanvasRenderingContext2D & {
  drawElementImage(
    element: Element,
    x: number,
    y: number,
    width: number,
    height: number
  ): void
}

const subscribe = () => () => {}

export function supportsHtmlCanvas() {
  const canvas = document.createElement("canvas") as HtmlCanvas
  canvas.setAttribute("content", "drawable")
  return (
    canvas.content === "drawable" &&
    typeof canvas.requestPaint === "function" &&
    typeof CanvasRenderingContext2D.prototype === "object" &&
    "drawElementImage" in CanvasRenderingContext2D.prototype
  )
}

export function useHtmlCanvas(
  enabled: boolean,
  scanlines: boolean,
  onError: (message: string) => void
) {
  const supported = useSyncExternalStore(
    subscribe,
    supportsHtmlCanvas,
    () => false
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!supported || !enabled) return
    const canvas = canvasRef.current as HtmlCanvas | null
    const panel = panelRef.current
    if (!canvas || !panel) return
    const context = canvas.getContext("2d") as HtmlContext | null
    if (!context) {
      onError("無法建立 2D Canvas context，已切回 DOM 預覽。")
      return
    }

    let failed = false
    function paint() {
      if (!canvas || !panel || !context || failed) return
      try {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawElementImage(panel, 0, 0, canvas.width, canvas.height)
        if (scanlines) {
          context.fillStyle = "rgba(0, 0, 0, 0.13)"
          const spacing = 4 * window.devicePixelRatio
          for (let y = 0; y < canvas.height; y += spacing) {
            context.fillRect(0, y, canvas.width, window.devicePixelRatio)
          }
        }
      } catch (error) {
        failed = true
        onError(
          `原生繪製失敗，已切回 DOM 預覽。${error instanceof Error ? error.message : ""}`
        )
      }
    }

    const observer = new ResizeObserver(([entry]) => {
      const deviceSize = entry.devicePixelContentBoxSize?.[0]
      const width =
        deviceSize?.inlineSize ??
        Math.round(entry.contentRect.width * window.devicePixelRatio)
      const height =
        deviceSize?.blockSize ??
        Math.round(entry.contentRect.height * window.devicePixelRatio)
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      canvas.requestPaint()
    })
    canvas.addEventListener("paint", paint)
    observer.observe(canvas, {
      box:
        "devicePixelContentBoxSize" in ResizeObserverEntry.prototype
          ? "device-pixel-content-box"
          : "content-box",
    })
    canvas.requestPaint()

    return () => {
      observer.disconnect()
      canvas.removeEventListener("paint", paint)
    }
  }, [supported, enabled, scanlines, onError])

  return { supported, canvasRef, panelRef }
}
