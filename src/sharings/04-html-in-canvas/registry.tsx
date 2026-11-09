import type { SharingConfig } from "../types"
import {
  BoundariesSlide,
  ClosingSlide,
  DemoSlide,
  IllusionSlide,
  InteractionSlide,
  ModelSlide,
  PaintSlide,
  SetupSlide,
  TitleSlide,
} from "./slides"

export const htmlInCanvasSharing: SharingConfig = {
  id: "04-html-in-canvas",
  title: "Beyond the DOM: HTML-in-Canvas",
  description:
    "把可互動的 HTML 投射進 Canvas，從全息控制台拆解繪製、事件與 3D 視角。",
  date: "2026-11-09",
  slides: [
    { id: "title", title: "HTML-in-Canvas", demo: () => <TitleSlide /> },
    { id: "demo", title: "先玩，再拆", demo: () => <DemoSlide /> },
    {
      id: "mental-model",
      title: "DOM → paint → Canvas",
      demo: () => <ModelSlide />,
    },
    {
      id: "drawable",
      title: "讓 HTML 成為繪製來源",
      demo: () => <SetupSlide />,
      lang: "html",
      code: `<canvas id="projection" content="drawable">
  <div id="panel" drawable>
    <form>
      <label for="station">Station name</label>
      <input id="station" value="Aurora station" />
      <button type="submit">Transmit</button>
    </form>
  </div>
</canvas>`,
    },
    {
      id: "paint",
      title: "繪製生命週期",
      demo: () => <PaintSlide />,
      lang: "ts",
      code: `const ctx = canvas.getContext("2d");

canvas.addEventListener("paint", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawElementImage(
    panel, 0, 0,
    canvas.width, canvas.height
  );
  drawScanlines(ctx);
});

// First paint, even before the DOM changes.
canvas.requestPaint();

// In React: remove the listener on cleanup.
// See use-html-canvas.ts for resizing and fallback.`,
    },
    {
      id: "interaction",
      title: "像素背後的互動",
      demo: () => <InteractionSlide />,
    },
    {
      id: "hologram",
      title: "拆解全息控制台",
      demo: () => <IllusionSlide />,
      lang: "css",
      code: `.stage {
  perspective: 1200px;
}

.scene {
  transform-style: preserve-3d;
  transform: rotateX(7deg) rotateY(-14deg);
}

.back-layer {
  transform: translateZ(-32px);
}

.scene:hover,
.scene:focus-within {
  animation-play-state: paused;
}`,
    },
    {
      id: "boundaries",
      title: "落地前的邊界",
      demo: () => <BoundariesSlide />,
    },
    { id: "discussion", title: "下一個維度", demo: () => <ClosingSlide /> },
  ],
}
