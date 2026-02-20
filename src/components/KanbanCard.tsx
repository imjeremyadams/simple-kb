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
