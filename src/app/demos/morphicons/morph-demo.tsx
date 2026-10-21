"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MorphIcon, type SpringPreset } from "morphicons/react"
import { Button } from "@/components/ui/button"

export type SvgLayer = {
  d: string
  collapsed: string
  order: number
  paint: {
    fill: string
    stroke: string
    strokeWidth: number
    fillOpacity: number
    opacity: number
    fillRule: "nonzero" | "evenodd"
  }
}

export type LayerPair = { id: string; a: SvgLayer; b: SvgLayer }

export type SvgFixture = {
  name: string
  url: string
  width: number
  height: number
  all: SvgLayer[]
  wireframe: string
}

const springs: SpringPreset[] = ["smooth", "snappy", "bouncy"]
const geometries = [
  { value: "all", label: "多層原色" },
  { value: "wireframe", label: "所有幾何線框" },
] as const

export function MorphDemo({
  fixtures,
  pairs,
}: {
  fixtures: SvgFixture[]
  pairs: LayerPair[]
}) {
  const [target, setTarget] = useState(0)
  const [geometry, setGeometry] = useState<"all" | "wireframe">("all")
  const [spring, setSpring] = useState<SpringPreset>("smooth")
  const [progress, setProgress] = useState<number | null>(null)
  const [a, b] = fixtures
  const t = progress ?? target
  const layers = [...pairs].sort(
    (left, right) =>
      (t < 0.5 ? left.a.order : left.b.order) -
      (t < 0.5 ? right.a.order : right.b.order)
  )

  function morphTo(next: number) {
    setProgress(null)
    setTarget(next)
  }

  return (
    <main className="bg-background text-foreground min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-muted-foreground w-fit text-sm hover:underline"
          >
            ← Cool UI Design
          </Link>
          <div>
            <p className="text-muted-foreground mb-2 text-xs tracking-widest uppercase">
              morphicons 2.0.0 / PoC
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              SVG morphing
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-6">
              切換多層原色與所有幾何線框，比較兩種 morph 效果。
              拖曳進度可停在任意中間狀態。
            </p>
          </div>
        </header>

        <section
          aria-label="Morphing playground"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex gap-2"
              role="group"
              aria-label="參與變形的幾何"
            >
              {geometries.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={geometry === value ? "default" : "outline"}
                  className={
                    geometry === value
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : undefined
                  }
                  aria-pressed={geometry === value}
                  onClick={() => setGeometry(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              {a.all.length} → {b.all.length} 個幾何元素
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-white p-4 sm:p-8">
            <div
              key={geometry}
              className="relative aspect-[834/394] w-full"
              role="img"
              aria-label={
                geometry === "all"
                  ? "兩份 SVG 的多層變形"
                  : "兩份 SVG 的所有幾何線框變形"
              }
            >
              {geometry === "wireframe" ? (
                <MorphIcon
                  icon={fixtures[target].wireframe}
                  from={progress === null ? undefined : a.wireframe}
                  to={progress === null ? undefined : b.wireframe}
                  progress={progress ?? undefined}
                  spring={spring}
                  viewBox="0 0 834 394"
                  width="100%"
                  height="100%"
                  className="size-full"
                  color="#296aff"
                  strokeWidth={1}
                  fill="none"
                />
              ) : (
                layers.map((layer) => (
                  <MorphIcon
                    key={layer.id}
                    icon={target === 0 ? layer.a.d : layer.b.d}
                    from={progress === null ? undefined : layer.a.d}
                    to={progress === null ? undefined : layer.b.d}
                    progress={progress ?? undefined}
                    spring={spring}
                    viewBox="0 0 834 394"
                    width="100%"
                    height="100%"
                    className="pointer-events-none absolute inset-0 size-full"
                    fill={layer.a.paint.fill}
                    stroke={layer.a.paint.stroke}
                    strokeWidth={layer.a.paint.strokeWidth}
                    fillOpacity={layer.a.paint.fillOpacity}
                    fillRule={layer.a.paint.fillRule}
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    style={{
                      opacity:
                        layer.a.paint.opacity * (1 - t) +
                        layer.b.paint.opacity * t,
                      transition: progress === null ? "opacity 450ms" : "none",
                    }}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => morphTo(0)}>
                回到 SVG A
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => morphTo(target === 0 ? 1 : 0)}
              >
                {target === 0 ? "Morph A → B" : "Morph B → A"}
              </Button>
              <Button variant="outline" onClick={() => morphTo(1)}>
                前往 SVG B
              </Button>
            </div>
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Spring"
            >
              {springs.map((preset) => (
                <Button
                  key={preset}
                  size="sm"
                  variant={spring === preset ? "secondary" : "ghost"}
                  aria-pressed={spring === preset}
                  onClick={() => setSpring(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
            <label
              htmlFor="morph-progress"
              className="flex justify-between text-sm"
            >
              <span>手動進度 · A → B</span>
              <output htmlFor="morph-progress">
                {progress === null
                  ? "Spring 播放"
                  : `${Math.round(progress * 100)}%`}
              </output>
            </label>
            <input
              id="morph-progress"
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress ?? target}
              onChange={(event) =>
                setProgress(event.currentTarget.valueAsNumber)
              }
              className="w-full cursor-ew-resize accent-blue-500"
            />
            <p className="text-muted-foreground text-xs leading-5">
              點擊按鈕使用 spring 播放。拖曳滑桿切換為手動插值。
              快速反向點擊也可以在動畫途中改變目標。
            </p>
          </div>
          <p className="text-muted-foreground text-xs leading-6">
            「多層原色」保留填色、描邊與透明度，各層依繪製樣式配對。
            「所有幾何線框」將整張圖合成單一藍色線框，包含文字與填色形狀的輪廓。
            兩圖共用 834 × 394 座標。此 MVP 不處理陰影與裁切，也不加入語意配對。
          </p>
        </section>

        <section aria-label="原始 SVG" className="grid gap-4 md:grid-cols-2">
          {fixtures.map((fixture) => (
            <figure
              key={fixture.url}
              className="overflow-hidden rounded-xl border border-border"
            >
              <figcaption className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
                <span>{fixture.name}</span>
                <a
                  href={fixture.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground text-xs hover:underline"
                >
                  {fixture.width} × {fixture.height} ↗
                </a>
              </figcaption>
              <div className="flex aspect-[834/394] items-start bg-white p-3">
                <Image
                  src={fixture.url}
                  alt={`${fixture.name} 原圖`}
                  width={fixture.width}
                  height={fixture.height}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            </figure>
          ))}
        </section>
      </div>
    </main>
  )
}
