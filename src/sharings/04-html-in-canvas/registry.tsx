import type { SharingConfig } from "../types"
import {
  CardDemoSlide,
  ClosingSlide,
  ComparisonSlide,
  CrtDemoSlide,
  CrtExplanation,
  DesignSlide,
  ModelSlide,
  RevealSlide,
  SetupSlide,
  StatusSlide,
  TitleSlide,
} from "./slides"

export const htmlInCanvasSharing: SharingConfig = {
  id: "04-html-in-canvas",
  title: "Beyond the DOM: HTML-in-Canvas",
  description:
    "從可操作的 HTML 卡片出發，認識 HTML-in-Canvas 的原理與能力，再把介面帶進 3D CRT。",
  date: "2026-11-16",
  slides: [
    {
      id: "title",
      title: "HTML-in-Canvas",
      demo: () => <TitleSlide />,
      notes: `平常做表單、按鈕和文字排版，我們會使用 HTML；需要自訂繪圖、粒子或 3D 場景時，會想到 Canvas。

HTML-in-Canvas 試著把這兩邊接起來。先從一張可以操作的卡片，看看它實際上做了什麼。

展示提醒：開場先不露出 CRT，保留第二個 demo 的驚喜。`,
    },
    {
      id: "card-demo",
      title: "Demo ①：這張卡片，還能輸入嗎？",
      demo: () => <CardDemoSlide />,
      lang: "tsx",
      code: `// 試著修改名稱、切換連線、調整訊號。
// 在 Canvas／DOM 之間切換，狀態保持不變。
// Scanlines 會在 HTML 畫面上疊加掃描線。

<canvas content="drawable">
  <form drawable>
    <input />
    <button>Send</button>
  </form>
</canvas>

// HTML 繼續負責排版與互動。
// Canvas 負責組合最後的畫面。
ctx.drawElementImage(form, 0, 0)`,
      notes: `這張卡片畫在 Canvas 裡，但輸入框、開關和滑桿仍然可以操作。

我們可以修改名稱，再切回 DOM 模式，看到相同的內容與狀態。這裡的介面仍然由 React 與 HTML 管理，Canvas 負責呈現它的畫面。

展示順序：輸入名稱 → 操作滑桿與送出 → 切換 DOM／Canvas → 開關掃描線。確認 NATIVE API ACTIVE，避免把 DOM fallback 當成原生 API 展示。`,
    },
    {
      id: "status",
      title: "什麼時候出現？現在可以用了嗎？",
      demo: () => <StatusSlide />,
      notes: `HTML-in-Canvas 經歷過 Origin Trial，早期 API 和現在的寫法也有差異。

依照目前官方資料，Chrome 148 到 150 是 Origin Trial 階段；2026 年 10 月 26 日的發布文章，宣布它在 Chrome 157 正式進入 Stable。

所以截至 2026 年 11 月 16 日，應該描述為「已在 Chrome Stable 推出」。這和所有瀏覽器都已普遍支援，是兩個不同層次的事，實作仍然需要做能力偵測。

Three.js 等套件的整合成熟度，也要和瀏覽器 API 本身分開看。相關官方來源連結保留在投影片上。`,
    },
    {
      id: "comparison",
      title: "以前與現在，差在哪裡？",
      demo: () => <ComparisonSlide />,
      notes: `以前如果直接在 Canvas 裡做介面，需要畫出文字、輸入框和按鈕，也要處理點擊、輸入與畫面更新。實務上可以借助套件，但這些能力仍需要有人提供。

HTML-in-Canvas 讓我們沿用 HTML 來建立介面，再把瀏覽器繪製的結果帶進 Canvas。

重點是 UI 的工作由誰負責，而不是程式碼一定能少到幾行。這裡的 drawHTML() 只是概念示意，下一張 API 範例會展示真正的方法。

如果有人問 CSS 也能旋轉卡片：是的，第一個 demo 的許多外觀可以用 CSS 完成。差異在於 HTML 的畫面能進入 Canvas 繪圖管線，後續接受逐像素處理，或成為 3D 材質。`,
    },
    {
      id: "mental-model",
      title: "DOM 還在，畫面交給 Canvas",
      demo: () => <ModelSlide />,
      notes: `原理可以先分成兩部分：HTML 元素本身，以及它被畫出來的結果。

元素仍然留在 DOM 裡，瀏覽器繼續處理 CSS 排版。透過 API，我們可以把這棵 DOM 子樹的畫面畫進 Canvas，再疊上其他內容或效果。

第一個卡片 demo 就是在畫完 HTML 之後，再用 2D Canvas 畫上掃描線。

若有人問效果會不會從 container 自動繼承：HTML 的 CSS 照原本規則運作；Canvas 外層的 filter 或 transform 作用在整個輸出。3D 曲面與 shader 效果需要另外實作。`,
    },
    {
      id: "drawable",
      title: "怎麼把 HTML 畫進 Canvas？",
      demo: () => <SetupSlide />,
      notes: `前面的 drawHTML() 是概念示意，這裡才是實際用到的 API。

content="drawable" 讓 Canvas 裡的 HTML 參與排版；drawable 標記要獨立繪製的來源。標記好來源後，在 paint 事件裡呼叫 drawElementImage()，就能把它畫進 2D Canvas。

後面可以繼續疊圖，也可以把這個 Canvas 用作 3D 材質。這裡只展示核心 API，實際上還需要處理尺寸、解析度、元素查詢與支援偵測。`,
    },
    {
      id: "reveal",
      title: "如果把 HTML 放進一台電視？",
      demo: () => <RevealSlide />,
      notes: `剛剛看到的是一張平面的卡片。

接著把條件再往前推：如果介面要放進真正的 3D 場景，被機殼包住，跟著凸面的玻璃彎曲，而且轉到側面仍然可以操作呢？

停頓一下，再切到下一張，直接操作投影片內的 CRT／TV demo。`,
    },
    {
      id: "crt-demo",
      title: "Demo ②：可以操作的 CRT／TV",
      demo: () => <CrtDemoSlide />,
      content: <CrtExplanation />,
      notes: `剛才是一張平面卡片，現在把 HTML 放進桌上的 CRT。

注意螢幕裡的內容：它跟著玻璃呈現凸面的形狀，外圍有模糊與色偏。即使轉動視角，裡面的介面依然可以操作。

展示節奏：先讓畫面播放幾秒 → 慢慢轉動視角 → 簡單操作 → 切換特效比較。

這段以畫面為主，不逐一介紹控制項，也不展開元件實作。`,
    },
    {
      id: "design",
      title: "把 HTML 當成即時材質",
      demo: () => <DesignSlide />,
      notes: `設計上可以分成三層。

第一層用 HTML 和 CSS 做介面；第二層把介面畫面貼到凸面的螢幕上，讓內容跟著彎曲；第三層加入玻璃反光、掃描線與邊緣色偏。

HTML-in-Canvas 提供介面畫面，Three.js 和 shader 負責場景與視覺效果。畫面變形之後，也要同步互動位置，才能保持可操作。

這裡點到為止，不展開 Raycaster、UV 或事件映射。`,
    },
    {
      id: "discussion",
      title: "什麼情況值得使用？",
      demo: () => <ClosingSlide />,
      notes: `一般表單或單純的卡片動畫，HTML 和 CSS 通常就很直接。

當介面需要成為場景中的材質、接受 shader 處理，或融入既有 Canvas 工作台時，HTML-in-Canvas 就提供了一條值得考慮的路徑。

從第一張卡片到這台 CRT，我們沿用熟悉的 HTML 元件，再逐步增加繪圖與互動幾何的控制。

可以留給大家一個問題：如果現有的 React 元件可以成為即時材質，你會先把它放進哪個場景？`,
    },
  ],
}
