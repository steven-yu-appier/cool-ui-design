import { ArrowDown, Box, CheckSquare, Move3D, Target } from "lucide-react"

const capabilities = [
  {
    icon: CheckSquare,
    name: "Eject",
    detail: "Items leave the interface with a physical exit.",
  },
  {
    icon: Target,
    name: "SlingShot",
    detail: "Todos can be pulled, aimed, launched, and detected by goals.",
  },
  {
    icon: Box,
    name: "FallingBlocks",
    detail: "Archived items become a small pile with replayable physics.",
  },
  {
    icon: Move3D,
    name: "Sortable",
    detail: "The list remains practical: reorder work before launching it.",
  },
]

export function FunctionalityMapSlide() {
  return (
    <div className="grid w-full max-w-5xl gap-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          A playful app is a stack of focused components.
        </h1>
        <p className="text-lg text-secondary">
          The todo app is not one clever component. It is several small
          interaction primitives composed around one product feeling.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {capabilities.map(({ icon: Icon, name, detail }) => (
          <div
            key={name}
            className="flex min-h-48 flex-col gap-4 rounded-lg border border-border bg-popover p-5"
          >
            <Icon className="size-7 text-primary" />
            <div>
              <h2 className="text-foreground text-xl font-semibold">{name}</h2>
              <p className="mt-2 text-sm leading-6 text-secondary">{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <ArrowDown className="mx-auto size-6 text-secondary" />
      <p className="text-center text-sm font-medium text-secondary">
        Design the primitive first. Compose the experience second.
      </p>
    </div>
  )
}
