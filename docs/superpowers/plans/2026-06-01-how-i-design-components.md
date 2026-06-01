# How I Design Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `/sharing/03-how-i-design-components` slide deck that tells a story-first component design talk with focused live demos and anatomy-style API snippets.

**Architecture:** Add a new isolated sharing registry under `src/sharings/03-how-i-design-components/` and register it in the existing sharing index. Each slide is a small React component that uses the current `SlideTemplate` contract of `demo`, `code`, and `description`, while the new demos reuse existing block components.

**Tech Stack:** Next.js app router, React 19, TypeScript, Tailwind CSS, Framer Motion-backed `Eject`, custom `SlingShot`, custom `FallingBlocks`, existing slide viewer.

---

## File Structure

- Create `src/sharings/03-how-i-design-components/registry.tsx`: exports the new `SharingConfig`.
- Create `src/sharings/03-how-i-design-components/slides/title-slide.tsx`: opening title slide.
- Create `src/sharings/03-how-i-design-components/slides/background-slide.tsx`: AI-era story setup.
- Create `src/sharings/03-how-i-design-components/slides/cool-todo-demo.tsx`: main `CoolTodo` demo wrapper.
- Create `src/sharings/03-how-i-design-components/slides/functionality-map.tsx`: capability decomposition slide.
- Create `src/sharings/03-how-i-design-components/slides/eject-demo.tsx`: three `Eject` examples and anatomy snippet.
- Create `src/sharings/03-how-i-design-components/slides/sling-shot-demo.tsx`: small arena demo and anatomy snippet.
- Create `src/sharings/03-how-i-design-components/slides/falling-blocks-demo.tsx`: falling tiles demo and anatomy snippet.
- Create `src/sharings/03-how-i-design-components/slides/compound-pattern-slide.tsx`: three-component comparison.
- Create `src/sharings/03-how-i-design-components/slides/workflow-slide.tsx`: scope to API to agent workflow.
- Create `src/sharings/03-how-i-design-components/slides/closing-slide.tsx`: thank-you slide.
- Modify `src/sharings/index.ts`: import and register the new sharing.
- Optionally modify `src/components/cool-todo.tsx`: add a minimal sizing prop only if the demo cannot fit in the slide viewport.

## Task 1: Register Deck Skeleton

**Files:**
- Create: `src/sharings/03-how-i-design-components/registry.tsx`
- Create: title/background/cool-todo/functionality/compound/workflow/closing slide files
- Modify: `src/sharings/index.ts`

- [ ] **Step 1: Create simple text/demo slide components**

Create each slide component with static content and no custom interactions yet. Use exported function components with names matching the registry imports.

- [ ] **Step 2: Create registry**

Create `howIDesignComponentsSharing` with id `03-how-i-design-components`, title `我如何設計元件`, date `2026-06-01`, and ten slides matching the spec.

- [ ] **Step 3: Register sharing**

Import `howIDesignComponentsSharing` in `src/sharings/index.ts` and append it to the `sharings` array.

- [ ] **Step 4: Verify route generation**

Run: `pnpm build`

Expected: build succeeds and route list includes `/sharing/03-how-i-design-components`.

## Task 2: Implement Eject Demo Slide

**Files:**
- Modify: `src/sharings/03-how-i-design-components/slides/eject-demo.tsx`

- [ ] **Step 1: Build focused demo**

Add three visible sections: one respawn card, one disappear card with reset, and one imperative form using `EjectRef`.

- [ ] **Step 2: Add anatomy snippet**

Export `ejectAnatomyCode` showing only refs, `Eject` wrappers, `mode`, and `ref.current?.eject()` calls. Do not show full form implementation.

- [ ] **Step 3: Verify**

Run: `pnpm build`

Expected: build succeeds with no TypeScript errors.

## Task 3: Implement SlingShot Demo Slide

**Files:**
- Modify: `src/sharings/03-how-i-design-components/slides/sling-shot-demo.tsx`

- [ ] **Step 1: Build arena demo**

Add a bounded arena with `SlingShot`, `SlingShot.Item`, `SlingShot.Goal`, `SlingShot.Arrow`, `SlingShot.Preview`, and `SlingShot.Power`.

- [ ] **Step 2: Add anatomy snippet**

Export `slingShotAnatomyCode` showing the root, item, goal, visual slots, and event callbacks.

- [ ] **Step 3: Verify**

Run: `pnpm build`

Expected: build succeeds with no TypeScript errors.

## Task 4: Implement FallingBlocks Demo Slide

**Files:**
- Modify: `src/sharings/03-how-i-design-components/slides/falling-blocks-demo.tsx`

- [ ] **Step 1: Build tile demo**

Add a fixed-height container with multiple `FallingBlocks.Item` children and a replay control.

- [ ] **Step 2: Add anatomy snippet**

Export `fallingBlocksAnatomyCode` showing `Root`, `Item`, `PlayButton`, and `count`/replay shape.

- [ ] **Step 3: Verify**

Run: `pnpm build`

Expected: build succeeds with no TypeScript errors.

## Task 5: Polish Story Slides And Final Verification

**Files:**
- Modify: all new slide files as needed

- [ ] **Step 1: Polish slide content**

Ensure the opening, background, functionality map, compound pattern, workflow, and closing slides support the story-first then concrete-API arc.

- [ ] **Step 2: Run production build**

Run: `pnpm build`

Expected: build succeeds and route list includes `/sharing/03-how-i-design-components`.

- [ ] **Step 3: Run local dev server**

Run: `pnpm dev`

Expected: dev server starts on localhost.

- [ ] **Step 4: Inspect in browser**

Open `/sharing/03-how-i-design-components` and verify navigation, demo fit, demo usability, readable code blocks, and theme readability.

- [ ] **Step 5: Commit implementation**

Run:

```bash
git add src/sharings/index.ts src/sharings/03-how-i-design-components docs/superpowers/plans/2026-06-01-how-i-design-components.md
git commit -m "feat: add how i design components sharing"
```

Expected: commit succeeds.
