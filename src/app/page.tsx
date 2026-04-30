"use client"

import Link from "next/link"
import { Presentation } from "lucide-react"
import { sharings } from "@/sharings"
import { ThemeToggle } from "@/components/docs/theme-toggle"

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
        <div className="grid gap-4 sm:grid-cols-2">
          {sharings.map((sharing) => (
            <Link
              key={sharing.id}
              href={`/sharing/${sharing.id}`}
              className="group bg-card hover:bg-accent rounded-lg border border-border p-6 transition-colors hover:border-primary/50"
            >
              <h2 className="text-card-foreground mb-1 text-xl font-semibold group-hover:text-primary">
                {sharing.title}
              </h2>
              <p className="text-muted-foreground mb-3 text-sm">
                {sharing.description}
              </p>
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>{sharing.date}</span>
                <span>{sharing.slides.length} slides</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
