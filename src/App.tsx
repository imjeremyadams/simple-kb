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
import { celebrate } from "./lib/celebrate"
import { addCard, moveCard, addColumn, deleteColumn, nextColumnColor } from "./data/board-helpers"
import type { Board, Card } from "./types"
import { Header } from "./components/Header"
import { KanbanColumn } from "./components/KanbanColumn"

export default function App() {
  const [board, setBoard] = useState<Board>(loadBoard)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [dragSourceColumnId, setDragSourceColumnId] = useState<string | null>(null)

  // Persist every change
  const update = useCallback((next: Board) => {
    setBoard(next)
    saveBoard(next)
  }, [])

  function handleAddCard(columnId: string, title: string, description: string) {
    update(addCard(board, columnId, title, description))
  }

  function handleAddColumn(title: string) {
    update(addColumn(board, title, nextColumnColor(board)))
  }

  function handleDeleteColumn(columnId: string) {
    update(deleteColumn(board, columnId))
  }

  // Drag-and-drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragStart(event: DragStartEvent) {
    const activeId = event.active.id as string
    const card = board.cards[activeId]
    setActiveCard(card ?? null)
    // Remember which column the card started in (before handleDragOver moves it)
    const sourceCol = board.columns.find((c) => c.cardIds.includes(activeId))
    setDragSourceColumnId(sourceCol?.id ?? null)
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

    // Celebrate when a card moves into a "Done" column from a different column.
    // Use dragSourceColumnId (captured at drag start) because handleDragOver
    // already moved the card during the drag, so sourceCol === destCol here.
    const originalSourceCol = board.columns.find((c) => c.id === dragSourceColumnId)
    if (
      destCol.title.toLowerCase() === "done" &&
      originalSourceCol &&
      originalSourceCol.id !== destCol.id
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

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Gradient mesh background */}
      <div className="mesh-background">
        <div className="mesh-blob-teal" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
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
              <div className="bg-white/15 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl shadow-blue-500/20 w-72">
                <p className="text-sm font-medium text-white">{activeCard.title}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
