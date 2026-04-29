export const showcaseCode = `// Each slide can display syntax-highlighted code
// alongside a live, interactive component demo.

interface SlideConfig {
  id: string
  title: string
  description?: string
  demo?: () => ReactNode   // live component
  code?: string             // displayed in code block
  lang?: string             // syntax highlighting language
}

// Slides are registered in a simple array:
const slides: SlideConfig[] = [
  {
    id: "counter",
    title: "Interactive Counter",
    demo: () => <CounterDemo />,
    code: counterCode,
    lang: "tsx",
  },
]`
