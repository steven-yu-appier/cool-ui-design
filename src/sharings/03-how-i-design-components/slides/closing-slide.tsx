export function ClosingSlide() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-sm font-medium uppercase text-secondary">
        Thank you
      </p>
      <h1 className="text-foreground text-5xl font-extrabold tracking-tight">
        Design the API before asking for the code.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-secondary">
        The agent can help build the component. Your job is to decide what
        deserves to exist, how it should be used, and what it should make
        possible.
      </p>
    </div>
  )
}
