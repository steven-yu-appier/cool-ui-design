import { readFile } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { cubicsToPathD, iconToCubics } from "morphicons"
import { svgToIcon } from "morphicons/adapters"
import {
  MorphDemo,
  type LayerPair,
  type SvgFixture,
  type SvgLayer,
} from "./morph-demo"

export const metadata: Metadata = {
  title: "SVG morphing · Cool UI Design",
}

function readLayers(markup: string): SvgLayer[] {
  const body = markup
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/g, "")
  const stack: Record<string, string>[] = [{ fill: "black", opacity: "1" }]
  const layers: SvgLayer[] = []

  for (const match of body.matchAll(/<(\/?)([\w-]+)\b([^>]*?)(\/?)>/g)) {
    const [, closing, tag, raw] = match
    if (closing) {
      if (tag === "svg" || tag === "g") stack.pop()
      continue
    }

    const attrs = Object.fromEntries(
      [...raw.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [
        key,
        value,
      ])
    )
    const parent = stack[stack.length - 1]
    const paint: Record<string, string> = {
      ...parent,
      ...attrs,
      opacity: String(Number(parent.opacity) * Number(attrs.opacity ?? 1)),
    }
    if (tag === "svg" || tag === "g") {
      stack.push(paint)
      continue
    }
    if (
      ![
        "path",
        "rect",
        "line",
        "circle",
        "ellipse",
        "polyline",
        "polygon",
      ].includes(tag)
    )
      continue

    const cubics = iconToCubics(svgToIcon(`<svg fill="none">${match[0]}</svg>`))
    const xs = cubics.flatMap(({ pts }) =>
      [...pts].filter((_, i) => i % 2 === 0)
    )
    const ys = cubics.flatMap(({ pts }) =>
      [...pts].filter((_, i) => i % 2 === 1)
    )
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2

    layers.push({
      d: cubicsToPathD(cubics),
      collapsed: `M${cx - 0.01} ${cy - 0.01}h0.02v0.02h-0.02Z`,
      order: layers.length,
      paint: {
        fill: paint.fill,
        stroke: paint.stroke ?? "none",
        strokeWidth: Number(paint["stroke-width"] ?? 1),
        fillOpacity: Number(paint["fill-opacity"] ?? 1),
        opacity: Number(paint.opacity),
        fillRule: paint["fill-rule"] === "evenodd" ? "evenodd" : "nonzero",
      },
    })
  }
  return layers
}

function pairLayers(a: SvgLayer[], b: SvgLayer[]): LayerPair[] {
  const paintKey = ({ paint }: SvgLayer) =>
    JSON.stringify([
      paint.fill,
      paint.stroke,
      paint.strokeWidth,
      paint.fillOpacity,
      paint.fillRule,
    ])
  const remaining = new Set(b.map((_, index) => index))
  const collapsed = (layer: SvgLayer): SvgLayer => ({
    ...layer,
    d: layer.collapsed,
    order: Number.MAX_SAFE_INTEGER,
    paint: { ...layer.paint, opacity: 0 },
  })
  const pairs = a.map((layer, index) => {
    const match = [...remaining].find((i) => paintKey(b[i]) === paintKey(layer))
    if (match !== undefined) remaining.delete(match)
    return {
      id: `a-${index}`,
      a: layer,
      b: match === undefined ? collapsed(layer) : b[match],
    }
  })
  return [
    ...pairs,
    ...[...remaining].map((index) => ({
      id: `b-${index}`,
      a: collapsed(b[index]),
      b: b[index],
    })),
  ]
}

async function loadFixture(
  name: string,
  file: string,
  width: number,
  height: number
): Promise<SvgFixture> {
  const url = `/demos/morphicons/${file}`
  const markup = await readFile(path.join(process.cwd(), "public", url), "utf8")
  const all = readLayers(markup)
  const wireframe = all.map(({ d }) => d).join(" ")
  return { name, url, width, height, all, wireframe }
}

export default async function MorphiconsPage() {
  const fixtures = await Promise.all([
    loadFixture("SVG A", "source-a.svg", 694, 230),
    loadFixture("SVG B", "source-b.svg", 834, 394),
  ])
  const [a, b] = fixtures
  const pairs = pairLayers(a.all, b.all)

  return <MorphDemo fixtures={fixtures} pairs={pairs} />
}
