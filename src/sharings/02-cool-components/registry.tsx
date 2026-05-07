import type { SharingConfig } from "../types"
import { CoolComponentsIntro } from "./slides/intro-slide"

import {
  SelectableOverlayDemo,
  selectableOverlayCode,
} from "./slides/selectable-overlay"
import {
  SelectableToolbarDemo,
  selectableToolbarCode,
} from "./slides/selectable-toolbar"

export const coolComponentsSharing: SharingConfig = {
  id: "02-cool-components",
  title: "Cool Components",
  description:
    "Drag-to-select, physics-based animations, and seamless drag-and-drop interactions.",
  date: "2026-05-05",
  slides: [
    {
      id: "intro",
      title: "Cool Components",
      demo: () => <CoolComponentsIntro />,
    },
    {
      id: "selectable-overlay",
      title: "Selectable",
      description:
        "Drag on empty space to draw a selection box. Items highlight when intersected. The selection box is fully customizable via className — style it to match your design system.",
      demo: () => <SelectableOverlayDemo />,
      code: selectableOverlayCode,
      lang: "tsx",
    },
    {
      id: "selectable-toolbar",
      title: "Selectable: Floating Toolbar",
      description:
        "A toolbar appears after selection with contextual actions. Disappears on clear.",
      demo: () => <SelectableToolbarDemo />,
      code: selectableToolbarCode,
      lang: "tsx",
    },
  ],
}
