import { Link } from "@tanstack/react-router"
import { sharings } from "@/sharings"

export function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
          Cool UI Design
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A collection of sharings on how to design cool components
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
      </div>
    </div>
  )
}
