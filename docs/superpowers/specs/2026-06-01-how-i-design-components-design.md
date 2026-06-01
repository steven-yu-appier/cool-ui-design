# 我如何設計元件 Design

## Purpose

Create a new sharing deck for frontend engineers at `/sharing/03-how-i-design-components`.
The deck should tell a story first, then teach concrete React component APIs and component design decisions.

The central question is: in an AI-agent era where agents can generate a lot of frontend code, what remains meaningful for a frontend engineer? The answer this deck should argue for is component taste: defining scope, designing usage, shaping composable APIs, and then letting agents help implement.

## Audience And Tone

The audience is frontend engineers. The deck may assume React, TypeScript, refs, context, and compound-component vocabulary.

The tone should be story first, then concrete APIs. Early slides should feel personal and motivational. Later slides should become practical and technical, with live demos and short code examples.

## Route And Registration

Add a new sharing route with id `03-how-i-design-components`.

Register it in `src/sharings/index.ts` alongside the existing decks. Keep it isolated from `src/sharings/02-cool-components` so the existing sharing remains unchanged.

The new deck should live under:

```text
src/sharings/03-how-i-design-components/
```

## Deck Structure

The deck should contain these slides:

1. Title: `我如何設計元件`
2. Background: AI agents can do almost everything; what can I still do as a frontend engineer?
3. So I made this: full live demo of `CoolTodo`
4. Functionality map: decompose `CoolTodo` into `Sortable`, `Eject`, `SlingShot`, and `FallingBlocks`
5. Eject: API usage and focused demos
6. SlingShot: API usage and focused demo
7. FallingBlocks: API usage and focused demo
8. Compound pattern: compare `Eject`, `SlingShot`, and `FallingBlocks`
9. Workflow: define functionality scope, plan API prototype, then let the agent code
10. Outro: thank you

## Slide Components

Create dedicated slide files to keep each idea small:

```text
src/sharings/03-how-i-design-components/registry.tsx
src/sharings/03-how-i-design-components/slides/title-slide.tsx
src/sharings/03-how-i-design-components/slides/background-slide.tsx
src/sharings/03-how-i-design-components/slides/cool-todo-demo.tsx
src/sharings/03-how-i-design-components/slides/functionality-map.tsx
src/sharings/03-how-i-design-components/slides/eject-demo.tsx
src/sharings/03-how-i-design-components/slides/sling-shot-demo.tsx
src/sharings/03-how-i-design-components/slides/falling-blocks-demo.tsx
src/sharings/03-how-i-design-components/slides/compound-pattern-slide.tsx
src/sharings/03-how-i-design-components/slides/workflow-slide.tsx
src/sharings/03-how-i-design-components/slides/closing-slide.tsx
```

Each API-focused slide should pair a small live demo with concise usage code. The description should explain design intent, not only UI behavior.

## Main Demo

The `CoolTodo` slide is the main proof-of-feel moment.

Use `src/components/cool-todo.tsx` as the live demo. If the current full-screen sizing (`h-screen w-screen`) does not fit cleanly inside the slide viewer, solve it with a wrapper or a minimal prop so the change stays scoped and does not disturb existing behavior.

## Eject Section

The `Eject` section should teach three cases:

1. `mode="respawn"`: a small element ejects and returns.
2. `mode="disappear"`: a small element ejects and stays gone.
3. Imperative handle form: a richer form demo using `EjectRef` and `ref.current?.eject()` to coordinate multiple UI elements.

The imperative form should be based on this behavior:

- A dialog/form is wrapped in `Eject`.
- The input is wrapped in `Eject mode="disappear"` and ejects on blur when it has a value.
- The submit button is wrapped in `Eject mode="disappear"` and ejects when submit starts.
- After a simulated API call, the dialog ejects, the form resets, and the input value clears.

The code sample should make `EjectRef` the main teaching point, with the simpler `respawn` and `disappear` modes shown as compact examples.

## SlingShot Section

The `SlingShot` section should use a small bounded arena with draggable items and a goal.

The API emphasis is:

- `SlingShot`
- `SlingShot.Item`
- `SlingShot.Goal`
- `SlingShot.Arrow`
- `SlingShot.Preview`
- `SlingShot.Power`
- event callbacks such as `onGoalHit`, `onLand`, and `onLaunch`

This demo should stay separate from the `CoolTodo` trash interaction so the API is easy to understand in isolation.

## FallingBlocks Section

The `FallingBlocks` section should show tiles dropping into a container with a replay control.

The API emphasis is:

- `FallingBlocks.Root`
- `FallingBlocks.Item`
- optional `runId` or internal replay behavior
- `FallingBlocks.PlayButton`
- optional `count`

The demo should make the physics behavior clear without requiring the todo app context.

## Compound Pattern Section

Use the compound-component guidance from `architecture-compound-components.md` as the conceptual frame:

- Complex components should expose composable subcomponents.
- Shared state should live in a provider/root and be read through context.
- Consumers should compose the pieces they need.
- Avoid hidden conditionals and monolithic prop-heavy APIs.

Compare all three components:

- `Eject`: mostly a single-purpose wrapper with imperative control. It does not need a compound API unless its behavior grows into multiple coordinated slots.
- `SlingShot`: the clearest compound component. The root owns physics state, while item, goal, arrow, preview, and power slots consume shared state through context.
- `FallingBlocks`: a light compound component. The root owns the physics frames and child items render through shared context.

The section should connect this comparison back to the design workflow:

1. Define the scope of functionality.
2. Decide the expected usage and API prototype.
3. Let the agent write code inside those boundaries.

## Verification

Run `pnpm build` after implementation.

Start the local dev server and inspect `/sharing/03-how-i-design-components` in a browser. Verify:

- The new sharing route loads.
- Slide navigation works.
- The `CoolTodo` demo fits the slide viewport.
- The `Eject`, `SlingShot`, and `FallingBlocks` demos are visible and usable.
- Code blocks remain readable beside demos.
- Dark and light themes remain readable.

## Out Of Scope

Do not redesign the slide framework.
Do not change the existing `01-intro` or `02-cool-components` deck content.
Do not add new third-party dependencies unless a current component already requires them.
