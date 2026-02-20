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
