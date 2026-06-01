export function TitleSlide() {
  return (
    <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
      <div className="rounded-full border border-border bg-popover px-4 py-1 text-sm font-medium text-secondary">
        Frontend component design in the AI era
      </div>
      <h1 className="text-foreground text-5xl font-extrabold tracking-tight md:text-6xl">
        How I Design Components
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-secondary">
        When agents can write most of the code, the valuable work shifts to
        deciding what the component should be, how it should feel, and how other
        engineers should compose it.
      </p>
    </div>
  )
}
