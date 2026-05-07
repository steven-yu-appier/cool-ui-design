"use client"

import { Selectable } from "@/components/blocks/selectable"
import { cn } from "@/lib/utils"

const ITEMS = Array.from({ length: 9 }, (_, i) => ({
  id: `block-${i}`,
  label: `Block ${i + 1}`,
}))

export function SelectableOverlayDemo() {
  return (
    <Selectable multiple className="h-full w-full rounded-lg p-4">
      <Selectable.Overlay className="rounded-md border-2 border-dashed border-purple-400/70 bg-purple-400/15 shadow-lg shadow-purple-500/10" />
      <Selectable.Group className="grid grid-cols-3 gap-4">
        {ITEMS.map((item) => (
          <Selectable.Item
            key={item.id}
            id={item.id}
            className={cn(
              "bg-input flex h-24 cursor-default items-center justify-center rounded-lg border text-sm font-medium transition-all",
              "data-[selected=true]:border-purple-400 data-[selected=true]:bg-purple-500/10 data-[selected=true]:text-purple-300",
              "data-[selecting=true]:border-purple-400/50 data-[selecting=true]:bg-purple-500/5",
            )}
          >
            {item.label}
          </Selectable.Item>
        ))}
      </Selectable.Group>
    </Selectable>
  )
}

export const selectableOverlayCode = `// Atonomy
<Selectable multiple>
  {/* Custom overlay styling — dashed purple border with glow */}
  <Selectable.Overlay  />
  
  <Selectable.Group>
    {items.map((item) => (
      <Selectable.Item id={item.id}>
        {item.label}
      </Selectable.Item>
    ))}
  </Selectable.Group>
  
</Selectable>`
