"use client"

import { Trash2 } from "lucide-react"
import { Selectable } from "@/components/blocks/selectable"

import { cn } from "@/lib/utils"
import { Separator, Button } from "@notion-kit/ui/primitives"

const ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `file-${i}`,
  label: `Document ${i + 1}.pdf`,
}))

export function SelectableToolbarDemo() {
  return (
    <Selectable multiple className="h-full w-full rounded-lg p-10">
      <Selectable.Overlay />
      <Selectable.Group className="grid grid-cols-4 gap-3">
        {ITEMS.map((item) => (
          <Selectable.Item
            key={item.id}
            id={item.id}
            className={cn(
              "bg-popover flex h-20 cursor-default flex-col items-center justify-center gap-1 rounded-lg border px-2 text-center transition-all",
              "data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500/10",
              "data-[selecting=true]:border-blue-500/50 data-[selecting=true]:bg-blue-500/5"
            )}
          >
            <span className="text-lg">📄</span>
            <span className="truncate text-xs">{item.label}</span>
          </Selectable.Item>
        ))}
      </Selectable.Group>
      <Selectable.Toolbar className="bg-popover w-60 rounded-xl border px-4 py-2 shadow-2xl">
        {(selectedIds) => (
          <div className="flex w-full items-center gap-3">
            <span className="text-blue text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <Separator orientation="vertical" />
            <Button variant="red" size="sm">
              <Trash2 className="size-3" />
              Delete
            </Button>
          </div>
        )}
      </Selectable.Toolbar>
    </Selectable>
  )
}

export const selectableToolbarCode = `
// Atonomy
<Selectable multiple>
  <Selectable.Overlay />
  
  <Selectable.Group>
    {items.map((item) => (
      <Selectable.Item id={item.id}>
        {item.label}
      </Selectable.Item>
    ))}
  </Selectable.Group>
  
  {/* Floating toolbar appears after selection ends */}
  <Selectable.Toolbar>
    {(selectedIds) => {
      return // Your toolbar content here
    }}
  </Selectable.Toolbar>
</Selectable>`
