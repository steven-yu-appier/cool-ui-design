import type { Metadata } from "next"
import { MapDemoLoader } from "./map-demo-loader"
import "maplibre-gl/dist/maplibre-gl.css"
import "./map.css"

export const metadata: Metadata = {
  title: "ATLAS / Holographic map · Cool UI Design",
  description:
    "Live HTML projected into a 3D map with native canvas textures, depth occlusion, and holographic shaders.",
}

export default function HolographicMapPage() {
  return <MapDemoLoader />
}
