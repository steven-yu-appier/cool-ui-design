const steps = [
  {
    title: "Define scope",
    body: "Name the behavior boundary before naming props. What does this primitive own, and what should stay outside?",
  },
  {
    title: "Prototype usage",
    body: "Write the JSX you want consumers to write. The API should reveal the mental model.",
  },
  {
    title: "Agent codes",
    body: "Once the scope and API are clear, implementation becomes a constrained task instead of a vague prompt.",
  },
]

export function WorkflowSlide() {
  return (
    <div className="grid w-full max-w-5xl gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="flex min-h-60 flex-col gap-4 rounded-lg border border-border bg-popover p-6"
        >
          <div className="text-sm font-semibold text-secondary">
            Step {index + 1}
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-bold">{step.title}</h2>
            <p className="mt-4 text-base leading-7 text-secondary">
              {step.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
