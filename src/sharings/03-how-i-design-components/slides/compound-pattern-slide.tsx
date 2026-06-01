const rows = [
  {
    component: "Eject",
    scope: "One element exits the UI.",
    shape: "Wrapper + imperative ref",
    verdict: "Not compound yet. Keep it small until slots appear.",
  },
  {
    component: "SlingShot",
    scope: "Aiming, flight, goals, visual feedback.",
    shape: "Root + Item + Goal + Arrow + Preview + Power",
    verdict: "Strong compound fit. Root owns physics; slots render state.",
  },
  {
    component: "FallingBlocks",
    scope: "A container simulates falling child tiles.",
    shape: "Root + Item + PlayButton",
    verdict: "Light compound fit. Root owns frames; items consume context.",
  },
]

export function CompoundPatternSlide() {
  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-medium text-secondary uppercase">
          Compound pattern
        </p>
        <h1 className="text-foreground mt-2 text-4xl font-bold tracking-tight">
          Use composition when the behavior has real parts.
        </h1>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[0.8fr_1.2fr_1.4fr_1.6fr] bg-muted/40 text-sm font-semibold text-secondary">
          <div className="p-4">Component</div>
          <div className="p-4">Scope</div>
          <div className="p-4">API shape</div>
          <div className="p-4">Decision</div>
        </div>
        {rows.map((row) => (
          <div
            key={row.component}
            className="grid grid-cols-[0.8fr_1.2fr_1.4fr_1.6fr] border-t border-border bg-popover text-sm/6 text-primary"
          >
            <div className="text-foreground p-4 text-base font-semibold">
              {row.component}
            </div>
            <div className="p-4">{row.scope}</div>
            <div className="p-4">{row.shape}</div>
            <div className="p-4">{row.verdict}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
