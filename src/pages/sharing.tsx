import { useState, useCallback } from "react"
import { useParams, Link } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import { Home } from "lucide-react"
import { getSharingById } from "@/sharings"
import { SlideTemplate } from "@/components/docs/slide-template"
import { SlideControls } from "@/components/docs/slide-controls"
import { ThemeToggle } from "@/components/docs/theme-toggle"
import { Button } from "@/components/ui/button"

export function SharingPage() {
  const { id } = useParams({ from: "/sharing/$id" })
  const sharing = getSharingById(id)
  const [slideIndex, setSlideIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > slideIndex ? 1 : -1)
      setSlideIndex(next)
    },
    [slideIndex]
  )

  if (!sharing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Sharing not found</p>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const slide = sharing.slides[slideIndex]!

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="size-4" />
            </Link>
          </Button>
          <span className="text-sm font-medium text-foreground">
            {sharing.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SlideControls
            current={slideIndex}
            total={sharing.slides.length}
            onPrev={() => goTo(slideIndex - 1)}
            onNext={() => goTo(slideIndex + 1)}
          />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <SlideTemplate
              title={slide.title}
              description={slide.description}
              demo={slide.demo?.()}
              code={slide.code}
              lang={slide.lang}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
