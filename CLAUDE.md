# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Feature Development Workflow

When starting any new feature, always follow this workflow:

1. **Brainstorm** (`/globalcoder-workflow:brainstorm`) - Explore the idea, ask clarifying questions, present design options, and write a design document
2. **Write Plan** (`/globalcoder-workflow:writing-plans`) - Create a detailed implementation plan with bite-sized tasks
3. **Execute Plan** (`/globalcoder-workflow:subagent-driven-development` or `/globalcoder-workflow:executing-plans`) - Implement the plan task-by-task with code reviews

Never skip straight to coding. Always start with brainstorming to ensure we understand requirements and have a solid design before implementation.

## Definition of Done

A task is NOT complete until ALL of the following are true:

1. **Tests written** - Unit tests for new hooks, components, and utilities
2. **Tests passing** - Run `npm test -- --run` and confirm all tests pass
3. **Build passing** - Run `npm run build` with no errors
4. **Code committed** - Changes committed with descriptive message

**CRITICAL**: Never mark a task complete or move to the next task until tests are written AND passing. If tests fail, fix them before proceeding.

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
