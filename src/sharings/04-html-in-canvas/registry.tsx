import type { SharingConfig } from "../types"
import {
  BoundariesSlide,
  ClosingSlide,
  CssSlide,
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
    "把原生 HTML 播放器放進 Three.js CRT，拆解材質、shader 與移動視角後的互動座標。",
  date: "2026-11-10",
  slides: [
    { id: "title", title: "HTML-in-Canvas", demo: () => <TitleSlide /> },
    { id: "demo", title: "先玩，再拆", demo: () => <DemoSlide /> },
    {
      id: "mental-model",
      title: "DOM → paint → Canvas",
      demo: () => <ModelSlide />,
    },
    {
      id: "css-and-effects",
      title: "CSS 和 Canvas 各負責什麼？",
      demo: () => <CssSlide />,
    },
    {
      id: "drawable",
      title: "讓 HTML 成為繪製來源",
      demo: () => <SetupSlide />,
      lang: "html",
      code: `<canvas id="scene" content="drawable">
  <canvas id="source" content="drawable" drawable>
    <div id="player" drawable>
      <label>Search <input type="search" /></label>
      <button>Play</button>
      <label>Volume <input type="range" /></label>
    </div>
  </canvas>
</canvas>`,
    },
    {
      id: "paint",
      title: "繪製生命週期",
      demo: () => <PaintSlide />,
      lang: "ts",
      code: `const texture = new THREE.CanvasTexture(source);

source.addEventListener("paint", () => {
  ctx.drawElementImage(player, 0, 0, 1280, 1280);
  texture.needsUpdate = true;
});

renderer.setAnimationLoop((time) => {
  syncScreenGeometry();
  material.uniforms.u_time.value = time / 1000;
  renderer.render(scene, camera);
});

source.requestPaint();`,
    },
    {
      id: "interaction",
      title: "像素背後的互動",
      demo: () => <InteractionSlide />,
    },
    {
      id: "demo-effects",
      title: "拆解 3D CRT",
      demo: () => <IllusionSlide />,
      lang: "ts",
      code: `// HTML pixel coordinates → screen local → world
// → camera projection → canvas CSS pixels.
const matrix = viewport
  .clone()
  .multiply(camera.projectionMatrix)
  .multiply(camera.matrixWorldInverse)
  .multiply(screen.matrixWorld)
  .multiply(pixelToLocal);

canvas.updateElementGeometry(source, {
  canvasTransform: new DOMMatrix(matrix.elements),
});

// Curved screen: raycast the actual mesh for pointer input.
raycaster.setFromCamera(pointerNDC, camera);
const hit = raycaster.intersectObject(screen)[0];
// hit.uv → HTML layout coordinates → Base UI pointer event.
// Keyboard events continue through the focused DOM control.`,
    },
    {
      id: "boundaries",
      title: "落地前的邊界",
      demo: () => <BoundariesSlide />,
    },
    { id: "discussion", title: "下一個維度", demo: () => <ClosingSlide /> },
  ],
}
