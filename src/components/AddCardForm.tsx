import { useState } from "react"

interface Props {
  onAdd: (title: string, description: string) => void
}

export function AddCardForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim())
    setTitle("")
    setDescription("")
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left text-sm text-zinc-400 hover:text-zinc-200 p-2 rounded hover:bg-zinc-700/50 transition-colors"
      >
        + Add card
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        className="w-full bg-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-zinc-400 hover:text-zinc-200 text-sm px-3 py-1 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
