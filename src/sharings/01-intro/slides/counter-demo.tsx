import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RotateCcw } from "lucide-react"

export function CounterDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-7xl font-bold tabular-nums text-foreground">
        {count}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCount((c) => c - 1)}
        >
          <Minus className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCount(0)}
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCount((c) => c + 1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export const counterCode = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RotateCcw } from "lucide-react"

function CounterDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-7xl font-bold tabular-nums">
        {count}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon"
          onClick={() => setCount((c) => c - 1)}>
          <Minus className="size-4" />
        </Button>
        <Button variant="outline" size="icon"
          onClick={() => setCount(0)}>
          <RotateCcw className="size-4" />
        </Button>
        <Button variant="outline" size="icon"
          onClick={() => setCount((c) => c + 1)}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}`
