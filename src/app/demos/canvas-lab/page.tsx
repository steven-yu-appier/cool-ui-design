import type { Metadata } from "next"
import { CanvasLab } from "./canvas-lab"
import "./canvas-lab.css"

export const metadata: Metadata = {
  title: "Phosphor FM · HTML-in-Canvas",
  description:
    "An interactive HTML music player inside a Three.js CRT on a desk.",
}

export default function Page() {
  return <CanvasLab />
}
