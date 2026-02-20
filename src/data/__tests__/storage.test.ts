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
      columns: [{ id: "col-1", title: "Backlog", color: "#3b82f6", cardIds: ["card-1"] }],
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
