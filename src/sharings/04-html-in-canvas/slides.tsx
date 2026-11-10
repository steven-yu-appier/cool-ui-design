import type { ReactNode } from "react"
import { ArrowRight, ArrowUpRight, Code2, ScanLine } from "lucide-react"

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
        如果 3D 螢幕裡的播放器，還是真的 HTML？
      </p>
      <div className="flex items-center gap-7 rounded-xl border border-border bg-popover px-8 py-7">
        <Code2 className="size-8 text-emerald-500" />
        <span className="text-xl">HTML</span>
        <ArrowRight className="text-secondary" />
        <span className="text-xl">Canvas texture</span>
        <ArrowRight className="text-secondary" />
        <ScanLine className="size-8 text-emerald-500" />
        <span className="text-xl">3D CRT</span>
      </div>
    </Frame>
  )
}
export function DemoSlide() {
  return (
    <Frame>
      <p className="text-sm text-emerald-500">先操作，再拆原理。</p>
      <h3 className="text-foreground text-4xl font-semibold">
        Phosphor FM · 一台桌上的 CRT
      </h3>
      <Cards
        items={[
          {
            title: "移動視角",
            body: "拖曳背景旋轉、滾輪縮放。觀察機殼厚度、底座和桌面陰影；用「正面」回到方便操作的視角。",
          },
          {
            title: "操作螢幕",
            body: "搜尋、切歌、播放合成樂段，拖曳音量與進度。轉到斜角後，再操作同一組 HTML 控制項。",
          },
          {
            title: "比較效果",
            body: "關閉 CRT 效果，再打開掃描線、色偏與掃光。觀察表單狀態和音樂都持續保留。",
          },
        ]}
      />
      <a
        href="/demos/canvas-lab#crt"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 rounded-lg bg-emerald-500 px-6 py-4 text-lg font-medium text-black"
      >
        開啟 3D CRT <ArrowUpRight className="size-5" />
      </a>
      <p className="text-sm text-secondary">
        確認 LIVE HTML / THREE.JS 標記。不支援時，會明確切回 DOM PREVIEW。
      </p>
    </Frame>
  )
}
export function ModelSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        HTML 還是 HTML，畫面成為材質。
      </h3>
      <Cards
        items={[
          {
            title: "HTML + CSS",
            body: "瀏覽器繼續處理排版、字型、表單、事件、焦點與無障礙語意。React 管理播放器 state。",
          },
          {
            title: "原生 2D Canvas",
            body: "drawElementImage() 把活的 DOM 子樹畫進來源 Canvas。內容改變時，paint 通知程式更新。",
          },
          {
            title: "Three.js + shader",
            body: "CanvasTexture 把來源 Canvas 當成螢幕材質。機殼、光影和相機由 Three.js 處理，shader 加上 CRT 效果。",
          },
        ]}
      />
      <p className="rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 px-6 py-4 text-xl leading-8 text-secondary">
        本 demo：HTML / CSS → 原生 2D Canvas → GPU 材質 → 3D 螢幕
      </p>
    </Frame>
  )
}
export function CssSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        效果會從 container 自動繼承嗎？
      </h3>
      <Cards
        items={[
          {
            title: "HTML 本身的 CSS",
            body: "字型、顏色、排版、圓角和 hover 照原本規則運作，先決定播放器的樣子。",
          },
          {
            title: "Canvas 外層的 CSS",
            body: "外層的 transform、filter 作用在整個輸出畫面；這是合成效果，不是每個子元素繼承。",
          },
          {
            title: "3D 材質與 shader",
            body: "透視、掃描線、RGB 色偏和掃光由繪製程式決定。HTML 放進 Canvas 不會自動得到這些效果。",
          },
        ]}
      />
      <p className="text-xl leading-9 text-secondary">
        CSS 決定 UI 長相；3D 與 shader 決定怎麼呈現。
      </p>
    </Frame>
  )
}
export function SetupSlide() {
  return (
    <div className="w-full space-y-6">
      <h3 className="text-foreground text-2xl font-semibold">
        兩層 Canvas，各自負責一件事。
      </h3>
      <div className="rounded-lg border border-border bg-popover p-5">
        <code className="text-emerald-500">content="drawable"</code>
        <p className="mt-2 text-base leading-7 text-secondary">
          讓瀏覽器排版 Canvas 裡的 DOM 子節點。
        </p>
      </div>
      <div className="rounded-lg border border-border bg-popover p-5">
        <code className="text-emerald-500">drawable</code>
        <p className="mt-2 text-base leading-7 text-secondary">
          標記獨立繪製來源。內層畫播放器，外層呈現 3D 場景。
        </p>
      </div>
      <p className="text-sm leading-7 text-secondary">
        內層來源 Canvas 是外層的 drawable 子樹；同步它的幾何位置，裡面的 HTML
        互動也能跟著走。
      </p>
    </div>
  )
}
export function PaintSlide() {
  return (
    <div className="w-full space-y-6">
      <h3 className="text-foreground text-2xl font-semibold">
        內容更新與場景動畫，分開處理。
      </h3>
      <ol className="list-decimal space-y-5 pl-5 text-lg leading-8 text-secondary">
        <li>HTML 改變，來源 Canvas 收到 paint。</li>
        <li>drawElementImage() 更新影像，標記材質需要重新上傳。</li>
        <li>Three.js 的動畫迴圈更新相機、互動幾何與 shader，再繪製場景。</li>
      </ol>
      <p className="rounded-lg border border-border bg-popover p-5 text-base leading-7 text-secondary">
        滑動視角不需要重新排版播放器。掃光由 shader 的時間參數驅動；reduced
        motion 會停用持續動態效果。
      </p>
    </div>
  )
}
export function InteractionSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        轉個角度，為什麼還點得到？
      </h3>
      <Cards
        items={[
          {
            title: "影像的位置",
            body: "相機與螢幕的 3D 變換決定材質最後投影在哪裡。瀏覽器無法從任意 shader 自行推斷。",
          },
          {
            title: "互動的位置",
            body: "相機變動時同步 HTML 基準投影；游標用 Raycaster 取得曲面 UV，再轉回 HTML 座標，讓點擊跟著凸面走。",
          },
          {
            title: "手勢的歸屬",
            body: "從螢幕內開始的手勢交給 HTML；背景拖曳才交給 OrbitControls，避免拖音量時也轉動相機。",
          },
        ]}
      />
      <p className="rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 px-6 py-4 text-xl leading-8 text-secondary">
        平面螢幕的透視能用矩陣描述；任意曲面、波浪扭曲需要額外映射。
      </p>
    </Frame>
  )
}
export function IllusionSlide() {
  return (
    <div className="w-full space-y-5">
      <h3 className="text-foreground text-2xl font-semibold">
        一台 CRT，三種工作。
      </h3>
      {[
        [
          "HTML / CSS",
          "Base UI Autocomplete 搜尋選單、按鈕、滑桿與開關；選單留在 Canvas 子樹內，跟著曲面顯示。",
        ],
        [
          "Three.js",
          "機殼、底座、平面桌面、燈光、陰影、螢幕材質與 OrbitControls。",
        ],
        [
          "Shader / Web Audio",
          "shader 加掃描線、RGB 色偏與掃光；Web Audio 合成三段可播放音樂。",
        ],
      ].map(([title, body]) => (
        <div
          key={title}
          className="rounded-lg border border-border bg-popover p-5"
        >
          <strong className="text-emerald-500">{title}</strong>
          <p className="mt-2 text-base leading-7 text-secondary">{body}</p>
        </div>
      ))}
      <p className="text-sm leading-7 text-secondary">
        HTML 材質和玻璃使用相同凸面網格；Raycaster 將曲面 UV 換回 HTML
        互動座標。shader 處理外圍模糊與色散；波形是節奏示意。
      </p>
    </div>
  )
}
export function BoundariesSlide() {
  return (
    <Frame>
      <h3 className="text-foreground text-3xl font-semibold">
        能畫出來，還要能好好使用。
      </h3>
      <Cards
        items={[
          {
            title: "支援與 fallback",
            body: "偵測原生繪製與幾何 API。WebGL 或繪製失敗，就明確切回可操作的 HTML 播放器。",
          },
          {
            title: "清晰度與位置",
            body: "來源影像使用較高解析度。視窗改變時更新相機比例與投影矩陣，維持畫面和互動位置一致。",
          },
          {
            title: "控制與生命週期",
            body: "Base UI 提供 Tab、Enter / Space、方向鍵與 Home / End 操作。停用持續動態時仍可操作；離開時釋放 GPU 與音訊資源。",
          },
        ]}
      />
      <p className="text-lg leading-8 text-secondary">
        HTML-in-Canvas 提供原生 UI
        與繪製的橋樑；場景、特效和互動幾何仍由開發者負責。
      </p>
    </Frame>
  )
}
export function ClosingSlide() {
  return (
    <Frame>
      <p className="text-sm text-emerald-500">DISCUSSION</p>
      <h3 className="text-foreground text-4xl leading-tight font-semibold">
        如果 HTML 可以成為即時材質，
        <br />
        你會把它放在哪裡？
      </h3>
      <p className="text-xl leading-9 text-secondary">
        遊戲內終端機、3D 產品螢幕、空間工作台。
        <br />
        先保留熟悉的 HTML 控制，再設計新的呈現方式。
      </p>
      <div className="space-y-3 border-t border-border pt-6">
        {[
          [
            "HTML-in-Canvas overview",
            "https://developer.chrome.com/docs/web-platform/html-in-canvas",
          ],
          [
            "Technical concepts / interaction geometry",
            "https://developer.chrome.com/docs/web-platform/html-in-canvas/concepts",
          ],
          [
            "Three.js CanvasTexture",
            "https://threejs.org/docs/pages/CanvasTexture.html",
          ],
        ].map(([title, url]) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex w-fit items-center gap-2 text-sm text-secondary hover:text-emerald-500"
          >
            {title}
            <ArrowUpRight className="size-3" />
          </a>
        ))}
      </div>
    </Frame>
  )
}
