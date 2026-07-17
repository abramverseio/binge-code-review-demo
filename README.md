# Buttercup Wedding Planner

A small internal tool for planning a wedding: guests, seating, vendors, tasks, and budget — all in one place.

## Overview

Buttercup Wedding Planner is a full-stack demo application built with React, TypeScript, and Express. It helps a couple (and their wedding party) track RSVPs, seat guests at reception tables, manage vendor relationships, keep on top of the planning checklist, and watch the budget. Storage is in-memory for now — see the [Roadmap](#roadmap) for what's next.

## Features

- **Dashboard** — upcoming wedding summary, guest count, RSVP statistics, budget summary, and recent activity.
- **Guests** — list, add, edit, delete, and search guests; track RSVP status, meal preference, and plus-ones.
- **Tables** — list reception tables and seat guests, with capacity validation.
- **Vendors** — track florists, caterers, music, and photographers, with contact info and booking status.
- **Tasks** — a wedding planning checklist with due dates, priority, and completion tracking.
- **Budget** — planned vs. actual cost per category, with remaining budget at a glance.

## Screenshots

> Screenshots coming soon — placeholders below.

| Dashboard | Guests | Tables |
| --- | --- | --- |
| ![Dashboard placeholder](docs/screenshots/dashboard.png) | ![Guests placeholder](docs/screenshots/guests.png) | ![Tables placeholder](docs/screenshots/tables.png) |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

This starts the Express API on `http://localhost:3001` and the Vite dev server on `http://localhost:5173` (which proxies `/api` requests to the server). Open `http://localhost:5173`.

### Run tests

```bash
npm test
```

### Lint and format

```bash
npm run lint
npm run format
```

## Project Structure

```
client/    React + Vite + Tailwind frontend
server/    Express + TypeScript API (in-memory repositories)
shared/    Shared TypeScript types and Zod validation schemas
docs/      Issues backlog and design docs
```

## Roadmap

- Replace the in-memory repository layer with a real database (SQLite).
- Add authentication — the API currently has an auth stub that allows every request.
- Implement pagination, sorting, and filtering on list endpoints (currently accepted but ignored).
- Seating conflict detection (e.g., flagging households split across tables).
- Export seating chart and guest list to PDF/CSV.
- Email RSVP reminders — the notification service currently only logs.
- Track dietary restrictions beyond a single meal-preference field.

See [`docs/issues.md`](docs/issues.md) for the full backlog.
