"use client"

import Link from "next/link"
import { Presentation } from "lucide-react"
import { sharings } from "@/sharings"
import { ThemeToggle } from "@/components/docs/theme-toggle"
import { FallingBlocks } from "@/components/blocks/falling-blocks"
import { TooltipPreset } from "@notion-kit/ui/primitives"

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          <Presentation className="size-5 text-primary" />
          <span className="text-foreground font-semibold">Cool UI Design</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight">
          Sharings
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          A collection of talks on how to design cool components
        </p>
        <FallingBlocks.Root className="relative h-[420px] w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {sharings.map((sharing) => (
            <FallingBlocks.Item
              key={sharing.id}
              className="group/card bg-card rounded-lg border border-border p-4 hover:border-blue"
              asChild
            >
              <Link key={sharing.id} href={`/sharing/${sharing.id}`}>
                <TooltipPreset description={sharing.description}>
                  <h2 className="mb-1 text-xl font-semibold text-primary group-hover/card:text-blue">
                    {sharing.title}
                  </h2>
                </TooltipPreset>
                <div className="flex items-center justify-between text-xs text-secondary">
                  <span>{sharing.date}</span>
                  <span>{sharing.slides.length} slides</span>
                </div>
              </Link>
            </FallingBlocks.Item>
          ))}
        </FallingBlocks.Root>
        <Link
          href="/demos/html-in-canvas"
          className="bg-card mt-6 block rounded-lg border border-border p-5 transition-colors hover:border-emerald-400"
        >
          <p className="text-muted-foreground mb-2 text-xs tracking-widest">
            INTERACTIVE EXPERIMENT
          </p>
          <h2 className="text-foreground text-xl font-semibold">
            HTML-in-Canvas · Holographic control panel ↗
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            把真正可互動的 HTML，投射進另一個維度。
          </p>
        </Link>
        <Link
          href="/demos/holographic-map"
          className="bg-card mt-4 block rounded-lg border border-border p-5 transition-colors hover:border-amber-400"
        >
          <p className="text-muted-foreground mb-2 text-xs tracking-widest">
            SPATIAL HTML EXPERIMENT
          </p>
          <h2 className="text-foreground text-xl font-semibold">
            ATLAS · Taipei holographic map ↗
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            點選城市，讓可互動的 HTML 成為 3D 地圖裡的投影材質。
          </p>
        </Link>
      </main>
    </div>
  )
}
