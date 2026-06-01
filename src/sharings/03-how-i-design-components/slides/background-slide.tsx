const points = [
  "Agents can generate UI, wire state, and repair many errors.",
  "That makes raw implementation less scarce than before.",
  "But product taste, interaction boundaries, and API shape still need a human point of view.",
]

export function BackgroundSlide() {
  return (
    <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-center gap-4">
        <p className="text-sm font-medium uppercase text-secondary">
          Background
        </p>
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          AI changed the meaning of frontend work.
        </h1>
        <p className="text-secondary text-lg leading-8">
          I started asking a smaller, harder question: if an agent can code the
          component, what part of the component is still mine to design?
        </p>
      </div>
      <div className="grid gap-3">
        {points.map((point, index) => (
          <div
            key={point}
            className="rounded-lg border border-border bg-popover p-5 shadow-sm"
          >
            <div className="mb-3 text-sm font-semibold text-primary">
              0{index + 1}
            </div>
            <p className="text-foreground text-lg leading-7">{point}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
