import type { SharingConfig } from "../types"
import { BackgroundSlide } from "./slides/background-slide"
import {
  BaseUiMenuAnatomySlide,
  baseUiMenuAnatomyCode,
} from "./slides/base-ui-menu-anatomy"
import { ClosingSlide } from "./slides/closing-slide"
import { CompoundPatternSlide } from "./slides/compound-pattern-slide"
import { CoolTodoDemoSlide } from "./slides/cool-todo-demo"
import { EjectDemo, ejectAnatomyCode } from "./slides/eject-demo"
import {
  FallingBlocksDemo,
  fallingBlocksAnatomyCode,
} from "./slides/falling-blocks-demo"
import { FunctionalityMapSlide } from "./slides/functionality-map"
import { SlingShotDemo, slingShotAnatomyCode } from "./slides/sling-shot-demo"
import { TitleSlide } from "./slides/title-slide"
import { WorkflowSlide } from "./slides/workflow-slide"

export const howIDesignComponentsSharing: SharingConfig = {
  id: "03-how-i-design-components",
  title: "How I Design Components",
  description:
    "A story-first talk on designing React component APIs before asking agents to write the code.",
  date: "2026-06-01",
  slides: [
    {
      id: "title",
      title: "How I Design Components",
      demo: () => <TitleSlide />,
    },
    {
      id: "background",
      title: "Background",
      demo: () => <BackgroundSlide />,
    },
    {
      id: "cool-todo",
      title: "So I made this...",
      description:
        "A todo app where tasks can be sorted, checked away, launched, and collected as falling blocks.",
      demo: () => <CoolTodoDemoSlide />,
    },
    {
      id: "functionality-map",
      title: "Dive into the functionalities",
      demo: () => <FunctionalityMapSlide />,
    },
    {
      id: "eject",
      title: "Eject",
      description:
        "A wrapper for physical exits: respawn, disappear, and imperative coordination.",
      demo: () => <EjectDemo />,
      code: ejectAnatomyCode,
      lang: "tsx",
    },
    {
      id: "sling-shot",
      title: "SlingShot",
      description:
        "A compound physics primitive for aiming items, visualizing power, and reacting to goals.",
      demo: () => <SlingShotDemo />,
      code: slingShotAnatomyCode,
      lang: "tsx",
    },
    {
      id: "falling-blocks",
      title: "FallingBlocks",
      description:
        "A root-owned simulation where children render as falling tiles through shared physics state.",
      demo: () => <FallingBlocksDemo />,
      code: fallingBlocksAnatomyCode,
      lang: "tsx",
    },
    {
      id: "base-ui-menu-anatomy",
      title: "Base UI Menu anatomy",
      description:
        "A production compound API where every behavior becomes a named slot.",
      demo: () => <BaseUiMenuAnatomySlide />,
      code: baseUiMenuAnatomyCode,
      lang: "tsx",
    },
    {
      id: "compound-pattern",
      title: "Compound pattern",
      demo: () => <CompoundPatternSlide />,
    },
    {
      id: "workflow",
      title: "How I design components",
      demo: () => <WorkflowSlide />,
    },
    {
      id: "closing",
      title: "Outro",
      demo: () => <ClosingSlide />,
    },
  ],
}
