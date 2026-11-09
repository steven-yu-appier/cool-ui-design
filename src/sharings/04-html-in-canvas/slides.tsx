import type { ReactNode } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Code2,
  MousePointer2,
  ScanLine,
} from "lucide-react"

function Frame({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-5xl space-y-7">{children}</div>
}

function Cards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {items.map(({ title, body }, index) => (
        <div
          key={title}
          className="rounded-xl border border-border bg-popover p-6"
        >
          <span className="text-sm text-emerald-500">0{index + 1}</span>
          <h3 className="text-foreground mt-4 text-xl font-semibold">
            {title}
          </h3>
          <p className="mt-3 text-base leading-7 text-secondary">{body}</p>
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
      <h1 className="text-foreground text-6xl font-semibold tracking-tight">
        Beyond the <span className="text-emerald-500">DOM.</span>
      </h1>
      <p className="text-2xl leading-10 text-secondary">
        如果 Canvas 裡的表單，還是真的 HTML？
      </p>
      <div className="mt-10 flex items-center gap-7 rounded-xl border border-border bg-popover px-8 py-7">
        <Code2 className="size-8 text-emerald-500" />
        <span className="text-xl">HTML</span>
        <ArrowRight className="text-secondary" />
        <span className="text-xl">paint</span>
        <ArrowRight className="text-secondary" />
        <ScanLine className="size-8 text-emerald-500" />
        <span className="text-xl">Canvas</span>
        <span className="ml-auto text-sm text-secondary">
          input / focus / semantics
        </span>
      </div>
    </Frame>
  )
}

export function DemoSlide() {
  return (
    <Frame>
      <div className="flex items-start justify-between gap-8">
        <div>
          <p className="text-sm text-emerald-500">先看效果，等一下再拆原理。</p>
          <h3 className="text-foreground mt-3 text-4xl font-semibold">
            Holographic control panel
          </h3>
        </div>
        <Box className="size-16 shrink-0 text-emerald-500" strokeWidth={1} />
      </div>
      <Cards
        items={[
          {
            title: "操作投影",
            body: "輸入站名、拖曳 signal power，按下 Transmit。這些都是原生 HTML 控制項。",
          },
          {
            title: "切回 DOM",
            body: "切換 Canvas / DOM，確認站名、開關、滑桿與訊號次數都還在。",
          },
          {
            title: "換個角度",
            body: "調色、關掉掃描線、改變 Y 軸角度。滑入或聚焦面板會暫停自動運動。",
          },
        ]}
      />
      <a
        href="/demos/html-in-canvas"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 rounded-lg bg-emerald-500 px-6 py-4 text-lg font-medium text-black"
      >
        開啟全息控制台 <ArrowUpRight className="size-5" />
      </a>
      <p className="text-sm text-secondary">
        先確認右側顯示 NATIVE API ACTIVE。新分頁會保留 demo 的操作狀態。
      </p>
    </Frame>
  )
}

export function ModelSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        HTML 負責介面，Canvas 決定畫在哪裡。
      </h3>
      <Cards
        items={[
          {
            title: "DOM tree",
            body: "React 管理站名、開關和滑桿。HTML 繼續提供表單語意、事件與焦點。",
          },
          {
            title: "Drawable subtree",
            body: "Canvas 內標記 drawable 的子樹，成為可獨立繪製的來源。",
          },
          {
            title: "Canvas pixels",
            body: "drawElementImage() 把來源畫進 2D context；DOM 改變時，paint 事件通知你重畫。",
          },
        ]}
      />
      <p className="rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 px-6 py-4 text-xl leading-8 text-secondary">
        畫面成為像素，互動仍由同一份 DOM 提供。
      </p>
    </Frame>
  )
}

export function SetupSlide() {
  return (
    <div className="w-full space-y-6">
      <h3 className="text-foreground text-2xl font-semibold">
        兩個標記，建立繪製來源。
      </h3>
      <div className="rounded-lg border border-border bg-popover p-5">
        <code className="text-lg text-emerald-500">content="drawable"</code>
        <p className="mt-2 text-base leading-7 text-secondary">
          讓 Canvas 排版其中的 DOM 子節點。
        </p>
      </div>
      <div className="rounded-lg border border-border bg-popover p-5">
        <code className="text-lg text-emerald-500">drawable</code>
        <p className="mt-2 text-base leading-7 text-secondary">
          指定獨立繪製的元素。本 demo 把整張面板當作一個來源。
        </p>
      </div>
      <p className="text-sm leading-6 text-secondary">
        若某個子元素也有 drawable，它會從父層的繪製來源中分離，需要另外畫出來。
      </p>
    </div>
  )
}

export function PaintSlide() {
  return (
    <div className="w-full space-y-6">
      <h3 className="text-foreground text-2xl font-semibold">
        DOM 變了，再重畫。
      </h3>
      <ol className="list-decimal space-y-5 pl-5 text-lg leading-8 text-secondary">
        <li>瀏覽器完成 drawable 子樹的樣式與排版更新。</li>
        <li>
          Canvas 收到 <code className="text-emerald-500">paint</code> 事件。
        </li>
        <li>清除舊畫面，繪製最新的 HTML，再加上掃描線。</li>
      </ol>
      <p className="rounded-lg border border-border bg-popover p-5 text-base leading-7 text-secondary">
        本 demo 不靠每幀重繪驅動旋轉。DOM 繪製由 paint 事件驅動，外層 CSS
        animation 負責 3D 姿態。
      </p>
    </div>
  )
}

