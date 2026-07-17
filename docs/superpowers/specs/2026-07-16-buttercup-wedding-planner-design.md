# Buttercup Wedding Planner — Design

Date: 2026-07-16
Status: Approved

## Purpose

Build a small but realistic full-stack demo application, "Buttercup Wedding
Planner," inspired subtly by *The Princess Bride*. The goal is a believable
GitHub repository — one that looks like a normal SaaS product that has been
actively developed for several months — suitable for opening demo pull
requests against. It does not need to be production-ready.

## Tech Stack

- React + TypeScript (client)
- Vite (client build/dev tooling)
- Tailwind CSS (styling)
- Express + TypeScript (server)
- In-memory repository layer (no database)
- REST API
- ESLint + Prettier
- Vitest (+ React Testing Library for client tests)
- TanStack Query (client data fetching/caching)
- React Router (client routing)
- Zod (shared validation schemas)

## Repo & Tooling

- npm workspaces at the root: `client/`, `server/`, `shared/`.
- `shared/` is TypeScript-source-only — no build step. Both `client` and
  `server` reference it via TS path aliases and consume it as source. This
  avoids build-ordering problems while still giving a real
  `@buttercup/shared`-style import experience.
- Root `package.json` scripts: `dev` (runs client + server concurrently via
  `concurrently`), `build`, `test` (runs Vitest across workspaces), `lint`,
  `format`.
- ESLint + Prettier configured once at the root; `client` and `server` extend
  the shared config.
- Vite dev server proxies `/api/*` to `http://localhost:3001` — avoids CORS
  configuration entirely in dev. Client runs on Vite's default port (5173).
- Engines targeted at a realistic LTS floor (Node >=18), not bleeding-edge,
  to match what a real internal repo would pin.

## `shared/` Package

- `shared/src/types/*.ts` — domain types: `Guest`, `Vendor`, `Task`, `Table`,
  `BudgetItem`, plus enums: `RsvpStatus`, `MealPreference`, `VendorCategory`,
  `VendorStatus`, `TaskPriority`.
- `shared/src/schemas/*.ts` — Zod schemas mirroring each type, used for
  create/update payload validation on both server route handlers and client
  forms. Deliberately loose in a couple of spots (e.g., unbounded `notes`
  string, no phone-format regex) to leave room for future "add stricter
  validation" work.
- `shared/src/constants.ts` — enum display labels, seed table names, vendor
  categories.

## Server (`server/`)

Layered architecture: `routes/` → `services/` → `repositories/`.

- **Repositories**: in-memory array-backed CRUD per resource
  (`GuestRepository`, `VendorRepository`, `TaskRepository`,
  `TableRepository`, `BudgetRepository`), each behind a small interface
  (e.g., `IGuestRepository`) so a future "replace mock repository with
  SQLite" PR has a clean seam.
- **Services**: business logic — RSVP stats aggregation, budget remaining
  calculation, table-capacity validation on seat assignment, dashboard
  summary aggregation. Seating "conflict detection" is a deliberate stub: the
  service method exists, returns an empty array, and is marked with a TODO as
  unimplemented.
- **Routes**: REST under `/api/guests`, `/api/vendors`, `/api/tasks`,
  `/api/tables`, `/api/budget`, `/api/dashboard`. List endpoints accept but
  do not implement `?page`/`?sort`/`?filter` query params (parsed, ignored,
  TODO comment) — leaves pagination/sorting/filtering as visible-but-inert
  backlog items.
- **Error handling**: centralized error-handling middleware mapping
  validation errors → 400, not-found → 404, else → 500, via a typed
  `AppError` class.
- **Auth stub**: a no-op `requireAuth` middleware wired into routes but
  currently always passes through, with a TODO to implement real auth.
- **Notification stub**: `NotificationService` with a `sendRsvpReminder()`
  method that logs to console instead of sending real email.
- **Seed data**: `server/src/data/seed.ts` populates all repositories at
  startup with themed demo data (see Seed Data section).

## Client (`client/`)

- **Feature folders** under `client/src/features/`: `dashboard/`, `guests/`,
  `tables/`, `vendors/`, `tasks/`, `budget/` — each with `components/`,
  `hooks/` (TanStack Query hooks, e.g. `useGuests`, `useCreateGuest`), and a
  top-level page component.
- `client/src/api/` — thin typed fetch wrappers per resource
  (`guestsApi.ts`, etc.) consumed by the TanStack Query hooks. Request and
  response bodies are validated against `shared` Zod schemas at the
  boundary.
- `client/src/components/` — small reusable cross-feature primitives:
  `Button`, `Badge`, `Modal`, `Input`, a table shell, `EmptyState`,
  `PageHeader`. Styled with Tailwind.
