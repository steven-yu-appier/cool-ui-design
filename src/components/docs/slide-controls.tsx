import { useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideControlsProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function SlideControls({
  current,
  total,
  onPrev,
  onNext,
}: SlideControlsProps) {
  const hasPrev = current > 0
  const hasNext = current < total - 1

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) onPrev()
      if (e.key === "ArrowRight" && hasNext) onNext()
    },
    [hasPrev, hasNext, onPrev, onNext]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={!hasPrev}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="min-w-[3rem] text-center text-sm text-muted-foreground tabular-nums">
        {current + 1} / {total}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!hasNext}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
