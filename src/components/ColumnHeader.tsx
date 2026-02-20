interface Props {
  title: string
  cardCount: number
  onDelete: () => void
}

export function ColumnHeader({ title, cardCount, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm text-zinc-100">{title}</h2>
        <span className="text-xs text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded-full">
          {cardCount}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="text-zinc-500 hover:text-red-400 text-sm transition-colors"
        title="Delete column"
      >
        ✕
      </button>
    </div>
  )
}
