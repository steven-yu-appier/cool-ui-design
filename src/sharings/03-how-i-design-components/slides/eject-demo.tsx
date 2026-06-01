"use client"

import * as React from "react"
import { Check, RotateCcw, Send } from "lucide-react"

import { Eject, type EjectRef } from "@/components/blocks/eject"
import { Button } from "@/components/ui/button"

export const ejectAnatomyCode = `const dialogRef = React.useRef<EjectRef>(null)
const buttonRef = React.useRef<EjectRef>(null)
const inputRef = React.useRef<EjectRef>(null)

<Eject ref={dialogRef}>
  <form onSubmit={handleSubmit}>
    <Eject ref={inputRef} mode="disappear">
      <Input onBlur={() => inputRef.current?.eject()} />
    </Eject>

    <Eject ref={buttonRef} mode="disappear">
      <Button>Subscribe</Button>
    </Eject>
  </form>
</Eject>

async function handleSubmit() {
  await buttonRef.current?.eject()
  await dialogRef.current?.eject()
}`

function ModeCard({
  mode,
  title,
}: {
  mode: "respawn" | "disappear"
  title: string
}) {
  const ejectRef = React.useRef<EjectRef>(null)
  const [renderKey, setRenderKey] = React.useState(0)

  return (
    <div className="flex min-h-36 flex-col justify-between rounded-lg border border-border bg-background p-4">
      <Eject
        key={renderKey}
        ref={ejectRef}
        mode={mode}
        className="rounded-md border border-border bg-popover px-3 py-2 text-sm font-medium text-foreground shadow-sm"
      >
        {title}
      </Eject>
      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => void ejectRef.current?.eject()}
        >
          Eject
        </Button>
        {mode === "disappear" && (
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Reset disappear demo"
            onClick={() => setRenderKey((value) => value + 1)}
          >
            <RotateCcw className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function EjectFormTemplate() {
  const [inputValue, setInputValue] = React.useState("")
  const [inputEjected, setInputEjected] = React.useState(false)
  const [inputKey, setInputKey] = React.useState(0)
  const [buttonKey, setButtonKey] = React.useState(0)
  const [formState, setFormState] = React.useState<
    "submitting" | "submitSuccess" | "initial"
  >("initial")

  const dialogRef = React.useRef<EjectRef>(null)
  const buttonRef = React.useRef<EjectRef>(null)
  const inputRef = React.useRef<EjectRef>(null)

  const resetForm = React.useCallback(() => {
    setInputEjected(false)
    setFormState("initial")
    setInputValue("")
    setInputKey((value) => value + 1)
    setButtonKey((value) => value + 1)
  }, [])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (formState !== "initial") return

    setFormState("submitting")
    void buttonRef.current?.eject()

    window.setTimeout(() => {
      setFormState("submitSuccess")
      void dialogRef.current?.eject()
      window.setTimeout(resetForm, 700)
    }, 900)
  }

  return (
    <Eject
      ref={dialogRef}
      className="relative flex w-full flex-col gap-5 rounded-lg border border-border bg-popover p-5 shadow-sm"
    >
      <div>
        <div className="text-xl font-semibold text-foreground">
          Subscribe to Newsletter
        </div>
        <p className="mt-1 text-sm text-secondary">
          Three pieces leave at different moments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="h-10">
          {inputEjected && (
            <div className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-secondary">
              {inputValue}
            </div>
          )}
          <Eject key={inputKey} ref={inputRef} mode="disappear">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Enter your email"
              onBlur={() => {
                if (!inputValue) return
                setInputEjected(true)
                void inputRef.current?.eject()
              }}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </Eject>
        </div>

        <div className="flex h-10 items-center gap-3">
          {formState === "submitting" && (
            <div className="text-sm font-medium text-secondary">
              Submitting...
            </div>
          )}
          {formState === "submitSuccess" && (
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Check className="size-4" />
              Success
            </div>
          )}
          <Eject key={buttonKey} ref={buttonRef} mode="disappear">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={formState !== "initial"}
              className="min-w-28"
            >
              <Send className="size-4" />
              Subscribe
            </Button>
          </Eject>
        </div>
      </form>
    </Eject>
  )
}

export function EjectDemo() {
  return (
    <div className="grid h-full w-full gap-4 md:grid-cols-[0.8fr_1.2fr]">
      <div className="grid gap-4">
        <ModeCard mode="respawn" title="Respawn card" />
        <ModeCard mode="disappear" title="Disappear card" />
      </div>
      <EjectFormTemplate />
    </div>
  )
}
