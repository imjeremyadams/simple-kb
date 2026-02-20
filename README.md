# Simple KB

A fully functional Kanban board built from scratch in a single session to demonstrate AI-assisted development at [AI Collective Springfield MO](https://www.meetup.com/ai-collective-springfield-mo/).

## Features

**Board management**
- Create, rename, and delete columns
- Add cards with title and optional description
- Drag and drop cards between columns and reorder within columns
- Board state persists automatically in localStorage

**Glassmorphism dark theme**
- Frosted-glass panels over a gradient mesh background (purple, blue, teal blobs)
- Inter font, subtle hover lift animations on cards, blue glow on buttons
- Fully custom CSS — no UI component library

**Column colors**
- Each column has a colored top border (blue, amber, green by default)
- New columns automatically cycle through a curated 8-color palette
- Existing boards without colors are migrated seamlessly on load

**Done celebration**
- Star-shaped confetti fires when a card is dropped into a "Done" column
- Confetti originates from the card's position on screen
- Only triggers on cross-column moves (not reordering within Done)

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, @dnd-kit (drag and drop), canvas-confetti, Vitest

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Tests

```bash
npm test
```

12 tests covering board helpers, localStorage persistence, and the celebrate utility.

## AI-assisted development

This project was built using [Claude Code](https://claude.ai/code) to demonstrate AI-assisted development at a meetup. The entire codebase — types, data layer, components, drag-and-drop, glassmorphism theme, celebration effects, tests, and documentation — was generated through conversational iteration with Claude using the [globalcoder-workflow](https://github.com/globalcoder-marketplace/globalcoder-workflow) skill system for structured brainstorming, planning, and execution.
