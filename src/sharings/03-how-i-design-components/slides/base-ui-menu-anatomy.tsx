import { ExternalLink } from "lucide-react"

export const baseUiMenuAnatomyCode = `import { Menu } from '@base-ui/react/menu';

<Menu.Root>
  <Menu.Trigger />
  <Menu.Portal>
    <Menu.Backdrop />
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Arrow />
        <Menu.Item />
        <Menu.LinkItem />
        <Menu.Separator />

        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger />
        </Menu.SubmenuRoot>

        <Menu.Group>
          <Menu.GroupLabel />
        </Menu.Group>

        <Menu.RadioGroup>
          <Menu.GroupLabel />
          <Menu.RadioItem>
            <Menu.RadioItemIndicator />
          </Menu.RadioItem>
        </Menu.RadioGroup>

        <Menu.CheckboxItem>
          <Menu.CheckboxItemIndicator />
        </Menu.CheckboxItem>

        <Menu.Viewport />
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>`

const anatomy = [
  {
    label: "Root",
    detail: "Owns menu state, context, and coordination.",
  },
  {
    label: "Trigger",
    detail: "The entry point that opens the interaction.",
  },
  {
    label: "Portal",
    detail: "Moves layered UI out of document flow.",
  },
  {
    label: "Popup",
    detail: "Collects every visible menu part in one surface.",
  },
  {
    label: "Items",
    detail: "Each option keeps its semantic role explicit.",
  },
  {
    label: "Groups",
    detail: "Nested structure emerges without prop soup.",
  },
  {
    label: "Viewport",
    detail: "A named slot for scroll and overflow behavior.",
  },
]

export function BaseUiMenuAnatomySlide() {
  return (
    <div className="grid h-full w-full gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-0 flex-col justify-between gap-5">
        <div>
          <p className="text-sm font-medium uppercase text-secondary">
            Base UI anatomy
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Compound components make structure visible.
          </h1>
          <p className="mt-3 text-base/7 text-secondary">
            The Menu API reads like the interface it renders: stateful root,
            interaction trigger, layered popup, then focused slots for each
            behavior.
          </p>
        </div>

        <a
          href="https://base-ui.com/react/components/menu#anatomy"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Base UI Menu anatomy
          <ExternalLink className="size-4" />
        </a>
      </div>

      <div className="grid min-h-0 gap-2">
        {anatomy.map((part, index) => (
          <div
            key={part.label}
            className="grid grid-cols-[3rem_0.7fr_1.3fr] items-center gap-3 rounded-lg border border-border bg-popover px-3 py-2"
          >
            <div className="flex size-9 items-center justify-center rounded-md bg-muted text-sm font-semibold text-secondary">
              {index + 1}
            </div>
            <div className="text-base font-semibold text-foreground">
              Menu.{part.label}
            </div>
            <div className="text-sm/6 text-secondary">{part.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
