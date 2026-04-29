import { Link } from "@tanstack/react-router"
import { Presentation } from "lucide-react"
import { sharings } from "@/sharings"
import { ThemeToggle } from "@/components/docs/theme-toggle"

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          <Presentation className="size-5 text-primary" />
          <span className="font-semibold text-foreground">Cool UI Design</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-4xl p-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
          Sharings
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A collection of talks on how to design cool components
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {sharings.map((sharing) => (
            <Link
              key={sharing.id}
              to="/sharing/$id"
              params={{ id: sharing.id }}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <h2 className="mb-1 text-xl font-semibold text-card-foreground group-hover:text-primary">
                {sharing.title}
              </h2>
              <p className="mb-3 text-sm text-muted-foreground">
                {sharing.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
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
