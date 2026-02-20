import type { Board } from "../types"
import { COLUMN_COLORS } from "./board-helpers"

const STORAGE_KEY = "simple-kb-board"

const DEFAULT_COLORS: Record<string, string> = {
  "to do": "#3b82f6",
  "doing": "#f59e0b",
  "done": "#22c55e",
}

/** Backfill color for columns saved before the color field existed. */
function migrateColors(board: Board): Board {
  let changed = false
  const columns = board.columns.map((col, i) => {
    if (col.color) return col
    changed = true
    const color = DEFAULT_COLORS[col.title.toLowerCase()] ?? COLUMN_COLORS[i % COLUMN_COLORS.length]
    return { ...col, color }
  })
  return changed ? { ...board, columns } : board
}

export function createDefaultBoard(): Board {
  return {
    columns: [
      { id: crypto.randomUUID(), title: "To Do", color: "#3b82f6", cardIds: [] },
      { id: crypto.randomUUID(), title: "Doing", color: "#f59e0b", cardIds: [] },
      { id: crypto.randomUUID(), title: "Done", color: "#22c55e", cardIds: [] },
    ],
    cards: {},
  }
}

export function loadBoard(): Board {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return createDefaultBoard()
  try {
    return migrateColors(JSON.parse(raw) as Board)
  } catch {
    return createDefaultBoard()
  }
}

export function saveBoard(board: Board): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
}
