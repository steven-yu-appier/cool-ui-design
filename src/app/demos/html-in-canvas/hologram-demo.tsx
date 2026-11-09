"use client"

import { useCallback, useState, type CSSProperties } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Crosshair,
  Move3d,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ScanLine,
  Send,
  Sparkles,
} from "lucide-react"
import { useHtmlCanvas } from "./use-html-canvas"

const colors = [
  { name: "Ion cyan", value: "#70f5d4" },
  { name: "Solar amber", value: "#ffbd69" },
  { name: "Signal violet", value: "#b6a1ff" },
] as const

const code = `<canvas content="drawable">
  <form drawable>…real HTML inputs…</form>
</canvas>

canvas.addEventListener("paint", () => {
  ctx.drawElementImage(form, 0, 0, width, height);
});
canvas.requestPaint();`

export function HologramDemo() {
  const [mode, setMode] = useState<"canvas" | "dom">("canvas")
  const [accent, setAccent] = useState<string>(colors[0].value)
  const [orbit, setOrbit] = useState(true)
  const [scanlines, setScanlines] = useState(true)
  const [tilt, setTilt] = useState(-14)
  const [name, setName] = useState("Aurora station")
  const [online, setOnline] = useState(true)
  const [power, setPower] = useState(72)
  const [transmissions, setTransmissions] = useState(0)
  const [error, setError] = useState("")
  const handleError = useCallback((message: string) => setError(message), [])
  const { supported, canvasRef, panelRef } = useHtmlCanvas(
    mode === "canvas" && !error,
    scanlines,
    handleError
  )
  const native = mode === "canvas" && supported && !error

  function resetView() {
    setOrbit(true)
    setTilt(-14)
    setAccent(colors[0].value)
    setScanlines(true)
  }

  const panel = (
    <div
      ref={panelRef}
      {...(native ? { drawable: "" } : {})}
      className="holo-panel"
      style={{ "--holo-accent": accent } as CSSProperties}
    >
      <div className="panel-topline">
        <span>
          <Radio size={13} /> DEEP SPACE NETWORK
        </span>
        <span>CH / 001</span>
      </div>
      <div className="panel-heading">
        <div>
          <span className="micro-label">REMOTE TERMINAL</span>
          <h2>
            Mission control<span>_</span>
          </h2>
        </div>
        <Crosshair size={25} strokeWidth={1} />
      </div>
      <div className="orbital-display" aria-hidden="true">
        <svg viewBox="0 0 320 130" fill="none">
          <path
            d="M0 65h320M160 0v130"
            stroke="currentColor"
            opacity=".12"
            strokeDasharray="3 5"
          />
          <ellipse
            cx="160"
            cy="65"
            rx="100"
            ry="32"
            stroke="currentColor"
            opacity=".35"
            transform="rotate(-20 160 65)"
          />
          <ellipse
            cx="160"
            cy="65"
            rx="100"
            ry="32"
            stroke="currentColor"
            opacity=".35"
            transform="rotate(20 160 65)"
          />
          <circle
            cx="160"
            cy="65"
            r="37"
            fill="currentColor"
            fillOpacity=".06"
            stroke="currentColor"
            strokeOpacity=".5"
          />
          <ellipse
            cx="160"
            cy="65"
            rx="15"
            ry="37"
            stroke="currentColor"
            opacity=".3"
          />
          <path
            d="M125 53h70M125 77h70M123 65h74"
            stroke="currentColor"
            opacity=".25"
          />
          <circle cx="160" cy="65" r="5" fill="currentColor" />
          <circle cx="249" cy="34" r="4" fill="currentColor" />
          <circle cx="72" cy="93" r="3" fill="currentColor" />
          <path
            d="M18 16h16M18 16v16M302 16h-16M302 16v16M18 114h16M18 114V98M302 114h-16M302 114V98"
            stroke="currentColor"
            opacity=".5"
          />
        </svg>
        <span className="orbit-coordinate">SECTOR 07 · EARTH RELAY</span>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setTransmissions((count) => count + 1)
        }}
      >
        <label className="micro-label" htmlFor="station-name">
          STATION NAME
        </label>
        <input
          id="station-name"
          value={name}
          maxLength={28}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="panel-control-row">
          <div>
            <span className="micro-label">UPLINK</span>
            <span className="control-description">
              {online ? "Connection established" : "Standing by"}
            </span>
          </div>
          <button
            className="holo-switch"
            type="button"
            role="switch"
            aria-label="Uplink"
            aria-checked={online}
            onClick={() => setOnline((value) => !value)}
          >
            <span />
          </button>
        </div>
        <div className="power-label">
          <label className="micro-label" htmlFor="signal-power">
            SIGNAL POWER
          </label>
          <output htmlFor="signal-power">
            {power}
            <small>%</small>
          </output>
        </div>
        <input
          id="signal-power"
          className="holo-range"
          type="range"
          min={0}
          max={100}
          value={power}
          onChange={(event) => setPower(event.target.valueAsNumber)}
        />
        <button className="transmit-button" type="submit" disabled={!online}>
          <Send size={14} /> TRANSMIT SIGNAL <ArrowUpRight size={15} />
        </button>
      </form>
      <div className="panel-bottomline" role="status" aria-live="polite">
        <span className={online ? "connection-dot online" : "connection-dot"} />
        <span>
          {transmissions
            ? `SIGNAL ${String(transmissions).padStart(3, "0")} SENT · ${name || "UNNAMED"}`
            : "AWAITING YOUR COMMAND"}
        </span>
        <span>↗</span>
      </div>
    </div>
  )

  return (
    <main
      className="holo-app"
      style={
        {
          "--holo-accent": accent,
          "--holo-tilt": `${tilt}deg`,
        } as CSSProperties
      }
    >
      <header className="holo-header">
        <Link href="/" className="holo-brand">
          <ArrowLeft size={15} />
          <span>COOL UI DESIGN</span>
        </Link>
        <span className="header-tag">
          EXPERIMENT 004 <span>/</span> HTML-IN-CANVAS
        </span>
        <a
          href="https://developer.chrome.com/docs/web-platform/html-in-canvas"
          target="_blank"
          rel="noreferrer"
        >
          API DOCS <ArrowUpRight size={13} />
        </a>
      </header>
      <div className="holo-intro">
        <div>
          <p className="holo-eyebrow">
            <span /> BROWSER EXPERIMENTS / VOL. 04
          </p>
          <h1>
            Beyond the <span>DOM.</span>
          </h1>
          <p className="holo-subtitle">
            真正的 HTML。另一個維度。 把可互動的介面，投射進 Canvas。
          </p>
        </div>
        <div className="intro-stamp">
          <Move3d size={29} strokeWidth={1} />
          <span>
            HTML → PIXELS
            <br />
            STILL INTERACTIVE.
          </span>
        </div>
      </div>
      <div className="holo-workspace">
        <section
          className={`holo-stage ${mode === "dom" ? "is-dom" : ""}`}
          aria-label="Holographic control panel"
        >
          <div className="stage-topline">
            <span>
              <span className="connection-dot online" />
              {mode === "dom"
                ? "SOURCE / DOM"
                : native
                  ? "LIVE / NATIVE CANVAS"
                  : "LIVE / DOM PREVIEW"}
            </span>
            <span>HOLO PROJECTION / 01</span>
          </div>
          <div className="stage-grid" aria-hidden="true" />
          <div className="stage-cross cross-tl" aria-hidden="true">
            +
          </div>
          <div className="stage-cross cross-br" aria-hidden="true">
            +
          </div>
          <div className="projection-base" aria-hidden="true" />
          <div
            className={`holo-scene ${orbit && mode === "canvas" ? "is-orbiting" : ""}`}
          >
            <div className="panel-ghost ghost-back" aria-hidden="true" />
            <div className="panel-ghost ghost-front" aria-hidden="true" />
            <div className="panel-surface">
              {native ? (
                <canvas
                  ref={canvasRef}
                  {...{ content: "drawable" }}
                  width={380}
                  height={500}
                  className="holo-canvas"
                >
                  {panel}
                </canvas>
              ) : (
                panel
              )}
              {!native && mode === "canvas" && scanlines ? (
                <div className="scanline-overlay" aria-hidden="true" />
              ) : null}
            </div>
          </div>
          {transmissions > 0 && mode === "canvas" ? (
            <div
              key={transmissions}
              className="transmission-ring"
              aria-hidden="true"
            />
          ) : null}
          <div className="stage-bottomline">
            <span>
              <Crosshair size={12} />{" "}
              {mode === "dom"
                ? "ORIGINAL HTML / SAME STATE"
                : "HOVER OR FOCUS TO STEADY THE PANEL"}
            </span>
            <span>X / Y / Z</span>
          </div>
        </section>
        <aside className="holo-controls" aria-label="Projection settings">
          <div className="controls-title">
            <span className="micro-label">PROJECTION LAB</span>
            <Sparkles size={16} />
          </div>
          <div className="setting-group">
            <span className="setting-index">01 / RENDERER</span>
            <div className="renderer-switch" role="group" aria-label="Renderer">
              <button
                type="button"
                aria-pressed={mode === "canvas"}
                onClick={() => setMode("canvas")}
              >
                <ScanLine size={14} /> Canvas
              </button>
              <button
                type="button"
                aria-pressed={mode === "dom"}
                onClick={() => setMode("dom")}
              >
                <Code2 size={14} /> DOM
              </button>
            </div>
            <p>切換渲染方式，輸入與控制狀態會保留。</p>
          </div>
          <div className="setting-group">
            <span className="setting-index">02 / PHOSPHOR</span>
            <div
              className="color-options"
              role="group"
              aria-label="Phosphor color"
            >
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  aria-label={color.name}
                  aria-pressed={accent === color.value}
                  style={{ "--swatch": color.value } as CSSProperties}
                  onClick={() => setAccent(color.value)}
                >
                  <span />
                  {color.name.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-group">
            <span className="setting-index">03 / SPATIAL CONTROLS</span>
            <div className="setting-row">
              <span>Auto orbit</span>
              <button
                className="icon-toggle"
                type="button"
                aria-label={orbit ? "Pause orbit" : "Resume orbit"}
                aria-pressed={orbit}
                onClick={() => setOrbit((value) => !value)}
                disabled={mode === "dom"}
              >
                {orbit ? <Pause size={13} /> : <Play size={13} />}
                {orbit ? "ON" : "OFF"}
              </button>
            </div>
            <div className="tilt-label">
              <label htmlFor="panel-tilt">Y-axis rotation</label>
              <output htmlFor="panel-tilt">{tilt}°</output>
            </div>
            <input
              id="panel-tilt"
              className="holo-range"
              type="range"
              min={-35}
              max={35}
              value={tilt}
              disabled={mode === "dom"}
              onChange={(event) => {
                setOrbit(false)
                setTilt(event.target.valueAsNumber)
              }}
            />
            <div className="setting-row">
              <label htmlFor="scanlines">Scanlines</label>
              <input
                id="scanlines"
                className="setting-checkbox"
                type="checkbox"
                checked={scanlines}
                onChange={(event) => setScanlines(event.target.checked)}
              />
            </div>
          </div>
          <button className="reset-button" type="button" onClick={resetView}>
            <RotateCcw size={13} /> Reset projection
          </button>
          <div
            className={`capability-note ${native ? "is-native" : ""}`}
            role="status"
          >
            <span className="micro-label">
              <span className={`connection-dot ${native ? "online" : ""}`} />
              {mode === "dom"
                ? "SOURCE VIEW"
                : native
                  ? "NATIVE API ACTIVE"
                  : "DOM PREVIEW"}
            </span>
            <p>
              {error ||
                (mode === "dom"
                  ? "這就是投射的 HTML 原件。試著改名，再切回 Canvas。"
                  : native
                    ? "HTML 正由 drawElementImage() 繪入 Canvas，輸入事件由瀏覽器處理。"
                    : "目前瀏覽器未提供所需原生 API。此為可互動的 DOM 預覽；使用支援 HTML-in-Canvas 的 Chrome 體驗原生繪製。")}
            </p>
          </div>
        </aside>
      </div>
      <details className="holo-explainer">
        <summary>
          <span>
            <Code2 size={15} /> UNDER THE HOOD
          </span>
          <span>
            ONE DOM TREE. TWO WAYS TO SEE IT.{" "}
            <span className="details-plus">+</span>
          </span>
        </summary>
        <div className="explainer-body">
          <div>
            <h2>介面沒有變成一張截圖。</h2>
            <p>
              原生模式把 Canvas 裡的 drawable 元素繪入 2D context。DOM
              更新時，paint 事件重新繪製；瀏覽器同步點擊位置與無障礙資訊。外層
              CSS perspective 提供 3D 視角。
            </p>
            <p>
              試試 Tab 導覽、輸入站名、關閉 uplink，再切換 DOM。這些都是原本的
              HTML 控制項。
            </p>
            <a
              href="https://developer.chrome.com/docs/web-platform/html-in-canvas/2d"
              target="_blank"
              rel="noreferrer"
            >
              閱讀 2D Canvas API <ArrowUpRight size={13} />
            </a>
          </div>
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </details>
      <footer className="holo-footer">
        <span>BUILT FOR THE CURIOUS.</span>
        <span>REACT + NATIVE CANVAS + A LITTLE PERSPECTIVE</span>
      </footer>
    </main>
  )
}
