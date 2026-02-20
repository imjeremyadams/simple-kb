# Done Column Celebration Design

Star confetti celebration when a card is moved to a "Done" column.

## Trigger

- Fires when a card is dropped into a column whose title matches "done" (case-insensitive)
- Only fires on cross-column moves (not reordering within Done)
- Does not fire when moving cards out of Done

## Implementation

**Library:** `canvas-confetti` (~6kb) — star-shaped particles

**`src/lib/celebrate.ts`** — Wrapper around canvas-confetti:
- Accepts `{ x, y }` normalized screen coordinates (0-1)
- Fires ~30 star particles in gold/yellow/white colors
- Short duration (~1.5s), moderate spread, slight gravity arc
- Uses `shapes: ["star"]`

**`src/App.tsx`** — Hook into `handleDragEnd`:
- After move, check `destCol.title.toLowerCase() === "done"` and `sourceCol.id !== destCol.id`
- Get card position from dnd-kit's `active.rect.current.translated` or DOM element
- Convert to normalized coords and call `celebrate({ x, y })`

## Files Changed

- `package.json` — add `canvas-confetti` + `@types/canvas-confetti`
- Create: `src/lib/celebrate.ts`
- Create: `src/lib/__tests__/celebrate.test.ts`
- Modify: `src/App.tsx` — add celebrate call in handleDragEnd

## Edge Cases

- Reorder within Done: no celebration
- Move out of Done: no celebration
- Column renamed to "Done": existing cards don't retroactively celebrate
- Rapid successive moves: canvas-confetti handles overlapping animations