- `client/src/layout/` — `AppLayout` with a sidebar nav and React Router
  `<Outlet />`. Subtle Princess Bride flourish in the header (e.g., a small
  "as you wish" tooltip/easter egg) — tasteful, not gimmicky.
- **Routing** (React Router): `/` (dashboard), `/guests`, `/tables`,
  `/vendors`, `/tasks`, `/budget`. Each route renders a thin page component
  composing feature components.
- **Forms**: controlled React components validated via `shared` Zod schemas
  on submit (manual `safeParse`, no heavy form library), with inline error
  messages.
- **Guests list**: a `?search=` query param filters guests (the brief's
  explicit "Search" feature is real and working). Sorting/column-filtering
  UI is present but disabled/TODO, to keep "search" and
  "sorting/filtering" as distinct backlog concerns.
- **Export button** on the Guests page is rendered but `disabled` with a
  "Coming soon" tooltip, backing a future "export seating chart to PDF"
  issue.
- **Dashboard**: composed of small stat-card components (guest count, RSVP
  breakdown, budget summary, days-until-wedding, recent activity feed) fed
  by a single `/api/dashboard` aggregate endpoint.

## Testing (Vitest)

- **Server** (`server/src/**/*.test.ts`, node environment): repository CRUD
  (guests, tables), and service logic — RSVP stats aggregation, budget
  remaining calculation, table-capacity validation (rejects over-capacity
  seat assignment). ~6-8 tests.
- **Client** (`client/src/**/*.test.tsx`, jsdom + React Testing Library): a
  guest form validation test (rejects empty required fields) and an RSVP
  status badge rendering test (correct label/color per status). ~2-4 tests.
- Total ~10 tests. Runnable via root `npm test` and per-package `npm test`
  in `client`/`server`.

## Seed Data & Theming

- **Guests**: Buttercup, Westley, Inigo Montoya, Fezzik, Miracle Max,
  Valerie, Prince Humperdinck, Count Rugen, Vizzini, plus several ordinary
  guests with households, plus-ones, and mixed RSVP/meal-preference statuses
  — avoids feeling like a joke dataset.
- **Tables**: Cliffs of Insanity, Fire Swamp, Florin Ballroom, Guilder
  Garden, Miracle Pavilion — varied capacities, some guests seated, some
  unassigned.
- **Vendors**: Miracle Max Catering, Fezzik Security, Inigo Fencing Academy,
  Dread Pirate Photography, Vizzini Event Planning — mixed statuses
  (booked/pending/contacted), realistic estimated/actual costs.
- **Tasks**: a mix of realistic wedding-planning checklist items (venue
  deposit, cake tasting, final headcount to caterer, etc.), some with
  playful thematic titles, varied priority/due-date/completed states.
- **Budget items**: categories (Venue, Catering, Attire, Photography, Music,
  Flowers, Misc) with planned vs. actual costs, some over and some under
  budget for dashboard variety.
- Theming stays subtle throughout: sidebar/header nod, one easter-egg
  tooltip, and themed seed data names. No Princess Bride branding plastered
  across the UI — the app reads like a normal SaaS product, with the
  product name "Buttercup" itself being the primary wink.

## README & `/docs/issues.md`

- **README**: Overview, Features, Screenshots (clearly-marked placeholders),
  Getting Started (`npm install`, `npm run dev`), Project Structure tree,
  Roadmap.
- **`/docs/issues.md`**: ~30 issues in markdown, each with a title, short
  description, and label-like tags (`bug`, `enhancement`, `tech-debt`,
  `good-first-issue`). Covers dietary restrictions, seating algorithm
  improvements, PDF export, duplicate RSVP bug, case-sensitive vendor
  search, wedding timeline page, accessibility, SQLite migration,
  authentication, audit logging, and more — drawn from the TODOs actually
  left in code so issues and code cross-reference believably.

## Commit Plan

Work happens on branch `agent/init-buttercup-app`, as a sequence of ~8-10
logical commits so the history reads like staged feature work rather than a
single scaffold dump:

1. Scaffold monorepo (workspaces, tsconfig, eslint/prettier, root scripts)
2. Add shared types & Zod schemas
3. Add server: repositories, services, routes, seed data, error handling,
   auth/notification stubs
4. Add server tests
5. Add client: layout, routing, API client, TanStack Query setup
6. Add Guests feature
7. Add Tables + Vendors features
8. Add Tasks + Budget features
9. Add Dashboard + client tests
10. Add README + docs/issues.md

## Out of Scope

- Real database/persistence (explicitly in-memory only).
- Real authentication (stubbed only).
- Real email/notification delivery (stubbed only).
- Pagination, sorting, filtering implementations (deliberately left as
  inert/TODO surface area for future demo PRs).
- PDF/CSV export (button present, disabled).
- Seating conflict detection algorithm (stub only).
