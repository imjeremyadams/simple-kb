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
      className="bg-white/10 border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200"
    >
      <p className="text-sm font-medium text-white">{card.title}</p>
      {card.description && (
        <p className="text-xs text-white/50 mt-1">{card.description}</p>
      )}
    </div>
  )
}
