# Glassmorphism Redesign Design

Replace the flat zinc-on-zinc dark theme with a glassmorphism dark theme: frosted-glass panels over a gradient mesh background, Inter font, subtle hover animations.

## Visual Direction

- **Background:** Deep purple-black (#0f0d1a) with 2-3 large blurred radial-gradient color blobs (purple, blue, teal), fixed position, z-0
- **Columns:** `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-lg shadow-black/20`
- **Cards:** `bg-white/10 border border-white/5 rounded-xl` with hover lift (`hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/10`)
- **Header:** `backdrop-blur-md bg-white/5 border-b border-white/10`
- **Inputs:** `bg-white/10 border border-white/10`
- **Buttons:** Keep `bg-blue-600` with added `shadow-md shadow-blue-500/25` glow
- **DragOverlay:** `bg-white/15 backdrop-blur-xl border border-white/10 shadow-xl shadow-blue-500/20`
- **Font:** Inter via Google Fonts link in index.html
- **Motion:** Subtle — `transition-all duration-200` on cards for hover lift, smooth existing dnd-kit transitions

## Files Changed

- `index.html` — Inter font link tag
- `src/index.css` — gradient mesh blobs, Inter font-family, custom utilities
- `src/App.tsx` — background container with mesh blobs at z-0, content at z-10
- `src/components/KanbanColumn.tsx` — glass column panels
- `src/components/KanbanCard.tsx` — glass cards with hover lift
- `src/components/ColumnHeader.tsx` — text color adjustments for glass
- `src/components/Header.tsx` — glass header
- `src/components/AddCardForm.tsx` — glass inputs and glowing buttons

## Constraints

- No new npm dependencies (Tailwind utilities + custom CSS only)
- No structural/data changes — purely visual
- Must remain readable on a projector
