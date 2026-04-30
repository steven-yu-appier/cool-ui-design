---
name: Cool UI Design Slides
overview: Build a local presentation tool for multiple sharings about "how to design cool components." Home page lists all sharings. First sharing demos the slide framework itself; second sharing is the main content (Selectable, Falling Blocks, DnD).
todos:
  - id: scaffold
    content: "Phase 1: Project scaffold (Vite + React 19 + TS + Tailwind + shadcn + TanStack Router + Jotai + Framer Motion + @notion-kit/code-block)"
    status: completed
  - id: slide-framework
    content: "Phase 2: Slide framework (SlideTemplate, SlideControls, slide viewer, home page listing sharings) + First Sharing with simple demo content"
    status: completed
  - id: selectable
    content: "Phase 3: Selectable component (copy from notion-kit, adapt to Jotai, build demo slides for Second Sharing)"
    status: pending
  - id: falling-blocks
    content: "Phase 4: Falling Blocks component (Matter.js + React DOM rendering, customizable children, demo slide for Second Sharing)"
    status: pending
  - id: selectable-dnd
    content: "Phase 5: Selectable + DnD (gesture differentiation, multi-select DnD, sortable list demo for Second Sharing)"
    status: pending
  - id: combined
    content: "Phase 6: Combined two-zone demo for Second Sharing (ordered list + physics drop zone, bidirectional drag)"
    status: pending
  - id: polish
    content: "Phase 7: Polish (code strings, intro/closing slides, animations, keyboard nav testing)"
    status: pending
isProject: false
---

# Cool UI Component Presentation App

## Decisions Made

