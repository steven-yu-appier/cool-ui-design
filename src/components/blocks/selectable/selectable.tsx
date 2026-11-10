"use client"

import type * as React from "react"
import {
  Selectable as SelectablePrimitive,
  useSelectable,
} from "@notion-kit/ui/selectable"

import { cn } from "@/lib/utils"

interface SelectableToolbarProps {
  children: (selectedIds: Set<string>) => React.ReactNode
  className?: string
  offset?: { x?: number; y?: number }
}

function SelectableToolbar({
  children,
  className,
  offset = {},
}: SelectableToolbarProps) {
  const { selectedIds, isSelecting } = useSelectable()
  const hasSelection = selectedIds.size > 0 && !isSelecting

  if (!hasSelection) return null

  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2",
        className
      )}
      onPointerDown={(event) => event.stopPropagation()}
      style={{
        ...(offset.x != null && { marginLeft: offset.x }),
        ...(offset.y != null && { marginBottom: offset.y }),
      }}
    >
      {children(selectedIds)}
    </div>
  )
}

export const Selectable = Object.assign(SelectablePrimitive, {
  Toolbar: SelectableToolbar,
})