export function InteractionSlide() {
  return (
    <Frame>
      <div className="flex items-center gap-4">
        <MousePointer2 className="size-9 text-emerald-500" />
        <h3 className="text-foreground text-3xl font-semibold">
          看得到，還得點得到。
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-7">
          <p className="text-sm text-emerald-500">THIS DEMO / 2D</p>
          <h4 className="text-foreground mt-4 text-2xl font-semibold">
            瀏覽器自動同步
          </h4>
          <p className="mt-4 text-lg leading-8 text-secondary">
            drawElementImage()
            預設會同步元素的繪製位置、點擊命中範圍與無障礙邊界。
          </p>
        </div>
        <div className="rounded-xl border border-border bg-popover p-7">
          <p className="text-sm text-secondary">WEBGL / WEBGPU</p>
          <h4 className="text-foreground mt-4 text-2xl font-semibold">
            開發者提供位置
          </h4>
          <p className="mt-4 text-lg leading-8 text-secondary">
            GPU 可以任意映射材質，瀏覽器無法推斷位置。需要用
            updateElementGeometry() 同步幾何變換。
          </p>
        </div>
      </div>
      <p className="text-lg text-secondary">
        Demo 小挑戰：用 Tab 走進面板、修改站名，再用鍵盤調整滑桿。
      </p>
    </Frame>
  )
}

export function IllusionSlide() {
  return (
    <div className="w-full space-y-6">
      <h3 className="text-foreground text-2xl font-semibold">
        全息感，拆成三層。
      </h3>
      <div className="space-y-4">
        <p className="rounded-lg border border-border bg-popover p-4 text-base leading-7 text-secondary">
          <strong className="text-foreground">HTML 面板</strong>
          <br />
          輸入框、switch、range、React state。
        </p>
        <p className="rounded-lg border border-border bg-popover p-4 text-base leading-7 text-secondary">
          <strong className="text-foreground">2D Canvas</strong>
          <br />
          原生 HTML 繪製，加上細掃描線。
        </p>
        <p className="rounded-lg border border-border bg-popover p-4 text-base leading-7 text-secondary">
          <strong className="text-foreground">CSS 空間</strong>
          <br />
          Perspective、rotateX / Y、後方兩片邊框和發光。
        </p>
      </div>
      <p className="text-sm leading-6 text-secondary">
        3D 外觀本來就能用 CSS 做。新 API 增加的是把可互動 HTML 納入 Canvas
        繪製的能力。
      </p>
    </div>
  )
}

export function BoundariesSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        炫完之後，哪些事情不能省？
      </h3>
      <Cards
        items={[
          {
            title: "Feature detection",
            body: "偵測 drawable Canvas、requestPaint 和 drawElementImage。缺少 API 或繪製失敗，就明確切回 DOM 預覽。",
          },
          {
            title: "像素與座標",
            body: "Canvas backing size 要跟實體像素對齊。用 ResizeObserver 處理尺寸，避免高 DPI 螢幕上的文字模糊。",
          },
          {
            title: "操作與動態效果",
            body: "保留 label、鍵盤操作與狀態回饋。聚焦時穩定面板，並尊重 prefers-reduced-motion。",
          },
        ]}
      />
      <p className="text-lg leading-8 text-secondary">
        適合遊戲內 UI、設計工具與 GPU 效果。一般表單若沒有特殊繪製需求，直接用
        DOM 就好。
      </p>
    </Frame>
  )
}

const sources = [
  {
    title: "HTML-in-Canvas overview",
    url: "https://developer.chrome.com/docs/web-platform/html-in-canvas",
  },
  {
    title: "Render HTML into 2D canvas",
    url: "https://developer.chrome.com/docs/web-platform/html-in-canvas/2d",
  },
  {
    title: "Technical concepts / geometry / accessibility",
    url: "https://developer.chrome.com/docs/web-platform/html-in-canvas/concepts",
  },
]

export function ClosingSlide() {
  return (
    <Frame>
      <p className="text-sm text-emerald-500">DISCUSSION</p>
      <h3 className="text-foreground text-4xl leading-tight font-semibold">
        如果 HTML 可以成為即時材質，
        <br />
        你會拿它做什麼？
      </h3>
      <p className="text-xl leading-9 text-secondary">
        今天用 2D Canvas 加 CSS perspective。
        <br />
        下一步可以探索 WebGL / WebGPU 材質、shader，以及它們的互動座標同步。
      </p>
      <div className="space-y-3 border-t border-border pt-6">
        {sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 text-sm text-secondary hover:text-emerald-500"
          >
            {source.title}
            <ArrowUpRight className="size-3" />
          </a>
        ))}
      </div>
    </Frame>
  )
}
