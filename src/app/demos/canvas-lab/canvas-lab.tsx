import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { CrtDemo } from "./crt-demo"

export function CanvasLab() {
  return (
    <main className="canvas-lab">
      <header className="lab-nav">
        <Link href="/">
          <ArrowLeft size={16} /> COOL UI DESIGN
        </Link>
        <Link href="/sharing/04-html-in-canvas">
          SHARING 04 <ArrowUpRight size={16} />
        </Link>
      </header>
      <div className="lab-intro">
        <div>
          <span className="lab-eyebrow">
            HTML-IN-CANVAS / A SPATIAL EXPERIMENT
          </span>
          <h1>
            Late nights.
            <br />
            <em>Live signals.</em>
          </h1>
        </div>
        <div>
          <p>A little out of time.</p>
          <p>
            一台桌上的 CRT，一段深夜訊號。
            <br />
            轉個角度，螢幕裡的 HTML 依然能操作。
          </p>
        </div>
      </div>
      <CrtDemo />
      <footer className="lab-footer">
        <p>
          HTML → 原生 2D Canvas → Three.js 材質 → CRT shader
          <br />
          Web Audio 合成音樂 · 同一份 React state
        </p>
        <a
          href="https://developer.chrome.com/docs/web-platform/html-in-canvas"
          target="_blank"
          rel="noreferrer"
        >
          API DOCUMENTATION ↗
        </a>
      </footer>
    </main>
  )
}
