# Kanban Board Design

Simple Kanban board for a meetup demo. Frontend-only, localStorage-persisted, minimal dependencies.

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- @dnd-kit/core + @dnd-kit/sortable for drag-and-drop
- Vitest + @testing-library/react for tests

## Data Model

```typescript
interface Card {
  id: string
  title: string
  description: string
}

interface Column {
  id: string
  title: string
  cardIds: string[]
}

interface Board {
  columns: Column[]
  cards: Record<string, Card>
}
```

Cards stored in a flat map for O(1) lookup. Columns hold ordered `cardIds` arrays. Moving a card = splice from source, insert into target.

## Data Layer (`src/data/storage.ts`)

- `loadBoard(): Board` — read from localStorage, return default board if empty
- `saveBoard(board: Board): void` — write to localStorage
- `createDefaultBoard(): Board` — seeds "To Do", "Doing", "Done" columns

## Component Tree

```
App
├── Header              # App title, "Add Column" button
└── Board               # Flex container, horizontal scroll, DndContext
    └── Column[]        # Droppable container
        ├── ColumnHeader  # Title + delete button
        ├── Card[]        # Draggable/sortable items
        └── AddCardForm   # Inline form at bottom
```

## State Management

Single `useState<Board>` in App. Every mutation updates board state and calls `saveBoard()`. No context or reducers.

## Drag-and-Drop

`DndContext` in Board component. `@dnd-kit/sortable` for card reordering within and across columns. `onDragEnd` handler updates `cardIds` arrays and persists.

## UI Direction

- Clean, minimal, mobile-friendly
- Must be readable on a projector (good contrast, reasonable font sizes)
- No modals — inline forms for adding columns and cards
- Horizontal scrolling board with flex layout

## Tests

1. **Add a card** — data layer: card added to column's `cardIds` and `cards` map
2. **Move a card** — drag-end handler logic: card moves between columns
3. **Save/load localStorage** — round-trip persistence, default board on empty storage
4. **Delete a column** — column removed, orphaned cards cleaned from `cards` map
