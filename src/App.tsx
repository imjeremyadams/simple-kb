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
