import type { ReactNode } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"

function Frame({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-5xl space-y-6">{children}</div>
}

function DemoLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-3 rounded-lg bg-emerald-500 px-6 py-4 text-lg font-medium text-black"
    >
      {children} <ArrowUpRight className="size-5" />
    </a>
  )
}

function Steps({ items }: { items: string[] }) {
  return (
    <div className="space-y-3 text-center">
      {items.map((item, index) => (
        <div key={item}>
          {index > 0 && (
            <ArrowDown className="mx-auto mb-3 size-5 text-emerald-500" />
          )}
          <div className="rounded-xl border border-border bg-popover px-6 py-4 text-xl">
            {item}
          </div>
        </div>
      ))}
    </div>
  )
}

export function TitleSlide() {
  return (
    <Frame>
      <p className="text-sm tracking-widest text-secondary">
        FRONTEND STUDY GROUP · 15–20 MIN
      </p>
      <h1 className="text-foreground text-5xl leading-tight font-semibold tracking-tight">
        HTML 可以畫進 <span className="text-emerald-500">Canvas</span> 嗎？
      </h1>
      <p className="text-2xl leading-10 text-secondary">
        保留 HTML 的互動能力，取得 Canvas 的繪圖自由。
      </p>
      <p className="text-lg text-secondary">先從一張可以操作的卡片開始。</p>
    </Frame>
  )
}

export function CardDemoSlide() {
  return (
    <Frame>
      <p className="text-sm text-emerald-500">DEMO 01 · MISSION CONTROL</p>
      <h3 className="text-foreground text-4xl font-semibold">
        這張卡片，還能輸入嗎？
      </h3>
      <ol className="list-decimal space-y-4 pl-6 text-xl leading-8 text-secondary">
        <li>修改 Station Name。</li>
        <li>切換 Uplink、調整 Signal Power。</li>
        <li>開啟掃描線、改變角度。</li>
        <li>切換 DOM／Canvas，觀察內容與狀態。</li>
      </ol>
      <DemoLink href="/demos/html-in-canvas">開啟卡片 Demo</DemoLink>
      <p className="text-sm text-secondary">
        確認 NATIVE API ACTIVE；DOM PREVIEW 是 fallback。
      </p>
    </Frame>
  )
}

export function StatusSlide() {
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-border bg-popover p-6">
          <p className="text-sm text-secondary">CHROME 148–150</p>
          <h3 className="mt-3 text-3xl font-semibold">Origin Trial</h3>
          <p className="mt-3 text-lg text-secondary">
            實驗、收集回饋，API 隨之調整。
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/5 p-6">
          <p className="text-sm text-emerald-500">CHROME 157</p>
          <h3 className="mt-3 text-3xl font-semibold">Stable</h3>
          <p className="mt-3 text-lg text-secondary">
            2026-10-26 官方文章宣布正式推出。
          </p>
        </div>
      </div>
      <p className="text-xl leading-9 text-secondary">
        已在 Chrome Stable 推出；跨瀏覽器使用仍需偵測支援並提供
        fallback。套件整合的成熟度另行確認。
      </p>
      <div className="flex gap-5 text-sm text-secondary">
        <a
          className="underline"
          href="https://developer.chrome.com/blog/html-in-canvas-origin-trial"
          target="_blank"
          rel="noreferrer"
        >
          Origin Trial 說明
        </a>
        <a
          className="underline"
          href="https://developer.chrome.com/blog/html-in-canvas"
          target="_blank"
          rel="noreferrer"
        >
          Stable 發布公告
        </a>
      </div>
      <p className="text-sm text-secondary">支援狀態查核：2026-11-16</p>
    </Frame>
  )
}

