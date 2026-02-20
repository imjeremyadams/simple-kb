We’re going to build a very simple Kanban board to demonstrate AI‑assisted development at a meetup. The app itself should be small and boring; the point is to show good structure, readable code, and fast iteration.

Tech constraints
Frontend-only web app.

Use [React + Vite + TypeScript] (change if you prefer something else).

No backend, no auth, no external services.

State stored in localStorage so the board persists across refreshes.

Keep dependencies minimal: only what’s needed for React, basic styling, and drag‑and‑drop.

User-facing requirements
I can create and name columns (e.g., “To Do”, “Doing”, “Done”).

I can create cards with:

Title (required)

Description (optional)

I can drag cards between columns.

Changes are saved automatically (localStorage).

The UI is clean and minimal, mobile-friendly, and readable on a projector.

Developer experience requirements
Use a clear, simple state model for the board (types/interfaces for Board, Column, Card).

Separate concerns:

Components for Board, Column, Card, and dialogs/forms.

A small “data layer” for loading/saving the board to localStorage.

Add a few inline comments explaining non-obvious parts.

Add at least 3 unit tests for core logic (e.g., adding a card, moving a card between columns, saving/loading from localStorage).

Include a short README.md explaining:

What the app does.

How to run it locally.

What parts of the code were AI-assisted.