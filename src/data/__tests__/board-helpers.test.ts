import { describe, it, expect } from "vitest"
import { addCard, moveCard, addColumn, deleteColumn, COLUMN_COLORS, nextColumnColor } from "../board-helpers"
import type { Board } from "../../types"

function makeBoard(): Board {
  return {
    columns: [
      { id: "col-1", title: "To Do", color: "#3b82f6", cardIds: [] },
      { id: "col-2", title: "Done", color: "#22c55e", cardIds: [] },
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
  it("appends a new column with the given color", () => {
    const board = makeBoard()
    const next = addColumn(board, "In Review", "#8b5cf6")
    expect(next.columns).toHaveLength(3)
    expect(next.columns[2].title).toBe("In Review")
    expect(next.columns[2].color).toBe("#8b5cf6")
    expect(next.columns[2].cardIds).toEqual([])
  })
})

describe("nextColumnColor", () => {
  it("cycles to the next color after the last column", () => {
    const board = makeBoard()
    // Last column has green (#22c55e) which is index 2, so next should be index 3 (violet)
    expect(nextColumnColor(board)).toBe(COLUMN_COLORS[3])
  })

  it("wraps around the palette", () => {
    const board: Board = {
      columns: [{ id: "col-1", title: "Test", color: COLUMN_COLORS[COLUMN_COLORS.length - 1], cardIds: [] }],
      cards: {},
    }
    expect(nextColumnColor(board)).toBe(COLUMN_COLORS[0])
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
