"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { Home } from "lucide-react"
import { SlideTemplate } from "@/components/docs/slide-template"
import { SlideControls } from "@/components/docs/slide-controls"
import { ThemeToggle } from "@/components/docs/theme-toggle"
import { Button } from "@/components/ui/button"
import type { SharingConfig } from "@/sharings/types"

function getSlideHashes(sharing: SharingConfig) {
  return sharing.slides.map((slide) => slide.id)
}

export function SlideViewer({ sharing }: { sharing: SharingConfig }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideHashes = useMemo(() => getSlideHashes(sharing), [sharing])

  const getIndexFromHash = useCallback(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return -1

    return slideHashes.findIndex((slideHash) => slideHash === hash)
  }, [slideHashes])

  const updateHash = useCallback(
    (next: number) => {
      const hash = slideHashes[next]
      if (!hash) return

      window.history.replaceState(null, "", `#${hash}`)
    },
    [slideHashes]
  )

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= sharing.slides.length) return

      setDirection(next > slideIndex ? 1 : -1)
      setSlideIndex(next)
      updateHash(next)
    },
    [sharing.slides.length, slideIndex, updateHash]
  )

  useEffect(() => {
    const syncSlideFromHash = () => {
      const next = getIndexFromHash()

      if (next === -1) {
        updateHash(slideIndex)
        return
      }

      if (next === slideIndex) return

      setDirection(next > slideIndex ? 1 : -1)
      setSlideIndex(next)
    }

    syncSlideFromHash()
    window.addEventListener("hashchange", syncSlideFromHash)

    return () => window.removeEventListener("hashchange", syncSlideFromHash)
  }, [getIndexFromHash, slideIndex, updateHash])

  const slide = sharing.slides[slideIndex]!

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  }

  return (
    <div className="bg-background flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Home className="size-4" />
            </Link>
          </Button>
          <span className="text-foreground text-sm font-medium">
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
