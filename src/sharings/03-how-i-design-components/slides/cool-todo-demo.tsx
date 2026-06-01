"use client"

import { CoolTodo } from "@/components/cool-todo"

export function CoolTodoDemoSlide() {
  return (
    <div className="h-full min-h-[520px] w-full overflow-hidden rounded-lg border border-border bg-main">
      <CoolTodo
        className="h-full min-h-[520px] w-full"
        trashClassName="absolute right-6 bottom-6 z-50"
      />
    </div>
  )
}
