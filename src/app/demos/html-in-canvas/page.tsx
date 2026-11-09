import type { Metadata } from "next"
import { HologramDemo } from "./hologram-demo"
import "./hologram.css"

export const metadata: Metadata = {
  title: "HOLO / HTML-in-Canvas · Cool UI Design",
  description: "An interactive HTML control panel, drawn into a native canvas.",
}

export default function HtmlInCanvasPage() {
  return <HologramDemo />
}
