# Glassmorphism Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use globalcoder-workflow:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flat zinc dark theme with a glassmorphism dark theme — frosted-glass panels over a gradient mesh background with Inter font and subtle hover animations.

**Architecture:** Purely visual changes — update Tailwind classes across 6 existing components, add gradient mesh background via custom CSS in index.css, add Inter font via Google Fonts link in index.html. No logic, data, or structural changes.

**Tech Stack:** Tailwind CSS v4 (existing), custom CSS for gradient mesh blobs, Google Fonts (Inter)

---

### Task 1: Foundation — font, background mesh, and base styles

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`
- Modify: `src/App.tsx`

**Step 1: Add Inter font to index.html**

Replace the `<head>` contents of `index.html` with:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>AI Collective Springfield MO - Simple Kanban Demo</title>
</head>
```

**Step 2: Add gradient mesh background and font to index.css**

Replace `src/index.css` with:

```css
@import "tailwindcss";

body {
  font-family: "Inter", sans-serif;
  background-color: #0f0d1a;
}

/* Gradient mesh blobs — sit behind all content via fixed positioning */
.mesh-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.mesh-background::before,
.mesh-background::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
}

/* Purple blob — top left */
.mesh-background::before {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #7c3aed, transparent 70%);
  top: -10%;
  left: -5%;
}

/* Blue blob — bottom right */
.mesh-background::after {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #2563eb, transparent 70%);
  bottom: -15%;
  right: -10%;
}

/* Third blob needs a real element since we only have ::before and ::after */
.mesh-blob-teal {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #0d9488, transparent 70%);
  top: 40%;
  right: 20%;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
  pointer-events: none;
}
```

**Step 3: Update App.tsx with mesh background and glass container**

In `src/App.tsx`, replace the outer `<div>` return JSX (lines 93-123) with:

```tsx
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
```

**Step 4: Verify visually**

Run: `npm run dev`
Expected: Dark purple-black background with visible colored blobs. Header and columns still use old zinc styles (will be updated in next tasks). DragOverlay now has glass effect. Inter font visible.

**Step 5: Verify tests still pass**

Run: `npx vitest --run`
Expected: All 8 tests pass (no logic changed).

**Step 6: Commit**

```bash
git add index.html src/index.css src/App.tsx
git commit -m "style: add gradient mesh background, Inter font, and glass DragOverlay"
```

---

### Task 2: Glass columns and header

**Files:**
- Modify: `src/components/KanbanColumn.tsx`
- Modify: `src/components/ColumnHeader.tsx`
- Modify: `src/components/Header.tsx`

**Step 1: Update KanbanColumn with glass styling**

In `src/components/KanbanColumn.tsx`, replace the outer div's className (line 19):

Old:
```tsx
<div className="bg-zinc-800 rounded-xl w-72 shrink-0 flex flex-col max-h-full">
```

New:
```tsx
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl w-72 shrink-0 flex flex-col max-h-full shadow-lg shadow-black/20">
```

**Step 2: Update ColumnHeader text colors for glass**

In `src/components/ColumnHeader.tsx`, replace the entire return JSX with:

```tsx
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm text-white">{title}</h2>
        <span className="text-xs text-white/40 bg-white/10 px-1.5 py-0.5 rounded-full">
          {cardCount}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="text-white/30 hover:text-red-400 text-sm transition-colors"
        title="Delete column"
      >
        ✕
      </button>
    </div>
  )
```

**Step 3: Update Header with glass styling**

In `src/components/Header.tsx`, replace the `<header>` opening tag className:

Old:
```tsx
<header className="flex items-center gap-4 px-6 py-4">
```

New:
```tsx
<header className="flex items-center gap-4 px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/5">
```

Also update the input and buttons inside the header:

Replace the input className:
Old:
```tsx
className="bg-zinc-800 rounded px-2 py-1 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
```

New:
```tsx
className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"
```

Replace the "+ Add column" button className:
Old:
```tsx
className="text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded transition-colors"
```

New:
```tsx
className="text-sm text-white/50 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1 rounded transition-colors"
```

**Step 4: Verify visually**

Run: `npm run dev`
Expected: Columns are frosted glass panels over the gradient mesh. Header has glass bottom border. Column headers have white text that reads well over glass.

**Step 5: Verify tests still pass**

Run: `npx vitest --run`
Expected: All 8 tests pass.

**Step 6: Commit**

```bash
git add src/components/KanbanColumn.tsx src/components/ColumnHeader.tsx src/components/Header.tsx
git commit -m "style: glass columns and header"
```

---

### Task 3: Glass cards and forms

**Files:**
- Modify: `src/components/KanbanCard.tsx`
- Modify: `src/components/AddCardForm.tsx`

**Step 1: Update KanbanCard with glass styling and hover lift**

In `src/components/KanbanCard.tsx`, replace the card div's className (line 25):

Old:
```tsx
className="bg-zinc-700 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing"
```

New:
```tsx
className="bg-white/10 border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200"
```

Also update the text colors:

Replace `text-zinc-100` with `text-white` (card title, line 27).
Replace `text-zinc-400` with `text-white/50` (card description, line 29).

Full return JSX:

```tsx
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
```

**Step 2: Update AddCardForm with glass styling**

In `src/components/AddCardForm.tsx`, replace the "+ Add card" button className (line 25):

Old:
```tsx
className="w-full text-left text-sm text-zinc-400 hover:text-zinc-200 p-2 rounded hover:bg-zinc-700/50 transition-colors"
```

New:
```tsx
className="w-full text-left text-sm text-white/40 hover:text-white/70 p-2 rounded hover:bg-white/10 transition-colors"
```

Replace both input and textarea classNames:

Old (input, line 39):
```tsx
className="w-full bg-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
```

New:
```tsx
className="w-full bg-white/10 border border-white/10 rounded px-2 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/50"
```

Old (textarea, line 46):
```tsx
className="w-full bg-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
```

New:
```tsx
className="w-full bg-white/10 border border-white/10 rounded px-2 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
```

Replace the "Add" submit button className (line 52):

Old:
```tsx
className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
```

New:
```tsx
className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded shadow-md shadow-blue-500/25 transition-all"
```

Replace the "Cancel" button className (line 58):

Old:
```tsx
className="text-zinc-400 hover:text-zinc-200 text-sm px-3 py-1 transition-colors"
```

New:
```tsx
className="text-white/40 hover:text-white/70 text-sm px-3 py-1 transition-colors"
```

**Step 3: Also update the Header's "Add" button to match the glow style**

In `src/components/Header.tsx`, update the submit button className:

Old:
```tsx
className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded transition-colors"
```

New:
```tsx
className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded shadow-md shadow-blue-500/25 transition-all"
```

And the cancel button:

Old:
```tsx
className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
```

New:
```tsx
className="text-white/40 hover:text-white/70 text-sm transition-colors"
```

**Step 4: Verify visually**

Run: `npm run dev`
Expected: Cards are glass with subtle hover lift and blue glow. Forms have glass inputs. Blue buttons have a subtle glow. The entire app should now be consistently glass-themed.

**Step 5: Verify tests and build**

Run: `npx vitest --run && npm run build`
Expected: All 8 tests pass, build succeeds.

**Step 6: Commit**

```bash
git add src/components/KanbanCard.tsx src/components/AddCardForm.tsx src/components/Header.tsx
git commit -m "style: glass cards, forms, and hover animations"
```
