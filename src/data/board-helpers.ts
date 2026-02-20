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
