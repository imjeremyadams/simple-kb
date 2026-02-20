# Done Celebration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use globalcoder-workflow:executing-plans to implement this plan task-by-task.

**Goal:** Fire star-shaped confetti when a card is dropped into a "Done" column.

**Architecture:** Add `canvas-confetti` library. Create a thin `celebrate()` wrapper in `src/lib/celebrate.ts`. Hook into `handleDragEnd` in App.tsx to detect cross-column moves into a "Done"-titled column and fire the celebration at the card's drop position.

**Tech Stack:** canvas-confetti (existing: React, dnd-kit, Tailwind, Vite, Vitest)

---

### Task 1: Install canvas-confetti and create celebrate utility with TDD

**Files:**
- Create: `src/lib/celebrate.ts`
- Create: `src/lib/__tests__/celebrate.test.ts`

**Step 1: Install canvas-confetti**

Run:
```bash
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

**Step 2: Write failing test**

Create `src/lib/__tests__/celebrate.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest"
import confetti from "canvas-confetti"
import { celebrate } from "../celebrate"

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}))

describe("celebrate", () => {
  it("fires star-shaped confetti at the given position", () => {
    celebrate({ x: 0.5, y: 0.3 })

    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        particleCount: 30,
        spread: 60,
        origin: { x: 0.5, y: 0.3 },
        shapes: ["star"],
      })
    )
  })

  it("uses gold/yellow/white colors", () => {
    celebrate({ x: 0.5, y: 0.5 })

    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        colors: ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff"],
      })
    )
  })
})
```

**Step 3: Run test to verify it fails**

Run: `npx vitest --run src/lib/__tests__/celebrate.test.ts`
Expected: FAIL — cannot find module `../celebrate`

**Step 4: Implement celebrate utility**

Create `src/lib/celebrate.ts`:

```typescript
import confetti from "canvas-confetti"

export function celebrate(origin: { x: number; y: number }) {
  confetti({
    particleCount: 30,
    spread: 60,
    origin,
    shapes: ["star"],
    colors: ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff"],
    ticks: 100,
    gravity: 1.2,
    scalar: 1.2,
    disableForReducedMotion: true,
  })
}
```

**Step 5: Run tests to verify they pass**

Run: `npx vitest --run src/lib/__tests__/celebrate.test.ts`
Expected: 2 tests PASS

**Step 6: Run full test suite**

Run: `npx vitest --run`
Expected: All 10 tests pass (8 existing + 2 new).

**Step 7: Commit**

```bash
git add package.json package-lock.json src/lib/
git commit -m "feat: add celebrate utility with canvas-confetti star effect (TDD)"
```

---

### Task 2: Wire celebration into handleDragEnd

> **Depends on:** Task 1

**Files:**
- Modify: `src/App.tsx:75-91`

**Step 1: Import celebrate and update handleDragEnd**

In `src/App.tsx`, add import at the top (after existing imports):

```typescript
import { celebrate } from "./lib/celebrate"
```

Then replace the `handleDragEnd` function (lines 75-91) with:

```typescript
  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const sourceCol = board.columns.find((c) => c.cardIds.includes(activeId))
    let destCol = board.columns.find((c) => c.cardIds.includes(overId))
    if (!destCol) destCol = board.columns.find((c) => c.id === overId)
    if (!sourceCol || !destCol) return

    const sourceIndex = sourceCol.cardIds.indexOf(activeId)
    const destIndex = destCol.cardIds.indexOf(overId)
    update(moveCard(board, activeId, sourceCol.id, sourceIndex, destCol.id, destIndex === -1 ? destCol.cardIds.length : destIndex))

    // Celebrate when a card moves into a "Done" column from a different column
    if (
      destCol.title.toLowerCase() === "done" &&
      sourceCol.id !== destCol.id
    ) {
      // Get card position from the DOM for confetti origin
      const el = document.getElementById(activeId)
      if (el) {
        const rect = el.getBoundingClientRect()
        celebrate({
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        })
      } else {
        // Fallback: center of screen
        celebrate({ x: 0.5, y: 0.5 })
      }
    }
  }
```

**Step 2: Add id attribute to KanbanCard for DOM lookup**

In `src/components/KanbanCard.tsx`, add `id={card.id}` to the card's outer div so `document.getElementById` can find it:

Current (the div with ref={setNodeRef}):
```tsx
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white/10 ..."
    >
```

Updated:
```tsx
    <div
      id={card.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white/10 ..."
    >
```

**Step 3: Verify all tests pass**

Run: `npx vitest --run`
Expected: All 10 tests pass.

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 5: Manual verification**

Run: `npm run dev`

Test:
- Drag a card from "To Do" to "Done" → stars should shower from the card's position
- Drag a card from "Done" to "To Do" → no celebration
- Reorder cards within "Done" → no celebration
- Drag a card from "Doing" to "Done" → celebration fires

**Step 6: Commit**

```bash
git add src/App.tsx src/components/KanbanCard.tsx
git commit -m "feat: celebrate with stars when card moves to Done column"
```
