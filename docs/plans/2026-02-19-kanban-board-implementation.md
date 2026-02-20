# Kanban Board Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use globalcoder-workflow:executing-plans to implement this plan task-by-task.

**Goal:** Build a simple, localStorage-persisted Kanban board with drag-and-drop.

**Architecture:** Single-page React app. Board state lives in `useState<Board>` in App. Pure helper functions handle mutations (addCard, moveCard, etc.). Data layer handles localStorage persistence. Components are presentational — they receive data and callbacks via props.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4, @dnd-kit/core + @dnd-kit/sortable, Vitest

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `src/types/index.ts`, `.gitignore`

**Step 1: Scaffold Vite + React + TS project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

If prompted about existing files, choose to ignore them (scaffold into current directory).

Expected: Vite scaffolds a React + TypeScript project.

**Step 2: Install dependencies**

Run:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 3: Configure Tailwind in Vite**

Replace `vite.config.ts` with:

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 4: Configure Vitest**

Add to `vite.config.ts` (merge with existing):

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
})
```

Create `src/test-setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest"
```

Add `"test": "vitest"` to `package.json` scripts if not already present.

**Step 5: Set up Tailwind CSS entry point**

Replace `src/index.css` with:

```css
@import "tailwindcss";
```

**Step 6: Create type definitions**

Create `src/types/index.ts`:

```typescript
export interface Card {
  id: string
  title: string
  description: string
}

export interface Column {
  id: string
  title: string
  cardIds: string[]
}

export interface Board {
  columns: Column[]
  cards: Record<string, Card>
}
```

**Step 7: Replace App.tsx with placeholder**

Replace `src/App.tsx` with:

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4">
      <h1 className="text-2xl font-bold">Simple KB</h1>
      <p className="text-zinc-400 mt-2">Kanban board coming soon.</p>
    </div>
  )
}
```

**Step 8: Verify everything works**

Run: `npm run dev`
Expected: Vite dev server starts, page shows "Simple KB" heading with dark background.

Run: `npm run build`
Expected: Build completes with no errors.

Run: `npx vitest --run`
Expected: No tests found (or passes with 0 tests). No errors.

**Step 9: Commit**

```bash
git add -A && git commit -m "scaffold: Vite + React + TS + Tailwind + dnd-kit + Vitest"
```

---

### Task 2: Data layer with TDD

> **Depends on:** Task 1

**Files:**
- Create: `src/data/storage.ts`
- Create: `src/data/__tests__/storage.test.ts`

**Step 1: Write failing tests for storage layer**

Create `src/data/__tests__/storage.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest"
import { loadBoard, saveBoard, createDefaultBoard } from "../storage"
import type { Board } from "../../types"

beforeEach(() => {
  localStorage.clear()
})

describe("createDefaultBoard", () => {
  it("returns a board with three columns", () => {
    const board = createDefaultBoard()
    expect(board.columns).toHaveLength(3)
    expect(board.columns.map((c) => c.title)).toEqual(["To Do", "Doing", "Done"])
    expect(Object.keys(board.cards)).toHaveLength(0)
  })
})

describe("saveBoard / loadBoard", () => {
  it("round-trips a board through localStorage", () => {
    const board: Board = {
      columns: [{ id: "col-1", title: "Backlog", cardIds: ["card-1"] }],
      cards: { "card-1": { id: "card-1", title: "Test card", description: "" } },
    }
    saveBoard(board)
    const loaded = loadBoard()
    expect(loaded).toEqual(board)
  })

  it("returns default board when localStorage is empty", () => {
    const board = loadBoard()
    expect(board.columns).toHaveLength(3)
    expect(board.columns[0].title).toBe("To Do")
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest --run src/data/__tests__/storage.test.ts`
Expected: FAIL — cannot find module `../storage`

**Step 3: Implement storage layer**

Create `src/data/storage.ts`:

```typescript
import type { Board } from "../types"

const STORAGE_KEY = "simple-kb-board"

export function createDefaultBoard(): Board {
  return {
    columns: [
      { id: crypto.randomUUID(), title: "To Do", cardIds: [] },
      { id: crypto.randomUUID(), title: "Doing", cardIds: [] },
      { id: crypto.randomUUID(), title: "Done", cardIds: [] },
    ],
    cards: {},
  }
}

export function loadBoard(): Board {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return createDefaultBoard()
  try {
    return JSON.parse(raw) as Board
  } catch {
    return createDefaultBoard()
  }
}

export function saveBoard(board: Board): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest --run src/data/__tests__/storage.test.ts`
Expected: 3 tests PASS

