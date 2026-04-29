import type { SharingConfig } from "../types"
import { TitleSlideDemo } from "./slides/title-slide"
import { CounterDemo, counterCode } from "./slides/counter-demo"
import { showcaseCode } from "./slides/code-showcase"
import { ClosingSlideDemo } from "./slides/closing-slide"

export const introSharing: SharingConfig = {
  id: "01-intro",
  title: "Introduction",
  description:
    "A quick tour of the slide framework — slide templates, code blocks, and navigation.",
  date: "2026-04-29",
  slides: [
    {
      id: "title",
      title: "How to Design Cool Components",
      demo: () => <TitleSlideDemo />,
    },
    {
      id: "counter",
      title: "Interactive Counter",
      description:
        "Each slide can pair a live demo with its source code side-by-side",
      demo: () => <CounterDemo />,
      code: counterCode,
      lang: "tsx",
    },
    {
      id: "code-showcase",
      title: "The Slide Framework",
      description:
        "Slides are defined as simple config objects — title, description, demo component, and code string",
      code: showcaseCode,
      lang: "typescript",
    },
    {
      id: "closing",
      title: "Stay Tuned",
      demo: () => <ClosingSlideDemo />,
    },
  ],
}
