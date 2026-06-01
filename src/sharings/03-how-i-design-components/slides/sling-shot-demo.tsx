"use client"

import * as React from "react"
import { RotateCcw, Target } from "lucide-react"

import { SlingShot } from "@/components/blocks/sling-shot"
import { Button } from "@/components/ui/button"

export const slingShotAnatomyCode = `<SlingShot
  boundsRef={arenaRef}
  onLaunch={(velocity, itemId) => track(itemId)}
  onGoalHit={({ itemId, goalId }) => archive(itemId)}
  onLand={({ itemId }) => settle(itemId)}
>
  <SlingShot.Arrow />
  <SlingShot.Preview />
  <SlingShot.Power />

  // one or multiple items
  <SlingShot.Item id="item-1">
    {...}
  </SlingShot.Item>
  <SlingShot.Item id="item-2">
    {...}
  </SlingShot.Item>

  // one or multiple goals
  <SlingShot.Goal id="done" />
    
</SlingShot>`

const tokens = [
  { id: "scope", label: "Scope" },
  { id: "api", label: "API" },
  { id: "agent", label: "Agent" },
]

export function SlingShotDemo() {
  const arenaRef = React.useRef<HTMLDivElement>(null)
  const [hitCount, setHitCount] = React.useState(0)
  const [resetKey, setResetKey] = React.useState(0)

  return (
    <div
      ref={arenaRef}
      className="bg-background relative h-full min-h-[360px] w-full overflow-hidden rounded-lg border border-border"
    >
      <SlingShot
        boundsRef={arenaRef}
        resetKey={resetKey}
        onGoalHit={() => setHitCount((value) => value + 1)}
        className="h-full w-full p-6"
      >
        <SlingShot.Arrow />
        <SlingShot.Preview />
        <SlingShot.Power className="w-24" />

        {tokens.map((token, index) => (
          <SlingShot.Item
            key={token.id}
            id={token.id}
            className="text-foreground absolute block w-32 rounded-md border border-border bg-popover px-4 py-3 text-center text-sm font-semibold shadow-sm"
            style={{ left: 24, top: 24 + index * 56 }}
          >
            {token.label}
          </SlingShot.Item>
        ))}

        <SlingShot.Goal
          id="goal"
          className="absolute right-8 bottom-8 flex size-28 items-center justify-center rounded-full border border-border bg-popover shadow-sm"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <Target className="size-7 text-primary" />
            <span className="text-xs font-medium text-secondary">
              hits {hitCount}
            </span>
          </div>
        </SlingShot.Goal>

        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Reset slingshot demo"
          className="absolute top-4 right-4"
          onClick={() => setResetKey((value) => value + 1)}
        >
          <RotateCcw className="size-4" />
        </Button>
      </SlingShot>
    </div>
  )
}
