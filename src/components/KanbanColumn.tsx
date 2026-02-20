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
    <div
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl w-72 shrink-0 flex flex-col max-h-full shadow-lg shadow-black/20 overflow-hidden"
      style={{ borderTopColor: column.color || "#3b82f6", borderTopWidth: 3 }}
    >
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
