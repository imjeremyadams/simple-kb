# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple Kanban board app built to demonstrate AI-assisted development at a meetup. Prioritize good structure, readable code, and fast iteration over cleverness.

## Tech Stack

- React + Vite + TypeScript
- Frontend-only (no backend, no auth, no external services)
- State persisted in localStorage
- Minimal dependencies: React, basic styling, drag-and-drop

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run test         # Run unit tests (Vitest)
npm run test -- --run # Run tests once (no watch)
```

## Architecture

```
src/
  components/    # Board, Column, Card, dialogs/forms
  data/          # localStorage load/save layer
  types/         # Board, Column, Card interfaces
  App.tsx        # Root component
  main.tsx       # Entry point
```

**Separation of concerns:**
- Components handle rendering and user interaction
- Data layer (`src/data/`) handles localStorage persistence
- Types (`src/types/`) define the Board → Column → Card hierarchy

## Key Constraints

- UI must be clean, minimal, mobile-friendly, and readable on a projector
- Keep dependencies minimal — don't add libraries without justification
- At least 3 unit tests covering: adding a card, moving a card between columns, saving/loading from localStorage
- Add inline comments only for non-obvious logic
