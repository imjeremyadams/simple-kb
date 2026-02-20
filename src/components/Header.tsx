import { useState } from "react"

interface Props {
  onAddColumn: (title: string) => void
}

export function Header({ onAddColumn }: Props) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAddColumn(title.trim())
    setTitle("")
    setAdding(false)
  }

  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/5">
      <h1 className="text-xl font-bold text-zinc-100">Simple KB</h1>
      {adding ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Column name"
            className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-sm text-white/50 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1 rounded transition-colors"
        >
          + Add column
        </button>
      )}
    </header>
  )
}