Note: The `createDefaultBoard` test checks length and titles but not exact IDs (they're random UUIDs). The round-trip test uses fixed IDs so it can assert deep equality.

**Step 5: Commit**

```bash
git add src/data/ && git commit -m "feat: data layer with localStorage persistence (TDD)"
```

---

### Task 3: Board logic helpers with TDD

> **Depends on:** Task 1 (types exist)
> **Parallel with:** Task 2

**Files:**
- Create: `src/data/board-helpers.ts`
- Create: `src/data/__tests__/board-helpers.test.ts`

These are pure functions that take a Board and return a new Board. No side effects, no localStorage — just data transformations.

**Step 1: Write failing tests**

Create `src/data/__tests__/board-helpers.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { addCard, moveCard, addColumn, deleteColumn } from "../board-helpers"
import type { Board } from "../../types"

function makeBoard(): Board {
  return {
    columns: [
      { id: "col-1", title: "To Do", cardIds: [] },
      { id: "col-2", title: "Done", cardIds: [] },
    ],
    cards: {},
  }
}

describe("addCard", () => {
  it("adds a card to the specified column", () => {
    const board = makeBoard()
    const next = addCard(board, "col-1", "Buy milk", "2% milk")
    // Card appears in column's cardIds
    expect(next.columns[0].cardIds).toHaveLength(1)
    const cardId = next.columns[0].cardIds[0]
    // Card exists in cards map
    expect(next.cards[cardId]).toEqual(
      expect.objectContaining({ title: "Buy milk", description: "2% milk" })
    )
    // Original board unchanged
    expect(board.columns[0].cardIds).toHaveLength(0)
  })
})

describe("moveCard", () => {
  it("moves a card from one column to another", () => {
    let board = makeBoard()
    board = addCard(board, "col-1", "Task A", "")
    const cardId = board.columns[0].cardIds[0]

    const next = moveCard(board, cardId, "col-1", 0, "col-2", 0)
    expect(next.columns[0].cardIds).toHaveLength(0)
    expect(next.columns[1].cardIds).toEqual([cardId])
  })

  it("reorders a card within the same column", () => {
    let board = makeBoard()
    board = addCard(board, "col-1", "Task A", "")
    board = addCard(board, "col-1", "Task B", "")
    const [idA, idB] = board.columns[0].cardIds

    const next = moveCard(board, idA, "col-1", 0, "col-1", 1)
    expect(next.columns[0].cardIds).toEqual([idB, idA])
  })
})

describe("addColumn", () => {
  it("appends a new column", () => {
    const board = makeBoard()
    const next = addColumn(board, "In Review")
    expect(next.columns).toHaveLength(3)
    expect(next.columns[2].title).toBe("In Review")
    expect(next.columns[2].cardIds).toEqual([])
  })
})

describe("deleteColumn", () => {
  it("removes the column and its cards from the board", () => {
    let board = makeBoard()
    board = addCard(board, "col-1", "Task A", "")
    const cardId = board.columns[0].cardIds[0]

    const next = deleteColumn(board, "col-1")
    expect(next.columns).toHaveLength(1)
    expect(next.columns[0].id).toBe("col-2")
    // Card removed from cards map
    expect(next.cards[cardId]).toBeUndefined()
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest --run src/data/__tests__/board-helpers.test.ts`
Expected: FAIL — cannot find module `../board-helpers`

**Step 3: Implement board helpers**

Create `src/data/board-helpers.ts`:

```typescript
import type { Board } from "../types"

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  description: string
): Board {
  const id = crypto.randomUUID()
  return {
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
    ),
    cards: { ...board.cards, [id]: { id, title, description } },
  }
}

/** Move a card from (sourceCol, sourceIndex) to (destCol, destIndex). */
export function moveCard(
  board: Board,
  cardId: string,
  sourceColumnId: string,
  sourceIndex: number,
  destColumnId: string,
  destIndex: number
): Board {
  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.id === sourceColumnId && col.id === destColumnId) {
        // Same column reorder
        const ids = [...col.cardIds]
        ids.splice(sourceIndex, 1)
        ids.splice(destIndex, 0, cardId)
        return { ...col, cardIds: ids }
      }
      if (col.id === sourceColumnId) {
        return { ...col, cardIds: col.cardIds.filter((_, i) => i !== sourceIndex) }
      }
      if (col.id === destColumnId) {
        const ids = [...col.cardIds]
        ids.splice(destIndex, 0, cardId)
        return { ...col, cardIds: ids }
      }
      return col
    }),
  }
}

export function addColumn(board: Board, title: string): Board {
  return {
    ...board,
    columns: [
      ...board.columns,
      { id: crypto.randomUUID(), title, cardIds: [] },
    ],
  }
}

export function deleteColumn(board: Board, columnId: string): Board {
  const col = board.columns.find((c) => c.id === columnId)
  if (!col) return board
  const removedCardIds = new Set(col.cardIds)
  const cards = { ...board.cards }
  for (const id of removedCardIds) delete cards[id]
  return {
    columns: board.columns.filter((c) => c.id !== columnId),
    cards,
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest --run src/data/__tests__/board-helpers.test.ts`
Expected: 5 tests PASS

**Step 5: Commit**

```bash
git add src/data/board-helpers.ts src/data/__tests__/board-helpers.test.ts
git commit -m "feat: board mutation helpers with tests (TDD)"
```

---

### Task 4: UI components

> **Depends on:** Task 1
> **Parallel with:** Tasks 2, 3

**Files:**
- Create: `src/components/KanbanCard.tsx`
- Create: `src/components/AddCardForm.tsx`
- Create: `src/components/ColumnHeader.tsx`
- Create: `src/components/KanbanColumn.tsx`
- Create: `src/components/Header.tsx`

All components are presentational — they receive data and callbacks via props. No state management, no localStorage calls.

**Step 1: Create KanbanCard component**

Create `src/components/KanbanCard.tsx`:

```tsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Card } from "../types"

interface Props {
  card: Card
}

export function KanbanCard({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-zinc-700 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-zinc-100">{card.title}</p>
      {card.description && (
        <p className="text-xs text-zinc-400 mt-1">{card.description}</p>
      )}
    </div>
  )
}
```

**Step 2: Create AddCardForm component**

Create `src/components/AddCardForm.tsx`:

```tsx
import { useState } from "react"

interface Props {
  onAdd: (title: string, description: string) => void
}

export function AddCardForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim())
    setTitle("")
    setDescription("")
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left text-sm text-zinc-400 hover:text-zinc-200 p-2 rounded hover:bg-zinc-700/50 transition-colors"
      >
        + Add card
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        className="w-full bg-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-zinc-400 hover:text-zinc-200 text-sm px-3 py-1 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
```

**Step 3: Create ColumnHeader component**

Create `src/components/ColumnHeader.tsx`:

```tsx
interface Props {
  title: string
  cardCount: number
  onDelete: () => void
}

export function ColumnHeader({ title, cardCount, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm text-zinc-100">{title}</h2>
        <span className="text-xs text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded-full">
          {cardCount}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="text-zinc-500 hover:text-red-400 text-sm transition-colors"
        title="Delete column"
      >
        ✕
      </button>
    </div>
  )
}
```

**Step 4: Create KanbanColumn component**

Create `src/components/KanbanColumn.tsx`:

```tsx
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Card, Column } from "../types"
import { KanbanCard } from "./KanbanCard"
import { ColumnHeader } from "./ColumnHeader"
import { AddCardForm } from "./AddCardForm"

interface Props {
  column: Column
  cards: Card[]
  onAddCard: (title: string, description: string) => void
  onDeleteColumn: () => void
}

export function KanbanColumn({ column, cards, onAddCard, onDeleteColumn }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className="bg-zinc-800 rounded-xl w-72 shrink-0 flex flex-col max-h-full">
      <ColumnHeader
        title={column.title}
        cardCount={cards.length}
        onDelete={onDeleteColumn}
      />
      <div ref={setNodeRef} className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
        <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
      <div className="px-2 pb-2">
        <AddCardForm onAdd={onAddCard} />
      </div>
    </div>
  )
}
```

**Step 5: Create Header component**

Create `src/components/Header.tsx`:

```tsx
import { useState } from "react"

interface Props {
  onAddColumn: (title: string) => void
}

export function Header({ onAddColumn }: Props) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAddColumn(title.trim())
    setTitle("")
    setAdding(false)
  }

  return (
    <header className="flex items-center gap-4 px-6 py-4">
      <h1 className="text-xl font-bold text-zinc-100">Simple KB</h1>
      {adding ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Column name"
            className="bg-zinc-800 rounded px-2 py-1 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded transition-colors"
        >
          + Add column
        </button>
      )}
    </header>
  )
}
```

**Step 6: Verify build**

Run: `npm run build`
Expected: May show unused import warnings but should compile. (Components aren't wired into App yet.)

**Step 7: Commit**

```bash
git add src/components/ && git commit -m "feat: presentational components (Card, Column, Header, forms)"
```

---

### Task 5: App assembly — wire state, DnD, and persistence

> **Depends on:** Tasks 2, 3, 4

**Files:**
- Modify: `src/App.tsx`

**Step 1: Wire everything together in App.tsx**

Replace `src/App.tsx` with:

```tsx
import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { loadBoard, saveBoard } from "./data/storage"
import { addCard, moveCard, addColumn, deleteColumn } from "./data/board-helpers"
import type { Board, Card } from "./types"
import { Header } from "./components/Header"
import { KanbanColumn } from "./components/KanbanColumn"

export default function App() {
  const [board, setBoard] = useState<Board>(loadBoard)
  const [activeCard, setActiveCard] = useState<Card | null>(null)

  // Persist every change
  const update = useCallback((next: Board) => {
    setBoard(next)
    saveBoard(next)
  }, [])

  function handleAddCard(columnId: string, title: string, description: string) {
    update(addCard(board, columnId, title, description))
  }

  function handleAddColumn(title: string) {
    update(addColumn(board, title))
  }

  function handleDeleteColumn(columnId: string) {
    update(deleteColumn(board, columnId))
  }

  // Drag-and-drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragStart(event: DragStartEvent) {
    const card = board.cards[event.active.id as string]
    setActiveCard(card ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find which columns the active and over items belong to
    const sourceCol = board.columns.find((c) => c.cardIds.includes(activeId))
    let destCol = board.columns.find((c) => c.cardIds.includes(overId))

    // If over target is a column itself (empty column drop)
    if (!destCol) {
      destCol = board.columns.find((c) => c.id === overId)
    }

    if (!sourceCol || !destCol || sourceCol.id === destCol.id) return

    // Move card to new column during drag (gives visual feedback)
    const sourceIndex = sourceCol.cardIds.indexOf(activeId)
    const destIndex = destCol.cardIds.indexOf(overId)
    update(moveCard(board, activeId, sourceCol.id, sourceIndex, destCol.id, destIndex === -1 ? destCol.cardIds.length : destIndex))
  }

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
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <Header onAddColumn={handleAddColumn} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 p-6 pt-0 overflow-x-auto items-start">
          {board.columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={col.cardIds.map((id) => board.cards[id]).filter(Boolean)}
              onAddCard={(title, desc) => handleAddCard(col.id, title, desc)}
              onDeleteColumn={() => handleDeleteColumn(col.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className="bg-zinc-700 rounded-lg p-3 shadow-lg opacity-90 w-72">
              <p className="text-sm font-medium text-zinc-100">{activeCard.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
```

**Step 2: Verify the app works end-to-end**

Run: `npm run dev`

Test manually:
- Default board shows 3 columns: "To Do", "Doing", "Done"
- Can add a card via "+ Add card" in any column
- Can drag cards between columns
- Refresh the page — state persists
- Can add a new column via "+ Add column"
- Can delete a column via ✕ button

**Step 3: Run all tests**

Run: `npx vitest --run`
Expected: All 8 tests pass (3 storage + 5 board-helpers).

**Step 4: Commit**

```bash
git add src/App.tsx && git commit -m "feat: wire App with state, DnD, and localStorage persistence"
```

---

### Task 6: README

> **Depends on:** Task 5

**Files:**
- Create: `README.md`

**Step 1: Write README**

Create `README.md`:

```markdown
# Simple KB

A minimal Kanban board built to demonstrate AI-assisted development.

## Features

- Create and name columns
- Add cards with title and optional description
- Drag and drop cards between columns
- State persists in localStorage

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Tests

```bash
npm test
```

## AI-assisted development

This project was built using [Claude Code](https://claude.ai/code) to demonstrate AI-assisted development at a meetup. The entire codebase — types, data layer, components, tests, and documentation — was generated through conversational iteration with Claude.
```

**Step 2: Final build + test verification**

Run: `npm run build && npx vitest --run`
Expected: Build succeeds, all tests pass.

**Step 3: Commit**

```bash
git add README.md && git commit -m "docs: add README"
```