export function ComparisonSlide() {
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-border bg-popover p-6">
          <h3 className="mb-5 text-xl font-semibold">
            以前：自己把 UI 畫成像素
          </h3>
          <pre className="text-base leading-8 text-secondary">
            <code>{`drawText("Station name")
drawInputBox()
drawButton("Send")

// 自行處理操作
detectClick()
handleTyping()
drawUpdatedUI()`}</code>
          </pre>
        </div>
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/5 p-6">
          <h3 className="mb-5 text-xl font-semibold">現在：HTML 負責 UI</h3>
          <pre className="text-base leading-8 text-secondary">
            <code>{`const panel = (
  <form>
    <input />
    <button>Send</button>
  </form>
)

canvas.drawHTML(panel)`}</code>
          </pre>
        </div>
      </div>
      <p className="text-xl text-secondary">
        沿用 HTML 的排版與互動能力，再交給 Canvas 呈現。
      </p>
      <p className="text-sm text-secondary">
        概念示意：drawHTML() 並非實際 API。「以前」指直接手繪 Canvas
        UI，也可透過套件實作。
      </p>
    </Frame>
  )
}

export function ModelSlide() {
  return (
    <Frame>
      <Steps
        items={[
          "HTML + CSS",
          "瀏覽器排版與繪製",
          "drawElementImage()",
          "Canvas 中的影像",
        ]}
      />
      <p className="text-xl leading-9 text-secondary">
        HTML 管理內容與互動，Canvas 決定如何組合畫面。
      </p>
    </Frame>
  )
}

export function SetupSlide() {
  return (
    <Frame>
      <div className="rounded-xl border border-border bg-popover p-5">
        <p className="mb-3 text-lg font-medium">標記繪製來源</p>
        <pre className="text-base leading-7 text-secondary">
          <code>{`<canvas content="drawable">
  <form drawable>
    <input />
    <button>Send</button>
  </form>
</canvas>`}</code>
        </pre>
      </div>
      <div className="rounded-xl border border-border bg-popover p-5">
        <p className="mb-3 text-lg font-medium">內容更新時，重新繪製</p>
        <pre className="text-base leading-7 text-secondary">
          <code>{`canvas.addEventListener("paint", () => {
  ctx.reset()
  ctx.drawElementImage(form, 0, 0)
})
canvas.requestPaint()`}</code>
        </pre>
      </div>
      <p className="text-sm text-secondary">
        核心 API 示意；省略元素查詢、2D context 初始化、尺寸與支援偵測。
      </p>
    </Frame>
  )
}

export function RevealSlide() {
  return (
    <Frame>
      <p className="text-sm text-emerald-500">WHAT IF?</p>
      <h3 className="text-foreground text-5xl leading-tight font-semibold">
        如果把這張 HTML
        <br />
        放進一台電視裡？
      </h3>
      <p className="text-2xl leading-10 text-secondary">
        除了旋轉一張卡片，還可以做到什麼？
      </p>
    </Frame>
  )
}

export function CrtDemoSlide() {
  return (
    <Frame>
      <p className="text-sm text-emerald-500">DEMO 02 · PHOSPHOR FM</p>
      <h3 className="text-foreground text-5xl leading-tight font-semibold">
        可以操作的 CRT／TV
      </h3>
      <p className="text-2xl leading-10 text-secondary">
        同樣是 HTML，這次成為 3D 螢幕的材質。
      </p>
      <DemoLink href="/demos/canvas-lab#crt">開啟 CRT／TV Demo</DemoLink>
    </Frame>
  )
}

export function DesignSlide() {
  return (
    <Frame>
      <Steps
        items={[
          "HTML + CSS",
          "畫成可更新的材質",
          "貼上凸面螢幕",
          "加上玻璃與 CRT 效果",
        ]}
      />
      <p className="text-xl leading-9 text-secondary">
        HTML-in-Canvas 提供介面畫面；Three.js 與 shader 負責場景與視覺效果。
      </p>
      <p className="text-base text-secondary">畫面變形後，也要同步互動位置。</p>
    </Frame>
  )
}

export function ClosingSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        當介面需要同時具備：
      </h3>
      <ul className="list-disc space-y-4 pl-6 text-2xl leading-9 text-secondary">
        <li>HTML 排版與控制項。</li>
        <li>Canvas／GPU 的繪圖效果。</li>
        <li>與 2D／3D 場景整合。</li>
      </ul>
      <p className="text-xl leading-9 text-emerald-500">
        遊戲終端機、產品操作螢幕、Canvas 工作台。
      </p>
      <a
        href="https://developer.chrome.com/docs/web-platform/html-in-canvas"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-secondary underline"
      >
        HTML-in-Canvas 官方文件 <ArrowUpRight className="size-3" />
      </a>
    </Frame>
  )
}