- **Purpose**: Local presentation tool (run locally, present live)
- **Multi-sharing**: Home page lists all sharings; each sharing is its own slide deck with independent routing
- **Slides**: Flat linear list per sharing, keyboard arrows (left/right), URL hash per slide
- **Slide content**: Title + description + live component demo + code block
- **Code display**: Static hardcoded code strings, rendered via **`@notion-kit/code-block`** (uses Shiki internally, readonly mode, `github-dark` theme)
- **Theme**: Dark default with light/dark toggle (shadcn theme support)
- **Transitions**: Horizontal slide animation via **Framer Motion**
- **Registry**: Per-sharing registry file (e.g., `src/sharings/01-intro/registry.ts`, `src/sharings/02-cool-components/registry.ts`)
- **Selectable**: Copy from [@notion-kit/selectable](https://github.com/steeeee0223/notion-kit/tree/main/packages/selectable) and adapt for this project
- **Cancel selection**: Click empty space + Escape key + right-click individual item
- **DnD**: `@dnd-kit` with `@dnd-kit/sortable` for list reordering
- **Selectable + DnD gesture**: Drag on empty space = select, drag on item = reorder (Finder/Notion pattern)
- **Falling Blocks**: React DOM elements positioned by Matter.js physics (not canvas), customizable children via render prop
- **Combined demo**: Two-zone layout (ordered list + physics drop zone), drag-to-select works in both zones

---

## Tech Stack

- **Vite + React 19 + TypeScript** -> **Next.js (App Router) + React 19 + TypeScript**
- **Static Export**: The Next.js app will be configured with `output: 'export'`
- **shadcn/ui + Tailwind CSS** (UI primitives and styling)
- **Jotai** (selection state management)
- **@notion-kit/code-block** (Shiki-powered code block component with syntax highlighting, language picker, and readonly mode)
- **Framer Motion** (slide transition animations)
- **@dnd-kit + @dnd-kit/sortable** (drag-and-drop)
- **Matter.js** (physics engine for Falling Blocks)

---

## Folder Structure

```
src/
  app/
    layout.tsx     # root layout (ThemeProvider)
    page.tsx       # home page listing all sharings as cards
    sharing/[id]/page.tsx # slide viewer for a single sharing
  components/
    ui/            # shadcn primitives (button, card, etc.)
    blocks/        # reusable components: Selectable, FallingBlocks
    docs/          # SlideTemplate, SlideControls
  sharings/
    index.ts       # master registry: list of all sharings with metadata
    01-intro/      # First Sharing (simple demo of the slide framework)
      registry.tsx
      slides/
    02-cool-components/  # Second Sharing (the main content)
      registry.tsx
      slides/
  lib/
    theme.tsx      # dark/light theme provider
    utils.ts       # utility functions
```

---

## Home Page

Displays a grid/list of sharing cards. Each card shows the sharing title, description, and slide count. Clicking a card navigates to that sharing's slide viewer.

---

## First Sharing: "Introduction" (simple framework demo)

A short slide deck (3-4 slides) that demonstrates the slide framework itself. Simple content, no complex components. Serves as a proof that the framework works before building the main content.

1. **Title slide** -- "How to Design Cool Components"
2. **Demo slide** -- A simple interactive demo (e.g., a counter button or a shadcn card) with its code block to show the SlideTemplate in action
3. **Code block showcase** -- Demonstrates the `@notion-kit/code-block` component with different languages
4. **Closing slide** -- "Stay tuned for more"

---

## Second Sharing: "Cool Components" (main content, 8 slides, progressive)

1. **Intro** -- Title slide for this sharing
2. **Selectable: Basic** -- Wrapper + Item. Drag on empty space draws selection box, items highlight when selected. Demo: grid of colored cards.
3. **Selectable: Overlay** -- The drag overlay box customization. Slottable overlay with custom styling.
4. **Selectable: Toolbar** -- Floating toolbar appears on mouse-up after selection. Shows count of selected items + action buttons.
5. **Falling Blocks** -- Matter.js physics with React DOM rendering. Customizable block content (demo with tech logos). Blocks fall, bounce, settle.
6. **Selectable + DnD** -- Sortable list with drag-to-select. Gesture differentiation: empty space = select, item = reorder. Multi-select drag support.
7. **Combined: Two-Zone Demo** -- Left: ordered sortable list. Right: physics falling blocks drop zone. Drag items from list into physics zone (they fall). Drag-to-select blocks in physics zone, DnD them back to list. Drag-to-select works in both zones.
8. **Closing** -- Summary slide.

---

## Implementation Plan

### Phase 1: Project Scaffold

- Next.js (App Router) + React 19 + TypeScript project (in-place migration from Vite)
- Configure `output: 'export'` for static HTML generation
- Set up Tailwind CSS v4 and shadcn/ui
- Set up folder structure: move pages to `src/app/`
- Configure dark/light theme toggle with shadcn's `ThemeProvider` in `app/layout.tsx`

### Phase 2: Slide Framework + First Sharing

- Build `SlideTemplate` component: accepts title, description, demo (ReactNode), code (string)
- Integrate `@notion-kit/code-block` for code display (requires `"use client"`)
- Build `SlideControls`: prev/next buttons + keyboard arrow navigation + slide counter
- Build `app/page.tsx`: grid of sharing cards, each linking to its slide viewer
- Build `app/sharing/[id]/page.tsx`: slide viewer reading from registry, rendering current slide with Framer Motion horizontal transitions (requires `"use client"` and `generateStaticParams`)
- Build master sharing registry (`src/sharings/index.ts`) with sharing metadata
- **Build First Sharing** (`src/sharings/01-intro/`): 3-4 simple slides to validate the entire framework end-to-end

### Phase 3: Selectable Component (Second Sharing slides 2-4)

- Copy `@notion-kit/selectable` source into `src/components/blocks/selectable/`
- Adapt to use Jotai for selection state (atoms for selected IDs, selection box coordinates)
- Ensure API: `Selectable` (wrapper/provider), `Selectable.Overlay` (drag box, slottable), `Selectable.Item` (selectable target, slottable), `Selectable.Toolbar` (floating on mouse-up, slottable -- new, not in upstream)
- Implement cancel selection: click empty space, Escape key, right-click individual item
- Build demos for Second Sharing: slide 2 (basic), slide 3 (overlay), slide 4 (toolbar)

### Phase 4: Falling Blocks Component

- Build `FallingBlocks` container: creates Matter.js engine, floor, walls
- Render each block as a React DOM element (`position: absolute`, transform updated each frame via `requestAnimationFrame` + `Matter.Engine.update`)
- Accept children via render prop or `FallingBlocks.Item` compound component
- Intersection Observer to trigger animation when component enters viewport
- Build demo for Second Sharing slide 5 with tech logo blocks

### Phase 5: Selectable + DnD (Second Sharing slide 6)

- Integrate `@dnd-kit` with `@dnd-kit/sortable` for list reordering
- Implement gesture differentiation: pointer down on empty space starts selection, pointer down on item starts DnD
- Multi-select DnD: when dragging a selected item, all selected items move together (DnD overlay shows count)
- Build demo for Second Sharing slide 6: sortable list of cards with drag-to-select

### Phase 6: Combined Two-Zone Demo (Second Sharing slide 7)

- Build two-zone layout: `OrderedList` (left) + `FallingBlocksZone` (right)
- `OrderedList`: sortable via @dnd-kit, drag-to-select via Selectable
- `FallingBlocksZone`: acts as a droppable target. Items dropped here enter Matter.js physics world and fall
- Reverse flow: drag-to-select blocks in physics zone, DnD them back to ordered list (removes from physics, inserts at drop position)
- Shared state (Jotai) tracks which items are in which zone
- Build demo for Second Sharing slide 7

### Phase 7: Polish

- Write static code strings for all slide code blocks (both sharings)
- Add intro/closing slides for Second Sharing
- Fine-tune animations, transitions, and responsive layout for presentation
- Test keyboard navigation and sharing list navigation end-to-end
