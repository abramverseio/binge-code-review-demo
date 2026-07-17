# Buttercup Wedding Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a believable full-stack demo repo — "Buttercup Wedding Planner" — with a React+TS client, Express+TS server, and shared type/validation package, seeded with subtle *Princess Bride*-themed data, ready to host demo pull requests.

**Architecture:** npm workspaces monorepo (`client/`, `server/`, `shared/`). `shared/` is TS-source-only (no build step, consumed via path aliases). Server is layered `routes/ → services/ → repositories/` with in-memory repositories. Client uses feature folders, React Router, TanStack Query, and Tailwind, calling the server through a typed API layer validated with the same Zod schemas the server uses.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Express, Zod, TanStack Query, React Router, Vitest, React Testing Library, ESLint, Prettier, concurrently.

## Global Constraints

- Reference design doc: `docs/superpowers/specs/2026-07-16-buttercup-wedding-planner-design.md` — every task below implements a section of it.
- Node engines floor: `>=18` (repo targets a realistic LTS floor, not bleeding-edge).
- `shared/` has no build step — `client` and `server` import it as TS source via path aliases (`@buttercup/shared/*` → `shared/src/*`), never via a compiled `dist`.
- No database — repositories are in-memory arrays only. No auth provider — `requireAuth` is a stub. No real email — `NotificationService` logs to console only.
- Theming is subtle: Princess Bride references live in seed data, one header easter-egg, and copy — never plastered across UI chrome.
- Deliberate incompleteness required by the spec (do not "fix" these while implementing other tasks):
  - Seating conflict detection service method returns `[]` with a TODO.
  - List routes parse but ignore `page`/`sort`/`filter` query params (TODO comment).
  - Guests page Export button renders `disabled`.
  - Guests page sort/filter UI renders but is disabled.
  - `requireAuth` middleware always calls `next()`.
- Every commit uses `git add <specific files>` (never `-A`/`.`) and a message following the repo's existing one-line imperative style (see `git log`).
- Package manager: npm (workspaces), Node/npm versions as installed (`node -v`, `npm -v` already confirmed available).

---

## File Structure

```
package.json                          # root workspaces + scripts
tsconfig.base.json                    # shared compiler options
.eslintrc.cjs
.prettierrc.json
.prettierignore
vitest.workspace.ts                   # runs client + server vitest projects
README.md
docs/issues.md

shared/
  package.json
  tsconfig.json
  src/
    types/guest.ts
    types/vendor.ts
    types/task.ts
    types/table.ts
    types/budget.ts
    types/index.ts
    schemas/guest.schema.ts
    schemas/vendor.schema.ts
    schemas/task.schema.ts
    schemas/table.schema.ts
    schemas/budget.schema.ts
    schemas/index.ts
    constants.ts
    index.ts

server/
  package.json
  tsconfig.json
  vitest.config.ts
  src/
    app.ts
    index.ts
    errors/AppError.ts
    errors/errorHandler.ts
    middleware/requireAuth.ts
    middleware/validateBody.ts
    repositories/InMemoryRepository.ts
    repositories/GuestRepository.ts
    repositories/VendorRepository.ts
    repositories/TaskRepository.ts
    repositories/TableRepository.ts
    repositories/BudgetRepository.ts
    repositories/index.ts
    services/GuestService.ts
    services/VendorService.ts
    services/TaskService.ts
    services/TableService.ts
    services/BudgetService.ts
    services/DashboardService.ts
    services/NotificationService.ts
    services/index.ts
    routes/guests.routes.ts
    routes/vendors.routes.ts
    routes/tasks.routes.ts
    routes/tables.routes.ts
    routes/budget.routes.ts
    routes/dashboard.routes.ts
    routes/index.ts
    data/seed.ts
    repositories/GuestRepository.test.ts
    repositories/TableRepository.test.ts
    services/GuestService.test.ts
    services/BudgetService.test.ts
    services/TableService.test.ts

client/
  package.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  tailwind.config.js
  postcss.config.js
  index.html
  src/
    main.tsx
    App.tsx
    index.css
    test/setup.ts
    lib/queryClient.ts
    api/client.ts
    api/guestsApi.ts
    api/vendorsApi.ts
    api/tasksApi.ts
    api/tablesApi.ts
    api/budgetApi.ts
    api/dashboardApi.ts
    components/Button.tsx
    components/Badge.tsx
    components/Modal.tsx
    components/Input.tsx
    components/PageHeader.tsx
    components/EmptyState.tsx
    layout/AppLayout.tsx
    layout/Sidebar.tsx
    features/dashboard/DashboardPage.tsx
    features/dashboard/hooks/useDashboard.ts
    features/dashboard/components/StatCard.tsx
    features/dashboard/components/RecentActivity.tsx
    features/guests/GuestsPage.tsx
    features/guests/hooks/useGuests.ts
    features/guests/hooks/useGuestMutations.ts
    features/guests/components/GuestTable.tsx
    features/guests/components/GuestFormModal.tsx
    features/guests/components/RsvpBadge.tsx
    features/guests/components/RsvpBadge.test.tsx
    features/guests/components/GuestFormModal.test.tsx
    features/tables/TablesPage.tsx
    features/tables/hooks/useTables.ts
    features/tables/components/TableCard.tsx
    features/tables/components/SeatGuestModal.tsx
    features/vendors/VendorsPage.tsx
    features/vendors/hooks/useVendors.ts
    features/vendors/components/VendorCard.tsx
    features/vendors/components/VendorFormModal.tsx
    features/tasks/TasksPage.tsx
    features/tasks/hooks/useTasks.ts
    features/tasks/components/TaskList.tsx
    features/tasks/components/TaskFormModal.tsx
    features/budget/BudgetPage.tsx
    features/budget/hooks/useBudget.ts
    features/budget/components/BudgetTable.tsx
```

---

### Task 1: Scaffold monorepo (workspaces, tsconfig, lint/format, root scripts)

**Files:**
- Create: `package.json`, `tsconfig.base.json`, `.eslintrc.cjs`, `.prettierrc.json`, `.prettierignore`, `vitest.workspace.ts`
- Create: `shared/package.json`, `shared/tsconfig.json`, `shared/src/index.ts` (placeholder export, replaced in Task 2)
- Create: `server/package.json`, `server/tsconfig.json`
- Create: `client/package.json`, `client/tsconfig.json`

**Interfaces:**
- Produces: root scripts `npm run dev`, `npm run build`, `npm test`, `npm run lint`, `npm run format` — every later task's "verify" steps call these.
- Produces: workspace names `@buttercup/shared`, `@buttercup/server`, `@buttercup/client`.
- Produces: TS path alias `@buttercup/shared/*` → `shared/src/*`, usable from both `client/tsconfig.json` and `server/tsconfig.json`.

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "buttercup-wedding-planner",
  "private": true,
  "version": "0.1.0",
  "description": "A small wedding planning SaaS demo application.",
  "workspaces": ["shared", "server", "client"],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "dev": "concurrently -n server,client -c blue,magenta \"npm run dev -w server\" \"npm run dev -w client\"",
    "build": "npm run build -w shared --if-present && npm run build -w server && npm run build -w client",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.7.0",
    "@typescript-eslint/parser": "^7.7.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@buttercup/shared/*": ["shared/src/*"]
    }
  }
}
```

- [ ] **Step 3: Create `.eslintrc.cjs`**

```js
module.exports = {
  root: true,
  env: { es2022: true, node: true, browser: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
```

- [ ] **Step 4: Create `.prettierrc.json` and `.prettierignore`**

`.prettierrc.json`:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

`.prettierignore`:
```
dist
node_modules
coverage
```

- [ ] **Step 5: Create `vitest.workspace.ts`**

```ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace(['server/vitest.config.ts', 'client/vitest.config.ts']);
```

(This file is created now but stays inert until Tasks 3-4 and 8-9 add the referenced config files — that's expected; `npm test` simply finds nothing until then.)

- [ ] **Step 6: Create `shared/package.json`**

```json
{
  "name": "@buttercup/shared",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "zod": "^3.23.8"
  }
}
```

- [ ] **Step 7: Create `shared/tsconfig.json`**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "composite": false,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 8: Create placeholder `shared/src/index.ts`**

```ts
export const SHARED_PACKAGE_READY = true;
```

- [ ] **Step 9: Create `server/package.json`**

```json
{
  "name": "@buttercup/server",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "test": "vitest run --config vitest.config.ts"
  },
  "dependencies": {
    "@buttercup/shared": "*",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.7",
    "@types/supertest": "^6.0.2",
    "supertest": "^6.3.4",
    "tsx": "^4.7.2",
    "typescript": "^5.4.5",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 10: Create `server/tsconfig.json`**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"],
    "paths": {
      "@buttercup/shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 11: Create `client/package.json`**

```json
{
  "name": "@buttercup/client",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run --config vitest.config.ts"
  },
  "dependencies": {
    "@buttercup/shared": "*",
    "@tanstack/react-query": "^5.32.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.8",
    "vitest": "^1.5.0"
  }
}
```

- [ ] **Step 12: Create `client/tsconfig.json`**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "noEmit": true,
    "paths": {
      "@buttercup/shared/*": ["../shared/src/*"],
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 13: Install dependencies**

Run: `npm install` (from repo root)
Expected: completes without error, creates root `node_modules` and `package-lock.json`.

- [ ] **Step 14: Verify workspace wiring**

Run: `npm ls --workspaces --depth=0`
Expected: lists `@buttercup/shared`, `@buttercup/server`, `@buttercup/client` with no errors.

- [ ] **Step 15: Commit**

```bash
git add package.json package-lock.json tsconfig.base.json .eslintrc.cjs .prettierrc.json .prettierignore vitest.workspace.ts shared/package.json shared/tsconfig.json shared/src/index.ts server/package.json server/tsconfig.json client/package.json client/tsconfig.json
git commit -m "Scaffold npm workspaces monorepo for client, server, and shared"
```

---

### Task 2: Add shared types & Zod schemas

**Files:**
- Create: `shared/src/types/guest.ts`, `shared/src/types/vendor.ts`, `shared/src/types/task.ts`, `shared/src/types/table.ts`, `shared/src/types/budget.ts`, `shared/src/types/index.ts`
- Create: `shared/src/schemas/guest.schema.ts`, `shared/src/schemas/vendor.schema.ts`, `shared/src/schemas/task.schema.ts`, `shared/src/schemas/table.schema.ts`, `shared/src/schemas/budget.schema.ts`, `shared/src/schemas/index.ts`
- Create: `shared/src/constants.ts`
- Modify: `shared/src/index.ts`

**Interfaces:**
- Produces (consumed by every later server/client task):
  - Types: `Guest`, `RsvpStatus`, `MealPreference`, `Vendor`, `VendorCategory`, `VendorStatus`, `Task`, `TaskPriority`, `Table`, `BudgetItem`.
  - Schemas: `guestCreateSchema`, `guestUpdateSchema`, `vendorCreateSchema`, `vendorUpdateSchema`, `taskCreateSchema`, `taskUpdateSchema`, `tableCreateSchema`, `tableUpdateSchema`, `budgetItemCreateSchema`, `budgetItemUpdateSchema` — all `z.ZodObject`, each `*UpdateSchema` is `*CreateSchema.partial()`.
  - Constants: `RSVP_STATUS_LABELS`, `MEAL_PREFERENCE_LABELS`, `VENDOR_CATEGORY_LABELS`, `VENDOR_STATUS_LABELS`, `TASK_PRIORITY_LABELS` (all `Record<enumValue, string>`).

- [ ] **Step 1: Create `shared/src/types/guest.ts`**

```ts
export type RsvpStatus = 'pending' | 'attending' | 'declined';

export type MealPreference = 'standard' | 'vegetarian' | 'vegan' | 'gluten_free';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  household: string;
  rsvpStatus: RsvpStatus;
  mealPreference: MealPreference;
  tableId: string | null;
  plusOne: boolean;
  // TODO: support dietary restrictions beyond a single meal preference
  notes: string;
}
```

- [ ] **Step 2: Create `shared/src/types/vendor.ts`**

```ts
export type VendorCategory = 'florist' | 'caterer' | 'music' | 'photographer' | 'security' | 'planning';

export type VendorStatus = 'contacted' | 'pending' | 'booked' | 'declined';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactName: string;
  phone: string;
  email: string;
  estimatedCost: number;
  actualCost: number | null;
  status: VendorStatus;
  // TODO: vendor invoices
}
```

- [ ] **Step 3: Create `shared/src/types/task.ts`**

```ts
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  priority: TaskPriority;
  completed: boolean;
  assignedTo: string;
}
```

- [ ] **Step 4: Create `shared/src/types/table.ts`**

```ts
export interface Table {
  id: string;
  name: string;
  capacity: number;
}
```

- [ ] **Step 5: Create `shared/src/types/budget.ts`**

```ts
export interface BudgetItem {
  id: string;
  category: string;
  planned: number;
  actual: number;
}
```

- [ ] **Step 6: Create `shared/src/types/index.ts`**

```ts
export * from './guest';
export * from './vendor';
export * from './task';
export * from './table';
export * from './budget';
```

- [ ] **Step 7: Create `shared/src/schemas/guest.schema.ts`**

```ts
import { z } from 'zod';

export const rsvpStatusSchema = z.enum(['pending', 'attending', 'declined']);
export const mealPreferenceSchema = z.enum(['standard', 'vegetarian', 'vegan', 'gluten_free']);

export const guestCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  household: z.string().min(1, 'Household is required'),
  rsvpStatus: rsvpStatusSchema.default('pending'),
  mealPreference: mealPreferenceSchema.default('standard'),
  tableId: z.string().nullable().default(null),
  plusOne: z.boolean().default(false),
  // Intentionally unbounded — no max length. TODO: add stricter validation.
  notes: z.string().default(''),
});

export const guestUpdateSchema = guestCreateSchema.partial();

export type GuestCreateInput = z.infer<typeof guestCreateSchema>;
export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>;
```

- [ ] **Step 8: Create `shared/src/schemas/vendor.schema.ts`**

```ts
import { z } from 'zod';

export const vendorCategorySchema = z.enum([
  'florist',
  'caterer',
  'music',
  'photographer',
  'security',
  'planning',
]);
export const vendorStatusSchema = z.enum(['contacted', 'pending', 'booked', 'declined']);

export const vendorCreateSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  category: vendorCategorySchema,
  contactName: z.string().min(1, 'Contact name is required'),
  // Intentionally loose — no phone-format regex. TODO: add stricter validation.
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Must be a valid email'),
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().nonnegative().nullable().default(null),
  status: vendorStatusSchema.default('contacted'),
});

export const vendorUpdateSchema = vendorCreateSchema.partial();

export type VendorCreateInput = z.infer<typeof vendorCreateSchema>;
export type VendorUpdateInput = z.infer<typeof vendorUpdateSchema>;
```

- [ ] **Step 9: Create `shared/src/schemas/task.schema.ts`**

```ts
import { z } from 'zod';

export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: taskPrioritySchema.default('medium'),
  completed: z.boolean().default(false),
  assignedTo: z.string().default(''),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
```

- [ ] **Step 10: Create `shared/src/schemas/table.schema.ts`**

```ts
import { z } from 'zod';

export const tableCreateSchema = z.object({
  name: z.string().min(1, 'Table name is required'),
  capacity: z.number().int().positive('Capacity must be at least 1'),
});

export const tableUpdateSchema = tableCreateSchema.partial();

export type TableCreateInput = z.infer<typeof tableCreateSchema>;
export type TableUpdateInput = z.infer<typeof tableUpdateSchema>;
```

- [ ] **Step 11: Create `shared/src/schemas/budget.schema.ts`**

```ts
import { z } from 'zod';

export const budgetItemCreateSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  planned: z.number().nonnegative(),
  actual: z.number().nonnegative().default(0),
});

export const budgetItemUpdateSchema = budgetItemCreateSchema.partial();

export type BudgetItemCreateInput = z.infer<typeof budgetItemCreateSchema>;
export type BudgetItemUpdateInput = z.infer<typeof budgetItemUpdateSchema>;
```

- [ ] **Step 12: Create `shared/src/schemas/index.ts`**

```ts
export * from './guest.schema';
export * from './vendor.schema';
export * from './task.schema';
export * from './table.schema';
export * from './budget.schema';
```

- [ ] **Step 13: Create `shared/src/constants.ts`**

```ts
import type {
  RsvpStatus,
  MealPreference,
  VendorCategory,
  VendorStatus,
  TaskPriority,
} from './types';

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  pending: 'Pending',
  attending: 'Attending',
  declined: 'Declined',
};

export const MEAL_PREFERENCE_LABELS: Record<MealPreference, string> = {
  standard: 'Standard',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  gluten_free: 'Gluten-Free',
};

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  florist: 'Florist',
  caterer: 'Caterer',
  music: 'Music',
  photographer: 'Photographer',
  security: 'Security',
  planning: 'Event Planning',
};

export const VENDOR_STATUS_LABELS: Record<VendorStatus, string> = {
  contacted: 'Contacted',
  pending: 'Pending',
  booked: 'Booked',
  declined: 'Declined',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
```

- [ ] **Step 14: Replace `shared/src/index.ts`**

```ts
export * from './types';
export * from './schemas';
export * from './constants';
```

- [ ] **Step 15: Typecheck shared package**

Run: `npx tsc -p shared/tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 16: Commit**

```bash
git add shared/src
git commit -m "Add shared domain types, Zod schemas, and label constants"
```

---

### Task 3: Add server core — repositories, services, routes, seed data, error handling, stubs

**Files:**
- Create: `server/src/errors/AppError.ts`, `server/src/errors/errorHandler.ts`
- Create: `server/src/middleware/requireAuth.ts`, `server/src/middleware/validateBody.ts`
- Create: `server/src/repositories/InMemoryRepository.ts`, `server/src/repositories/GuestRepository.ts`, `server/src/repositories/VendorRepository.ts`, `server/src/repositories/TaskRepository.ts`, `server/src/repositories/TableRepository.ts`, `server/src/repositories/BudgetRepository.ts`, `server/src/repositories/index.ts`
- Create: `server/src/services/GuestService.ts`, `server/src/services/VendorService.ts`, `server/src/services/TaskService.ts`, `server/src/services/TableService.ts`, `server/src/services/BudgetService.ts`, `server/src/services/DashboardService.ts`, `server/src/services/NotificationService.ts`, `server/src/services/index.ts`
- Create: `server/src/routes/guests.routes.ts`, `server/src/routes/vendors.routes.ts`, `server/src/routes/tasks.routes.ts`, `server/src/routes/tables.routes.ts`, `server/src/routes/budget.routes.ts`, `server/src/routes/dashboard.routes.ts`, `server/src/routes/index.ts`
- Create: `server/src/data/seed.ts`
- Create: `server/src/app.ts`, `server/src/index.ts`

**Interfaces:**
- Consumes: all types/schemas from Task 2 (`shared/src/index.ts`).
- Produces (consumed by Task 4 tests and by the client in Tasks 5-9):
  - `IRepository<T>` generic interface: `findAll(): T[]`, `findById(id: string): T | undefined`, `create(data: Omit<T,'id'>): T`, `update(id: string, data: Partial<T>): T | undefined`, `delete(id: string): boolean`.
  - `guestRepository`, `vendorRepository`, `taskRepository`, `tableRepository`, `budgetRepository` — singleton instances seeded at import time.
  - `GuestService.listGuests(query)`, `.getGuest(id)`, `.createGuest(input)`, `.updateGuest(id, input)`, `.deleteGuest(id)`, `.getRsvpStats()`.
  - `TableService.seatGuest(tableId, guestId)` — throws `AppError` (400) if table is at capacity.
  - `TableService.detectSeatingConflicts()` — returns `[]`, marked TODO.
  - `BudgetService.getSummary()` — returns `{ totalPlanned, totalActual, remaining }`.
  - `DashboardService.getSummary()` — returns `{ guestCount, rsvpStats, budgetSummary, upcomingTasks, recentActivity }`.
  - `NotificationService.sendRsvpReminder(guestId)` — logs, returns `Promise<void>`.
  - `createApp(): express.Express` from `app.ts` — used directly by server tests (Task 4) via `supertest`.
  - REST routes mounted at `/api/guests`, `/api/vendors`, `/api/tasks`, `/api/tables`, `/api/budget`, `/api/dashboard`.

- [ ] **Step 1: Create `server/src/errors/AppError.ts`**

```ts
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static notFound(resource: string, id: string): AppError {
    return new AppError(404, `${resource} with id "${id}" was not found`);
  }

  static badRequest(message: string): AppError {
    return new AppError(400, message);
  }
}
```

- [ ] **Step 2: Create `server/src/errors/errorHandler.ts`**

```ts
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from './AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.flatten() });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
```

- [ ] **Step 3: Create `server/src/middleware/requireAuth.ts`**

```ts
import type { NextFunction, Request, Response } from 'express';

/**
 * Authentication stub. Every request is currently allowed through.
 * TODO: implement real authentication (see docs/issues.md — "Add authentication").
 */
export function requireAuth(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
```

- [ ] **Step 4: Create `server/src/middleware/validateBody.ts`**

```ts
import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}
```

- [ ] **Step 5: Create `server/src/repositories/InMemoryRepository.ts`**

```ts
export interface IRepository<T extends { id: string }> {
  findAll(): T[];
  findById(id: string): T | undefined;
  create(data: Omit<T, 'id'>): T;
  update(id: string, data: Partial<Omit<T, 'id'>>): T | undefined;
  delete(id: string): boolean;
}

let nextId = 1;

function generateId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

export class InMemoryRepository<T extends { id: string }> implements IRepository<T> {
  protected items: T[] = [];

  constructor(private readonly idPrefix: string) {}

  seed(items: T[]): void {
    this.items = [...items];
  }

  findAll(): T[] {
    return [...this.items];
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(data: Omit<T, 'id'>): T {
    const item = { ...data, id: generateId(this.idPrefix) } as T;
    this.items.push(item);
    return item;
  }

  update(id: string, data: Partial<Omit<T, 'id'>>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    const updated = { ...this.items[index], ...data } as T;
    this.items[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
```

- [ ] **Step 6: Create the five repository subclasses**

`server/src/repositories/GuestRepository.ts`:
```ts
import type { Guest } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class GuestRepository extends InMemoryRepository<Guest> {
  constructor() {
    super('guest');
  }

  findByTable(tableId: string): Guest[] {
    return this.findAll().filter((guest) => guest.tableId === tableId);
  }
}

export const guestRepository = new GuestRepository();
```

`server/src/repositories/VendorRepository.ts`:
```ts
import type { Vendor } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class VendorRepository extends InMemoryRepository<Vendor> {
  constructor() {
    super('vendor');
  }
}

export const vendorRepository = new VendorRepository();
```

`server/src/repositories/TaskRepository.ts`:
```ts
import type { Task } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class TaskRepository extends InMemoryRepository<Task> {
  constructor() {
    super('task');
  }
}

export const taskRepository = new TaskRepository();
```

`server/src/repositories/TableRepository.ts`:
```ts
import type { Table } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class TableRepository extends InMemoryRepository<Table> {
  constructor() {
    super('table');
  }
}

export const tableRepository = new TableRepository();
```

`server/src/repositories/BudgetRepository.ts`:
```ts
import type { BudgetItem } from '@buttercup/shared/types';
import { InMemoryRepository } from './InMemoryRepository';

export class BudgetRepository extends InMemoryRepository<BudgetItem> {
  constructor() {
    super('budget');
  }
}

export const budgetRepository = new BudgetRepository();
```

`server/src/repositories/index.ts`:
```ts
export * from './InMemoryRepository';
export * from './GuestRepository';
export * from './VendorRepository';
export * from './TaskRepository';
export * from './TableRepository';
export * from './BudgetRepository';
```

- [ ] **Step 7: Create `server/src/data/seed.ts`**

```ts
import { guestRepository } from '../repositories/GuestRepository';
import { vendorRepository } from '../repositories/VendorRepository';
import { taskRepository } from '../repositories/TaskRepository';
import { tableRepository } from '../repositories/TableRepository';
import { budgetRepository } from '../repositories/BudgetRepository';
import type { Guest, Vendor, Task, Table, BudgetItem } from '@buttercup/shared/types';

export function seedDatabase(): void {
  const tables: Table[] = [
    { id: 'table-1', name: 'Cliffs of Insanity', capacity: 8 },
    { id: 'table-2', name: 'Fire Swamp', capacity: 6 },
    { id: 'table-3', name: 'Florin Ballroom', capacity: 10 },
    { id: 'table-4', name: 'Guilder Garden', capacity: 8 },
    { id: 'table-5', name: 'Miracle Pavilion', capacity: 4 },
  ];
  tableRepository.seed(tables);

  const guests: Guest[] = [
    { id: 'guest-1', firstName: 'Westley', lastName: '', household: 'The Groom', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-3', plusOne: false, notes: 'Groom.' },
    { id: 'guest-2', firstName: 'Buttercup', lastName: '', household: 'The Bride', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-3', plusOne: false, notes: 'Bride.' },
    { id: 'guest-3', firstName: 'Inigo', lastName: 'Montoya', household: 'Wedding Party', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-1', plusOne: true, notes: 'Best man. Has a few words prepared.' },
    { id: 'guest-4', firstName: 'Fezzik', lastName: '', household: 'Wedding Party', rsvpStatus: 'attending', mealPreference: 'vegetarian', tableId: 'table-1', plusOne: false, notes: '' },
    { id: 'guest-5', firstName: 'Miracle', lastName: 'Max', household: 'Family Friends', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-5', plusOne: true, notes: 'Bring the chocolate-coated pill just in case.' },
    { id: 'guest-6', firstName: 'Valerie', lastName: '', household: 'Family Friends', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-5', plusOne: false, notes: '' },
    { id: 'guest-7', firstName: 'Prince', lastName: 'Humperdinck', household: 'Florin Royal Court', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: 'Sent regrets.' },
    { id: 'guest-8', firstName: 'Count', lastName: 'Rugen', household: 'Florin Royal Court', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'guest-9', firstName: 'Vizzini', lastName: '', household: 'Guilder Delegation', rsvpStatus: 'pending', mealPreference: 'standard', tableId: null, plusOne: false, notes: 'Awaiting reply.' },
    { id: 'guest-10', firstName: 'Alice', lastName: 'Fenwick', household: 'Fenwick Family', rsvpStatus: 'attending', mealPreference: 'vegan', tableId: 'table-4', plusOne: true, notes: '' },
    { id: 'guest-11', firstName: 'Tom', lastName: 'Fenwick', household: 'Fenwick Family', rsvpStatus: 'attending', mealPreference: 'standard', tableId: 'table-4', plusOne: false, notes: '' },
    { id: 'guest-12', firstName: 'Priya', lastName: 'Shah', household: 'College Friends', rsvpStatus: 'attending', mealPreference: 'gluten_free', tableId: 'table-4', plusOne: false, notes: '' },
    { id: 'guest-13', firstName: 'Marcus', lastName: 'Ortiz', household: 'College Friends', rsvpStatus: 'pending', mealPreference: 'standard', tableId: null, plusOne: true, notes: '' },
    { id: 'guest-14', firstName: 'Helen', lastName: 'OBrien', household: 'Neighbors', rsvpStatus: 'attending', mealPreference: 'vegetarian', tableId: 'table-2', plusOne: false, notes: '' },
    { id: 'guest-15', firstName: 'Grant', lastName: 'Diaz', household: 'Neighbors', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: 'Scheduling conflict.' },
  ];
  guestRepository.seed(guests);

  const vendors: Vendor[] = [
    { id: 'vendor-1', name: 'Miracle Max Catering', category: 'caterer', contactName: 'Max', phone: '555-010-1001', email: 'max@miraclemaxcatering.example', estimatedCost: 12000, actualCost: 11800, status: 'booked' },
    { id: 'vendor-2', name: 'Fezzik Security', category: 'security', contactName: 'Fezzik', phone: '555-010-1002', email: 'fezzik@fezzikevents.example', estimatedCost: 2500, actualCost: null, status: 'booked' },
    { id: 'vendor-3', name: 'Inigo Fencing Academy', category: 'music', contactName: 'Inigo Montoya', phone: '555-010-1003', email: 'inigo@fencingacademy.example', estimatedCost: 1800, actualCost: null, status: 'pending' },
    { id: 'vendor-4', name: 'Dread Pirate Photography', category: 'photographer', contactName: 'Westley', phone: '555-010-1004', email: 'bookings@dreadpiratephoto.example', estimatedCost: 4200, actualCost: 4200, status: 'booked' },
    { id: 'vendor-5', name: 'Vizzini Event Planning', category: 'planning', contactName: 'Vizzini', phone: '555-010-1005', email: 'vizzini@inconceivableevents.example', estimatedCost: 3000, actualCost: null, status: 'contacted' },
    { id: 'vendor-6', name: 'Florin Blooms', category: 'florist', contactName: 'Rosa Delgado', phone: '555-010-1006', email: 'rosa@florinblooms.example', estimatedCost: 2200, actualCost: 2350, status: 'booked' },
  ];
  vendorRepository.seed(vendors);

  const tasks: Task[] = [
    { id: 'task-1', title: 'Pay venue deposit', description: 'Wire deposit to Florin Ballroom.', dueDate: '2026-08-01', priority: 'high', completed: true, assignedTo: 'Buttercup' },
    { id: 'task-2', title: 'Finalize guest list', description: 'Confirm final headcount for catering.', dueDate: '2026-08-15', priority: 'high', completed: false, assignedTo: 'Westley' },
    { id: 'task-3', title: 'Cake tasting', description: 'Schedule tasting with two bakeries.', dueDate: '2026-08-20', priority: 'medium', completed: false, assignedTo: 'Buttercup' },
    { id: 'task-4', title: 'Confirm security detail', description: 'Walk the venue perimeter with Fezzik.', dueDate: '2026-08-10', priority: 'medium', completed: false, assignedTo: 'Fezzik' },
    { id: 'task-5', title: 'Order invitations', description: 'Finalize wording and place print order.', dueDate: '2026-07-25', priority: 'high', completed: true, assignedTo: 'Vizzini Event Planning' },
    { id: 'task-6', title: 'Book officiant', description: 'The Impressive Clergyman is available on the date.', dueDate: '2026-08-05', priority: 'medium', completed: true, assignedTo: 'Buttercup' },
    { id: 'task-7', title: 'Send final headcount to caterer', description: 'Due one week before the wedding.', dueDate: '2026-09-01', priority: 'high', completed: false, assignedTo: 'Westley' },
    { id: 'task-8', title: 'Arrange transportation', description: 'Coordinate carriages for the wedding party.', dueDate: '2026-08-28', priority: 'low', completed: false, assignedTo: 'Vizzini Event Planning' },
  ];
  taskRepository.seed(tasks);

  const budgetItems: BudgetItem[] = [
    { id: 'budget-1', category: 'Venue', planned: 15000, actual: 15000 },
    { id: 'budget-2', category: 'Catering', planned: 12000, actual: 11800 },
    { id: 'budget-3', category: 'Attire', planned: 3000, actual: 3400 },
    { id: 'budget-4', category: 'Photography', planned: 4200, actual: 4200 },
    { id: 'budget-5', category: 'Music', planned: 1800, actual: 0 },
    { id: 'budget-6', category: 'Flowers', planned: 2200, actual: 2350 },
    { id: 'budget-7', category: 'Security', planned: 2500, actual: 0 },
    { id: 'budget-8', category: 'Miscellaneous', planned: 1500, actual: 620 },
  ];
  budgetRepository.seed(budgetItems);
}
```

- [ ] **Step 8: Create the service layer**

`server/src/services/NotificationService.ts`:
```ts
/**
 * Notification stub. Currently logs instead of sending real email.
 * TODO: email RSVP reminders (see docs/issues.md).
 */
export class NotificationService {
  async sendRsvpReminder(guestId: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`[notification-stub] Would send RSVP reminder to guest ${guestId}`);
  }
}

export const notificationService = new NotificationService();
```

`server/src/services/GuestService.ts`:
```ts
import type { Guest, RsvpStatus } from '@buttercup/shared/types';
import type { GuestCreateInput, GuestUpdateInput } from '@buttercup/shared/schemas';
import { guestRepository, type GuestRepository } from '../repositories/GuestRepository';
import { AppError } from '../errors/AppError';

export interface GuestListQuery {
  search?: string;
}

export interface RsvpStats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
}

export class GuestService {
  constructor(private readonly repository: GuestRepository = guestRepository) {}

  listGuests(query: GuestListQuery = {}): Guest[] {
    const guests = this.repository.findAll();
    if (!query.search) return guests;

    const term = query.search.toLowerCase();
    // TODO: optimize guest search (linear scan is fine at this scale, not at production scale)
    return guests.filter((guest) =>
      `${guest.firstName} ${guest.lastName} ${guest.household}`.toLowerCase().includes(term),
    );
  }

  getGuest(id: string): Guest {
    const guest = this.repository.findById(id);
    if (!guest) throw AppError.notFound('Guest', id);
    return guest;
  }

  createGuest(input: GuestCreateInput): Guest {
    return this.repository.create(input as Omit<Guest, 'id'>);
  }

  updateGuest(id: string, input: GuestUpdateInput): Guest {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('Guest', id);
    return updated;
  }

  deleteGuest(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('Guest', id);
  }

  getRsvpStats(): RsvpStats {
    const guests = this.repository.findAll();
    const counts: Record<RsvpStatus, number> = { attending: 0, declined: 0, pending: 0 };
    for (const guest of guests) {
      counts[guest.rsvpStatus] += 1;
    }
    return { total: guests.length, ...counts };
  }
}

export const guestService = new GuestService();
```

`server/src/services/VendorService.ts`:
```ts
import type { Vendor } from '@buttercup/shared/types';
import type { VendorCreateInput, VendorUpdateInput } from '@buttercup/shared/schemas';
import { vendorRepository, type VendorRepository } from '../repositories/VendorRepository';
import { AppError } from '../errors/AppError';

export class VendorService {
  constructor(private readonly repository: VendorRepository = vendorRepository) {}

  listVendors(): Vendor[] {
    return this.repository.findAll();
  }

  getVendor(id: string): Vendor {
    const vendor = this.repository.findById(id);
    if (!vendor) throw AppError.notFound('Vendor', id);
    return vendor;
  }

  createVendor(input: VendorCreateInput): Vendor {
    return this.repository.create(input as Omit<Vendor, 'id'>);
  }

  updateVendor(id: string, input: VendorUpdateInput): Vendor {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('Vendor', id);
    return updated;
  }

  deleteVendor(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('Vendor', id);
  }
}

export const vendorService = new VendorService();
```

`server/src/services/TaskService.ts`:
```ts
import type { Task } from '@buttercup/shared/types';
import type { TaskCreateInput, TaskUpdateInput } from '@buttercup/shared/schemas';
import { taskRepository, type TaskRepository } from '../repositories/TaskRepository';
import { AppError } from '../errors/AppError';

export class TaskService {
  constructor(private readonly repository: TaskRepository = taskRepository) {}

  listTasks(): Task[] {
    return this.repository.findAll();
  }

  getTask(id: string): Task {
    const task = this.repository.findById(id);
    if (!task) throw AppError.notFound('Task', id);
    return task;
  }

  createTask(input: TaskCreateInput): Task {
    return this.repository.create(input as Omit<Task, 'id'>);
  }

  updateTask(id: string, input: TaskUpdateInput): Task {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('Task', id);
    return updated;
  }

  deleteTask(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('Task', id);
  }
}

export const taskService = new TaskService();
```

`server/src/services/TableService.ts`:
```ts
import type { Table } from '@buttercup/shared/types';
import type { TableCreateInput, TableUpdateInput } from '@buttercup/shared/schemas';
import { tableRepository, type TableRepository } from '../repositories/TableRepository';
import { guestRepository, type GuestRepository } from '../repositories/GuestRepository';
import { AppError } from '../errors/AppError';

export class TableService {
  constructor(
    private readonly tables: TableRepository = tableRepository,
    private readonly guests: GuestRepository = guestRepository,
  ) {}

  listTables(): Table[] {
    return this.tables.findAll();
  }

  getTable(id: string): Table {
    const table = this.tables.findById(id);
    if (!table) throw AppError.notFound('Table', id);
    return table;
  }

  createTable(input: TableCreateInput): Table {
    return this.tables.create(input as Omit<Table, 'id'>);
  }

  updateTable(id: string, input: TableUpdateInput): Table {
    const updated = this.tables.update(id, input);
    if (!updated) throw AppError.notFound('Table', id);
    return updated;
  }

  deleteTable(id: string): void {
    const deleted = this.tables.delete(id);
    if (!deleted) throw AppError.notFound('Table', id);
  }

  /**
   * Assigns a guest to a table, rejecting the assignment if the table is
   * already at capacity.
   */
  seatGuest(tableId: string, guestId: string) {
    const table = this.getTable(tableId);
    const guest = this.guests.findById(guestId);
    if (!guest) throw AppError.notFound('Guest', guestId);

    const currentlySeated = this.guests.findByTable(tableId).filter((g) => g.id !== guestId);
    if (currentlySeated.length >= table.capacity) {
      throw AppError.badRequest(
        `Table "${table.name}" is at capacity (${table.capacity} seats)`,
      );
    }

    const updated = this.guests.update(guestId, { tableId });
    if (!updated) throw AppError.notFound('Guest', guestId);
    return updated;
  }

  /**
   * TODO: seating conflict detection — e.g. flag known feuds
   * (Prince Humperdinck / Count Rugen seated with Westley's party) or
   * households split across tables. Currently a stub.
   */
  detectSeatingConflicts(): string[] {
    return [];
  }
}

export const tableService = new TableService();
```

`server/src/services/BudgetService.ts`:
```ts
import type { BudgetItem } from '@buttercup/shared/types';
import type { BudgetItemCreateInput, BudgetItemUpdateInput } from '@buttercup/shared/schemas';
import { budgetRepository, type BudgetRepository } from '../repositories/BudgetRepository';
import { AppError } from '../errors/AppError';

export interface BudgetSummary {
  totalPlanned: number;
  totalActual: number;
  remaining: number;
}

export class BudgetService {
  constructor(private readonly repository: BudgetRepository = budgetRepository) {}

  listItems(): BudgetItem[] {
    return this.repository.findAll();
  }

  createItem(input: BudgetItemCreateInput): BudgetItem {
    return this.repository.create(input as Omit<BudgetItem, 'id'>);
  }

  updateItem(id: string, input: BudgetItemUpdateInput): BudgetItem {
    const updated = this.repository.update(id, input);
    if (!updated) throw AppError.notFound('BudgetItem', id);
    return updated;
  }

  deleteItem(id: string): void {
    const deleted = this.repository.delete(id);
    if (!deleted) throw AppError.notFound('BudgetItem', id);
  }

  getSummary(): BudgetSummary {
    const items = this.repository.findAll();
    const totalPlanned = items.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
    return { totalPlanned, totalActual, remaining: totalPlanned - totalActual };
  }
}

export const budgetService = new BudgetService();
```

`server/src/services/DashboardService.ts`:
```ts
import { guestService } from './GuestService';
import { budgetService } from './BudgetService';
import { taskRepository } from '../repositories/TaskRepository';

export interface RecentActivityItem {
  id: string;
  message: string;
}

export interface DashboardSummary {
  guestCount: number;
  rsvpStats: ReturnType<typeof guestService.getRsvpStats>;
  budgetSummary: ReturnType<typeof budgetService.getSummary>;
  upcomingTasks: ReturnType<typeof taskRepository.findAll>;
  // TODO: back this with a real activity log; currently derived ad-hoc from tasks.
  recentActivity: RecentActivityItem[];
}

export class DashboardService {
  getSummary(): DashboardSummary {
    const guests = guestService.listGuests();
    const rsvpStats = guestService.getRsvpStats();
    const budgetSummary = budgetService.getSummary();
    const upcomingTasks = taskRepository
      .findAll()
      .filter((task) => !task.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);

    const recentActivity: RecentActivityItem[] = taskRepository
      .findAll()
      .filter((task) => task.completed)
      .slice(0, 5)
      .map((task) => ({ id: task.id, message: `Completed: ${task.title}` }));

    return {
      guestCount: guests.length,
      rsvpStats,
      budgetSummary,
      upcomingTasks,
      recentActivity,
    };
  }
}

export const dashboardService = new DashboardService();
```

`server/src/services/index.ts`:
```ts
export * from './GuestService';
export * from './VendorService';
export * from './TaskService';
export * from './TableService';
export * from './BudgetService';
export * from './DashboardService';
export * from './NotificationService';
```

- [ ] **Step 9: Create the route modules**

`server/src/routes/guests.routes.ts`:
```ts
import { Router } from 'express';
import { guestCreateSchema, guestUpdateSchema } from '@buttercup/shared/schemas';
import { guestService } from '../services/GuestService';
import { validateBody } from '../middleware/validateBody';

export const guestsRouter = Router();

guestsRouter.get('/', (req, res) => {
  // TODO: implement pagination and sorting; page/sort params are accepted but ignored
  const { search, page, sort } = req.query;
  void page;
  void sort;
  res.json(guestService.listGuests({ search: typeof search === 'string' ? search : undefined }));
});

guestsRouter.get('/rsvp-stats', (_req, res) => {
  res.json(guestService.getRsvpStats());
});

guestsRouter.get('/:id', (req, res) => {
  res.json(guestService.getGuest(req.params.id));
});

guestsRouter.post('/', validateBody(guestCreateSchema), (req, res) => {
  res.status(201).json(guestService.createGuest(req.body));
});

guestsRouter.patch('/:id', validateBody(guestUpdateSchema), (req, res) => {
  res.json(guestService.updateGuest(req.params.id, req.body));
});

guestsRouter.delete('/:id', (req, res) => {
  guestService.deleteGuest(req.params.id);
  res.status(204).send();
});
```

`server/src/routes/vendors.routes.ts`:
```ts
import { Router } from 'express';
import { vendorCreateSchema, vendorUpdateSchema } from '@buttercup/shared/schemas';
import { vendorService } from '../services/VendorService';
import { validateBody } from '../middleware/validateBody';

export const vendorsRouter = Router();

vendorsRouter.get('/', (req, res) => {
  // TODO: vendor search is case-sensitive on the client; consider normalizing here too
  void req.query.filter;
  res.json(vendorService.listVendors());
});

vendorsRouter.get('/:id', (req, res) => {
  res.json(vendorService.getVendor(req.params.id));
});

vendorsRouter.post('/', validateBody(vendorCreateSchema), (req, res) => {
  res.status(201).json(vendorService.createVendor(req.body));
});

vendorsRouter.patch('/:id', validateBody(vendorUpdateSchema), (req, res) => {
  res.json(vendorService.updateVendor(req.params.id, req.body));
});

vendorsRouter.delete('/:id', (req, res) => {
  vendorService.deleteVendor(req.params.id);
  res.status(204).send();
});
```

`server/src/routes/tasks.routes.ts`:
```ts
import { Router } from 'express';
import { taskCreateSchema, taskUpdateSchema } from '@buttercup/shared/schemas';
import { taskService } from '../services/TaskService';
import { validateBody } from '../middleware/validateBody';

export const tasksRouter = Router();

tasksRouter.get('/', (_req, res) => {
  res.json(taskService.listTasks());
});

tasksRouter.get('/:id', (req, res) => {
  res.json(taskService.getTask(req.params.id));
});

tasksRouter.post('/', validateBody(taskCreateSchema), (req, res) => {
  res.status(201).json(taskService.createTask(req.body));
});

tasksRouter.patch('/:id', validateBody(taskUpdateSchema), (req, res) => {
  res.json(taskService.updateTask(req.params.id, req.body));
});

tasksRouter.delete('/:id', (req, res) => {
  taskService.deleteTask(req.params.id);
  res.status(204).send();
});
```

`server/src/routes/tables.routes.ts`:
```ts
import { Router } from 'express';
import { z } from 'zod';
import { tableCreateSchema, tableUpdateSchema } from '@buttercup/shared/schemas';
import { tableService } from '../services/TableService';
import { validateBody } from '../middleware/validateBody';

export const tablesRouter = Router();

const seatGuestSchema = z.object({ guestId: z.string().min(1) });

tablesRouter.get('/', (_req, res) => {
  res.json(tableService.listTables());
});

tablesRouter.get('/seating-conflicts', (_req, res) => {
  res.json(tableService.detectSeatingConflicts());
});

tablesRouter.get('/:id', (req, res) => {
  res.json(tableService.getTable(req.params.id));
});

tablesRouter.post('/', validateBody(tableCreateSchema), (req, res) => {
  res.status(201).json(tableService.createTable(req.body));
});

tablesRouter.patch('/:id', validateBody(tableUpdateSchema), (req, res) => {
  res.json(tableService.updateTable(req.params.id, req.body));
});

tablesRouter.delete('/:id', (req, res) => {
  tableService.deleteTable(req.params.id);
  res.status(204).send();
});

tablesRouter.post('/:id/seat', validateBody(seatGuestSchema), (req, res) => {
  res.json(tableService.seatGuest(req.params.id, req.body.guestId));
});
```

`server/src/routes/budget.routes.ts`:
```ts
import { Router } from 'express';
import { budgetItemCreateSchema, budgetItemUpdateSchema } from '@buttercup/shared/schemas';
import { budgetService } from '../services/BudgetService';
import { validateBody } from '../middleware/validateBody';

export const budgetRouter = Router();

budgetRouter.get('/', (_req, res) => {
  res.json(budgetService.listItems());
});

budgetRouter.get('/summary', (_req, res) => {
  res.json(budgetService.getSummary());
});

budgetRouter.post('/', validateBody(budgetItemCreateSchema), (req, res) => {
  res.status(201).json(budgetService.createItem(req.body));
});

budgetRouter.patch('/:id', validateBody(budgetItemUpdateSchema), (req, res) => {
  res.json(budgetService.updateItem(req.params.id, req.body));
});

budgetRouter.delete('/:id', (req, res) => {
  budgetService.deleteItem(req.params.id);
  res.status(204).send();
});
```

`server/src/routes/dashboard.routes.ts`:
```ts
import { Router } from 'express';
import { dashboardService } from '../services/DashboardService';

export const dashboardRouter = Router();

dashboardRouter.get('/', (_req, res) => {
  res.json(dashboardService.getSummary());
});
```

`server/src/routes/index.ts`:
```ts
import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { guestsRouter } from './guests.routes';
import { vendorsRouter } from './vendors.routes';
import { tasksRouter } from './tasks.routes';
import { tablesRouter } from './tables.routes';
import { budgetRouter } from './budget.routes';
import { dashboardRouter } from './dashboard.routes';

export const apiRouter = Router();

apiRouter.use(requireAuth);
apiRouter.use('/guests', guestsRouter);
apiRouter.use('/vendors', vendorsRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/tables', tablesRouter);
apiRouter.use('/budget', budgetRouter);
apiRouter.use('/dashboard', dashboardRouter);
```

- [ ] **Step 10: Create `server/src/app.ts`**

```ts
import express, { type Express } from 'express';
import cors from 'cors';
import { apiRouter } from './routes';
import { errorHandler } from './errors/errorHandler';
import { seedDatabase } from './data/seed';

export function createApp(): Express {
  seedDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
}
```

- [ ] **Step 11: Create `server/src/index.ts`**

```ts
import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Buttercup Wedding Planner API listening on http://localhost:${PORT}`);
});
```

- [ ] **Step 12: Typecheck and smoke-test the server**

Run: `npx tsc -p server/tsconfig.json --noEmit`
Expected: no errors. If `@buttercup/shared/types` or `@buttercup/shared/schemas` subpath imports fail to resolve, add matching subpaths to `server/tsconfig.json` `paths` (`"@buttercup/shared/types": ["../shared/src/types/index.ts"]`, `"@buttercup/shared/schemas": ["../shared/src/schemas/index.ts"]`) — do this now and re-run.

Run: `npm run dev -w server` (in background, then stop it)
Expected: logs `Buttercup Wedding Planner API listening on http://localhost:3001` with no crash.

Run: `curl -s http://localhost:3001/api/dashboard` (while dev server running)
Expected: JSON body with `guestCount`, `rsvpStats`, `budgetSummary`, `upcomingTasks`, `recentActivity` keys.

- [ ] **Step 13: Commit**

```bash
git add server/src
git commit -m "Add server repositories, services, routes, seed data, and error handling"
```

---

### Task 4: Add server tests

**Files:**
- Create: `server/vitest.config.ts`
- Create: `server/src/repositories/GuestRepository.test.ts`, `server/src/repositories/TableRepository.test.ts`
- Create: `server/src/services/GuestService.test.ts`, `server/src/services/BudgetService.test.ts`, `server/src/services/TableService.test.ts`

**Interfaces:**
- Consumes: `GuestRepository`, `TableRepository` (Task 3 Step 6), `GuestService`, `BudgetService`, `TableService` (Task 3 Step 8).

- [ ] **Step 1: Create `server/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@buttercup/shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 2: Write `server/src/repositories/GuestRepository.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { GuestRepository } from './GuestRepository';
import type { Guest } from '@buttercup/shared/types';

function buildGuest(overrides: Partial<Guest> = {}): Omit<Guest, 'id'> {
  return {
    firstName: 'Test',
    lastName: 'Guest',
    household: 'Test Household',
    rsvpStatus: 'pending',
    mealPreference: 'standard',
    tableId: null,
    plusOne: false,
    notes: '',
    ...overrides,
  };
}

describe('GuestRepository', () => {
  it('creates a guest with a generated id', () => {
    const repo = new GuestRepository();
    const guest = repo.create(buildGuest({ firstName: 'Westley' }));
    expect(guest.id).toBeTruthy();
    expect(guest.firstName).toBe('Westley');
    expect(repo.findAll()).toHaveLength(1);
  });

  it('updates an existing guest', () => {
    const repo = new GuestRepository();
    const guest = repo.create(buildGuest());
    const updated = repo.update(guest.id, { rsvpStatus: 'attending' });
    expect(updated?.rsvpStatus).toBe('attending');
  });

  it('deletes a guest', () => {
    const repo = new GuestRepository();
    const guest = repo.create(buildGuest());
    expect(repo.delete(guest.id)).toBe(true);
    expect(repo.findAll()).toHaveLength(0);
  });

  it('finds guests seated at a given table', () => {
    const repo = new GuestRepository();
    repo.create(buildGuest({ tableId: 'table-1' }));
    repo.create(buildGuest({ tableId: 'table-2' }));
    expect(repo.findByTable('table-1')).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Write `server/src/repositories/TableRepository.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { TableRepository } from './TableRepository';

describe('TableRepository', () => {
  it('creates and retrieves a table', () => {
    const repo = new TableRepository();
    const table = repo.create({ name: 'Fire Swamp', capacity: 6 });
    expect(repo.findById(table.id)).toEqual(table);
  });

  it('returns undefined for an unknown id', () => {
    const repo = new TableRepository();
    expect(repo.findById('missing')).toBeUndefined();
  });
});
```

- [ ] **Step 4: Write `server/src/services/GuestService.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { GuestRepository } from '../repositories/GuestRepository';
import { GuestService } from './GuestService';

function seededService() {
  const repo = new GuestRepository();
  repo.seed([
    { id: 'g1', firstName: 'Westley', lastName: '', household: 'H1', rsvpStatus: 'attending', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'g2', firstName: 'Buttercup', lastName: '', household: 'H1', rsvpStatus: 'attending', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'g3', firstName: 'Vizzini', lastName: '', household: 'H2', rsvpStatus: 'pending', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
    { id: 'g4', firstName: 'Count', lastName: 'Rugen', household: 'H3', rsvpStatus: 'declined', mealPreference: 'standard', tableId: null, plusOne: false, notes: '' },
  ]);
  return new GuestService(repo);
}

describe('GuestService.getRsvpStats', () => {
  it('tallies rsvp statuses correctly', () => {
    const stats = seededService().getRsvpStats();
    expect(stats).toEqual({ total: 4, attending: 2, declined: 1, pending: 1 });
  });
});

describe('GuestService.listGuests', () => {
  it('filters by search term across first name, last name, and household', () => {
    const results = seededService().listGuests({ search: 'rugen' });
    expect(results).toHaveLength(1);
    expect(results[0].firstName).toBe('Count');
  });

  it('returns every guest when no search term is given', () => {
    expect(seededService().listGuests()).toHaveLength(4);
  });
});
```

- [ ] **Step 5: Write `server/src/services/BudgetService.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { BudgetRepository } from '../repositories/BudgetRepository';
import { BudgetService } from './BudgetService';

describe('BudgetService.getSummary', () => {
  it('computes totals and remaining budget', () => {
    const repo = new BudgetRepository();
    repo.seed([
      { id: 'b1', category: 'Venue', planned: 15000, actual: 15000 },
      { id: 'b2', category: 'Flowers', planned: 2000, actual: 2350 },
    ]);
    const summary = new BudgetService(repo).getSummary();
    expect(summary).toEqual({ totalPlanned: 17000, totalActual: 17350, remaining: -350 });
  });

  it('returns zeros when there are no budget items', () => {
    const summary = new BudgetService(new BudgetRepository()).getSummary();
    expect(summary).toEqual({ totalPlanned: 0, totalActual: 0, remaining: 0 });
  });
});
```

- [ ] **Step 6: Write `server/src/services/TableService.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { GuestRepository } from '../repositories/GuestRepository';
import { TableRepository } from '../repositories/TableRepository';
import { TableService } from './TableService';
import { AppError } from '../errors/AppError';

function buildService() {
  const tables = new TableRepository();
  const guests = new GuestRepository();
  const table = tables.create({ name: 'Miracle Pavilion', capacity: 1 });
  const seatedGuest = guests.create({
    firstName: 'Miracle',
    lastName: 'Max',
    household: 'H',
    rsvpStatus: 'attending',
    mealPreference: 'standard',
    tableId: table.id,
    plusOne: false,
    notes: '',
  });
  const newGuest = guests.create({
    firstName: 'Valerie',
    lastName: '',
    household: 'H',
    rsvpStatus: 'attending',
    mealPreference: 'standard',
    tableId: null,
    plusOne: false,
    notes: '',
  });
  return { service: new TableService(tables, guests), table, seatedGuest, newGuest };
}

describe('TableService.seatGuest', () => {
  it('seats a guest when the table has room', () => {
    const { service, table, newGuest } = buildService();
    // capacity is 1 and already has seatedGuest, so first free a seat by raising capacity
    const roomyTable = { ...table, capacity: 2 };
    const result = service.seatGuest(roomyTable.id, newGuest.id);
    expect(result.tableId).toBe(roomyTable.id);
  });

  it('rejects seating a guest at a table that is already full', () => {
    const { service, table, newGuest } = buildService();
    expect(() => service.seatGuest(table.id, newGuest.id)).toThrow(AppError);
  });
});
```

- [ ] **Step 7: Run server tests**

Run: `npm test -w server`
Expected: all suites pass (8 tests: 4 in GuestRepository, 2 in TableRepository, 3 in GuestService, 2 in BudgetService, 2 in TableService — 13 total). Fix any failures before proceeding.

- [ ] **Step 8: Commit**

```bash
git add server/vitest.config.ts server/src/repositories/GuestRepository.test.ts server/src/repositories/TableRepository.test.ts server/src/services/GuestService.test.ts server/src/services/BudgetService.test.ts server/src/services/TableService.test.ts
git commit -m "Add server tests for repositories and services"
```

---

### Task 5: Add client shell — layout, routing, API client, TanStack Query setup

**Files:**
- Create: `client/vite.config.ts`, `client/vitest.config.ts`, `client/tailwind.config.js`, `client/postcss.config.js`, `client/index.html`
- Create: `client/src/main.tsx`, `client/src/App.tsx`, `client/src/index.css`, `client/src/test/setup.ts`
- Create: `client/src/lib/queryClient.ts`
- Create: `client/src/api/client.ts`
- Create: `client/src/components/Button.tsx`, `client/src/components/Badge.tsx`, `client/src/components/Modal.tsx`, `client/src/components/Input.tsx`, `client/src/components/PageHeader.tsx`, `client/src/components/EmptyState.tsx`
- Create: `client/src/layout/AppLayout.tsx`, `client/src/layout/Sidebar.tsx`

**Interfaces:**
- Produces (consumed by every feature task 6-9):
  - `apiFetch<T>(path: string, options?: RequestInit): Promise<T>` from `api/client.ts` — throws `Error` with server's `error` message on non-2xx.
  - `queryClient` (TanStack `QueryClient` instance) from `lib/queryClient.ts`.
  - `<Button variant="primary"|"secondary"|"danger" ...props>`, `<Badge tone="neutral"|"success"|"warning"|"danger" children>`, `<Modal open onClose title children>`, `<Input label error ...inputProps>`, `<PageHeader title actions?>`, `<EmptyState title description? />`.
  - `<AppLayout>` rendering `<Sidebar>` + `<Outlet />`, mounted once in `App.tsx`.

- [ ] **Step 1: Create `client/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@buttercup/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 2: Create `client/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@buttercup/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.tsx'],
  },
});
```

- [ ] **Step 3: Create `client/tailwind.config.js` and `client/postcss.config.js`**

`client/tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        buttercup: {
          50: '#fefce8',
          100: '#fff9c4',
          400: '#fbe14d',
          500: '#f5d020',
          600: '#d6ab0f',
          700: '#a6820c',
        },
      },
    },
  },
  plugins: [],
};
```

`client/postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Create `client/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Buttercup Wedding Planner</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `client/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: Create `client/src/lib/queryClient.ts`**

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});
```

- [ ] **Step 7: Create `client/src/api/client.ts`**

```ts
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, body.error ?? 'Request failed');
  }

  return body as T;
}
```

- [ ] **Step 8: Create the reusable components**

`client/src/components/Button.tsx`:
```tsx
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-buttercup-500 hover:bg-buttercup-600 text-slate-900',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
```

`client/src/components/Badge.tsx`:
```tsx
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger';

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
```

`client/src/components/Modal.tsx`:
```tsx
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

`client/src/components/Input.tsx`:
```tsx
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="mb-3">
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-md border px-3 py-2 text-sm ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
```

`client/src/components/PageHeader.tsx`:
```tsx
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
```

`client/src/components/EmptyState.tsx`:
```tsx
interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
```

- [ ] **Step 9: Create `client/src/layout/Sidebar.tsx`**

```tsx
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/guests', label: 'Guests' },
  { to: '/tables', label: 'Tables' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/budget', label: 'Budget' },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
      <div className="mb-6 px-2" title="As you wish.">
        <p className="text-lg font-semibold text-slate-900">Buttercup</p>
        <p className="text-xs text-slate-400">Wedding Planner</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-buttercup-100 text-buttercup-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 10: Create `client/src/layout/AppLayout.tsx`**

```tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 11: Create `client/src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './layout/AppLayout';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Dashboard placeholder</div>} />
            <Route path="/guests" element={<div>Guests placeholder</div>} />
            <Route path="/tables" element={<div>Tables placeholder</div>} />
            <Route path="/vendors" element={<div>Vendors placeholder</div>} />
            <Route path="/tasks" element={<div>Tasks placeholder</div>} />
            <Route path="/budget" element={<div>Budget placeholder</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

(Route elements are replaced with real pages in Tasks 6-9; this task only proves the shell renders and routes.)

- [ ] **Step 12: Create `client/src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 13: Create `client/src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 14: Verify the client builds and runs**

Run: `npx tsc -p client/tsconfig.json --noEmit`
Expected: no errors.

Run: `npm run dev -w server` in one terminal (background), `npm run dev -w client` in another (background); then load `http://localhost:5173` in a way you can verify (e.g., `curl -s http://localhost:5173 | head -20`).
Expected: HTML response containing `<div id="root">`; no proxy errors in server terminal when navigating (client has no data calls yet, so this mainly proves both dev servers boot). Stop both background processes after checking.

- [ ] **Step 15: Commit**

```bash
git add client/vite.config.ts client/vitest.config.ts client/tailwind.config.js client/postcss.config.js client/index.html client/src/main.tsx client/src/App.tsx client/src/index.css client/src/test/setup.ts client/src/lib client/src/api/client.ts client/src/components client/src/layout
git commit -m "Add client shell: routing, layout, API client, and design primitives"
```

---

### Task 6: Add Guests feature

**Files:**
- Create: `client/src/api/guestsApi.ts`
- Create: `client/src/features/guests/hooks/useGuests.ts`, `client/src/features/guests/hooks/useGuestMutations.ts`
- Create: `client/src/features/guests/components/RsvpBadge.tsx`, `client/src/features/guests/components/GuestTable.tsx`, `client/src/features/guests/components/GuestFormModal.tsx`
- Create: `client/src/features/guests/GuestsPage.tsx`
- Modify: `client/src/App.tsx` (wire `/guests` route)

**Interfaces:**
- Consumes: `apiFetch` (Task 5), `Guest`/`RsvpStatus`/`MealPreference` types and `guestCreateSchema` (Task 2), `Button`/`Badge`/`Modal`/`Input`/`PageHeader`/`EmptyState` (Task 5).
- Produces: `useGuests(search?: string)` (TanStack `useQuery` returning `Guest[]`), `useCreateGuest()`/`useUpdateGuest()`/`useDeleteGuest()` (TanStack `useMutation`, all invalidate the `['guests']` query key on success), `<RsvpBadge status={guest.rsvpStatus} />`, `<GuestsPage />`.

- [ ] **Step 1: Create `client/src/api/guestsApi.ts`**

```ts
import type { Guest } from '@buttercup/shared/types';
import type { GuestCreateInput, GuestUpdateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export const guestsApi = {
  list(search?: string): Promise<Guest[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiFetch<Guest[]>(`/guests${query}`);
  },
  create(input: GuestCreateInput): Promise<Guest> {
    return apiFetch<Guest>('/guests', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: GuestUpdateInput): Promise<Guest> {
    return apiFetch<Guest>(`/guests/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/guests/${id}`, { method: 'DELETE' });
  },
};
```

- [ ] **Step 2: Create `client/src/features/guests/hooks/useGuests.ts`**

```ts
import { useQuery } from '@tanstack/react-query';
import { guestsApi } from '@/api/guestsApi';

export function useGuests(search?: string) {
  return useQuery({
    queryKey: ['guests', search ?? ''],
    queryFn: () => guestsApi.list(search),
  });
}
```

- [ ] **Step 3: Create `client/src/features/guests/hooks/useGuestMutations.ts`**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GuestCreateInput, GuestUpdateInput } from '@buttercup/shared/schemas';
import { guestsApi } from '@/api/guestsApi';

export function useCreateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GuestCreateInput) => guestsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests'] }),
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GuestUpdateInput }) =>
      guestsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests'] }),
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guestsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guests'] }),
  });
}
```

- [ ] **Step 4: Create `client/src/features/guests/components/RsvpBadge.tsx`**

```tsx
import type { RsvpStatus } from '@buttercup/shared/types';
import { RSVP_STATUS_LABELS } from '@buttercup/shared/constants';
import { Badge } from '@/components/Badge';

const TONE_BY_STATUS: Record<RsvpStatus, 'success' | 'warning' | 'danger'> = {
  attending: 'success',
  pending: 'warning',
  declined: 'danger',
};

interface RsvpBadgeProps {
  status: RsvpStatus;
}

export function RsvpBadge({ status }: RsvpBadgeProps) {
  return <Badge tone={TONE_BY_STATUS[status]}>{RSVP_STATUS_LABELS[status]}</Badge>;
}
```

- [ ] **Step 5: Write the failing test for `RsvpBadge`**

Create `client/src/features/guests/components/RsvpBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RsvpBadge } from './RsvpBadge';

describe('RsvpBadge', () => {
  it('renders the human-readable label for each status', () => {
    render(<RsvpBadge status="attending" />);
    expect(screen.getByText('Attending')).toBeInTheDocument();
  });

  it('renders declined guests distinctly from attending guests', () => {
    render(<RsvpBadge status="declined" />);
    expect(screen.getByText('Declined')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it passes** (component already written in Step 4 — this confirms wiring)

Run: `npm test -w client -- RsvpBadge`
Expected: 2 passed.

- [ ] **Step 7: Create `client/src/features/guests/components/GuestFormModal.tsx`**

```tsx
import { useState } from 'react';
import { guestCreateSchema } from '@buttercup/shared/schemas';
import type { Guest } from '@buttercup/shared/types';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface GuestFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    firstName: string;
    lastName: string;
    household: string;
    notes: string;
  }) => void;
  initialValues?: Partial<Guest>;
}

export function GuestFormModal({ open, onClose, onSubmit, initialValues }: GuestFormModalProps) {
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? '');
  const [lastName, setLastName] = useState(initialValues?.lastName ?? '');
  const [household, setHousehold] = useState(initialValues?.household ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = guestCreateSchema
      .pick({ firstName: true, lastName: true, household: true })
      .safeParse({ firstName, lastName, household });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit({ firstName, lastName, household, notes });
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? 'Edit Guest' : 'Add Guest'}>
      <form onSubmit={handleSubmit}>
        <Input
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
        />
        <Input
          label="Household"
          value={household}
          onChange={(e) => setHousehold(e.target.value)}
          error={errors.household}
        />
        <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
```

- [ ] **Step 8: Write the failing test for `GuestFormModal`**

Create `client/src/features/guests/components/GuestFormModal.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GuestFormModal } from './GuestFormModal';

describe('GuestFormModal', () => {
  it('shows a validation error and does not submit when required fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<GuestFormModal open onClose={() => {}} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed form values when all required fields are filled in', async () => {
    const onSubmit = vi.fn();
    render(<GuestFormModal open onClose={() => {}} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('First name'), 'Fezzik');
    await userEvent.type(screen.getByLabelText('Last name'), 'Giant');
    await userEvent.type(screen.getByLabelText('Household'), 'Wedding Party');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Fezzik', lastName: 'Giant', household: 'Wedding Party' }),
    );
  });
});
```

- [ ] **Step 9: Run the tests**

Run: `npm test -w client -- GuestFormModal`
Expected: 2 passed. If the "required" test fails because the modal isn't visible, confirm `open` prop defaults render (JSX shorthand `open` passes `true`).

- [ ] **Step 10: Create `client/src/features/guests/components/GuestTable.tsx`**

```tsx
import type { Guest } from '@buttercup/shared/types';
import { MEAL_PREFERENCE_LABELS } from '@buttercup/shared/constants';
import { RsvpBadge } from './RsvpBadge';
import { Button } from '@/components/Button';

interface GuestTableProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

export function GuestTable({ guests, onEdit, onDelete }: GuestTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 text-slate-500">
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Household</th>
          <th className="py-2">RSVP</th>
          <th className="py-2">Meal</th>
          <th className="py-2">Plus One</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {guests.map((guest) => (
          <tr key={guest.id} className="border-b border-slate-100">
            <td className="py-2 font-medium text-slate-800">
              {guest.firstName} {guest.lastName}
            </td>
            <td className="py-2 text-slate-600">{guest.household}</td>
            <td className="py-2">
              <RsvpBadge status={guest.rsvpStatus} />
            </td>
            <td className="py-2 text-slate-600">{MEAL_PREFERENCE_LABELS[guest.mealPreference]}</td>
            <td className="py-2 text-slate-600">{guest.plusOne ? 'Yes' : 'No'}</td>
            <td className="py-2 text-right">
              <Button variant="secondary" onClick={() => onEdit(guest)} className="mr-2">
                Edit
              </Button>
              <Button variant="danger" onClick={() => onDelete(guest)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 11: Create `client/src/features/guests/GuestsPage.tsx`**

```tsx
import { useState } from 'react';
import type { Guest } from '@buttercup/shared/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { useGuests } from './hooks/useGuests';
import { useCreateGuest, useDeleteGuest, useUpdateGuest } from './hooks/useGuestMutations';
import { GuestTable } from './components/GuestTable';
import { GuestFormModal } from './components/GuestFormModal';

export function GuestsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const { data: guests, isLoading } = useGuests(search);
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  function handleSubmit(input: { firstName: string; lastName: string; household: string; notes: string }) {
    if (editingGuest) {
      updateGuest.mutate({ id: editingGuest.id, input });
    } else {
      createGuest.mutate(input);
    }
    setModalOpen(false);
    setEditingGuest(null);
  }

  return (
    <div>
      <PageHeader
        title="Guests"
        description="Track RSVPs, meal preferences, and seating."
        actions={
          <>
            {/* TODO: export seating chart to PDF */}
            <Button variant="secondary" disabled title="Coming soon">
              Export
            </Button>
            <Button
              onClick={() => {
                setEditingGuest(null);
                setModalOpen(true);
              }}
            >
              Add Guest
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <Input
          label="Search"
          placeholder="Search by name or household"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {/* TODO: sorting and column filtering are not implemented yet */}
        <select disabled title="Coming soon" className="mt-6 rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-400">
          <option>Sort by name</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading guests…</p>}

      {!isLoading && guests && guests.length === 0 && (
        <EmptyState title="No guests yet" description="Add your first guest to get started." />
      )}

      {!isLoading && guests && guests.length > 0 && (
        <GuestTable
          guests={guests}
          onEdit={(guest) => {
            setEditingGuest(guest);
            setModalOpen(true);
          }}
          onDelete={(guest) => deleteGuest.mutate(guest.id)}
        />
      )}

      <GuestFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGuest(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingGuest ?? undefined}
      />
    </div>
  );
}
```

- [ ] **Step 12: Wire the route in `client/src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './layout/AppLayout';
import { GuestsPage } from './features/guests/GuestsPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Dashboard placeholder</div>} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/tables" element={<div>Tables placeholder</div>} />
            <Route path="/vendors" element={<div>Vendors placeholder</div>} />
            <Route path="/tasks" element={<div>Tasks placeholder</div>} />
            <Route path="/budget" element={<div>Budget placeholder</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 13: Run full client test suite and typecheck**

Run: `npm test -w client`
Expected: all tests pass (4 so far: 2 RsvpBadge + 2 GuestFormModal).

Run: `npx tsc -p client/tsconfig.json --noEmit`
Expected: no errors.

- [ ] **Step 14: Commit**

```bash
git add client/src/api/guestsApi.ts client/src/features/guests client/src/App.tsx
git commit -m "Add Guests feature: list, search, add, edit, delete"
```

---

### Task 7: Add Tables + Vendors features

**Files:**
- Create: `client/src/api/tablesApi.ts`, `client/src/api/vendorsApi.ts`
- Create: `client/src/features/tables/hooks/useTables.ts`, `client/src/features/tables/components/TableCard.tsx`, `client/src/features/tables/components/SeatGuestModal.tsx`, `client/src/features/tables/TablesPage.tsx`
- Create: `client/src/features/vendors/hooks/useVendors.ts`, `client/src/features/vendors/components/VendorCard.tsx`, `client/src/features/vendors/components/VendorFormModal.tsx`, `client/src/features/vendors/VendorsPage.tsx`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Consumes: `apiFetch`, `Table`/`Vendor` types, `tableCreateSchema`/`vendorCreateSchema`, `guestsApi` (Task 6, for the seat-guest picker), `VENDOR_CATEGORY_LABELS`/`VENDOR_STATUS_LABELS` constants.
- Produces: `useTables()`, `useVendors()` query hooks; `<TablesPage />`, `<VendorsPage />`.

- [ ] **Step 1: Create `client/src/api/tablesApi.ts`**

```ts
import type { Guest, Table } from '@buttercup/shared/types';
import { apiFetch } from './client';

export const tablesApi = {
  list(): Promise<Table[]> {
    return apiFetch<Table[]>('/tables');
  },
  seatGuest(tableId: string, guestId: string): Promise<Guest> {
    return apiFetch<Guest>(`/tables/${tableId}/seat`, {
      method: 'POST',
      body: JSON.stringify({ guestId }),
    });
  },
};
```

- [ ] **Step 2: Create `client/src/api/vendorsApi.ts`**

```ts
import type { Vendor } from '@buttercup/shared/types';
import type { VendorCreateInput, VendorUpdateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export const vendorsApi = {
  list(): Promise<Vendor[]> {
    return apiFetch<Vendor[]>('/vendors');
  },
  create(input: VendorCreateInput): Promise<Vendor> {
    return apiFetch<Vendor>('/vendors', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: VendorUpdateInput): Promise<Vendor> {
    return apiFetch<Vendor>(`/vendors/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/vendors/${id}`, { method: 'DELETE' });
  },
};
```

- [ ] **Step 3: Create `client/src/features/tables/hooks/useTables.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '@/api/tablesApi';
import { guestsApi } from '@/api/guestsApi';

export function useTables() {
  return useQuery({ queryKey: ['tables'], queryFn: tablesApi.list });
}

export function useGuestsForSeating() {
  return useQuery({ queryKey: ['guests', ''], queryFn: () => guestsApi.list() });
}

export function useSeatGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, guestId }: { tableId: string; guestId: string }) =>
      tablesApi.seatGuest(tableId, guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
}
```

- [ ] **Step 4: Create `client/src/features/tables/components/SeatGuestModal.tsx`**

```tsx
import { useState } from 'react';
import type { Guest, Table } from '@buttercup/shared/types';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

interface SeatGuestModalProps {
  open: boolean;
  table: Table | null;
  unseatedGuests: Guest[];
  onClose: () => void;
  onSeat: (guestId: string) => void;
  errorMessage?: string;
}

export function SeatGuestModal({
  open,
  table,
  unseatedGuests,
  onClose,
  onSeat,
  errorMessage,
}: SeatGuestModalProps) {
  const [selectedGuestId, setSelectedGuestId] = useState('');

  if (!table) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Seat a guest at ${table.name}`}>
      {unseatedGuests.length === 0 ? (
        <p className="text-sm text-slate-500">Every guest is already seated somewhere.</p>
      ) : (
        <select
          className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={selectedGuestId}
          onChange={(e) => setSelectedGuestId(e.target.value)}
        >
          <option value="">Select a guest…</option>
          {unseatedGuests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.firstName} {guest.lastName}
            </option>
          ))}
        </select>
      )}
      {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!selectedGuestId} onClick={() => onSeat(selectedGuestId)}>
          Seat Guest
        </Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 5: Create `client/src/features/tables/components/TableCard.tsx`**

```tsx
import type { Guest, Table } from '@buttercup/shared/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

interface TableCardProps {
  table: Table;
  seatedGuests: Guest[];
  onSeatGuest: () => void;
}

export function TableCard({ table, seatedGuests, onSeatGuest }: TableCardProps) {
  const isFull = seatedGuests.length >= table.capacity;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{table.name}</h3>
        <Badge tone={isFull ? 'warning' : 'neutral'}>
          {seatedGuests.length} / {table.capacity} seats
        </Badge>
      </div>
      <ul className="mb-3 space-y-1 text-sm text-slate-600">
        {seatedGuests.map((guest) => (
          <li key={guest.id}>
            {guest.firstName} {guest.lastName}
          </li>
        ))}
        {seatedGuests.length === 0 && <li className="text-slate-400">No guests seated yet</li>}
      </ul>
      <Button variant="secondary" onClick={onSeatGuest} disabled={isFull}>
        {isFull ? 'Table Full' : 'Seat Guest'}
      </Button>
    </div>
  );
}
```

- [ ] **Step 6: Create `client/src/features/tables/TablesPage.tsx`**

```tsx
import { useState } from 'react';
import type { Table } from '@buttercup/shared/types';
import { PageHeader } from '@/components/PageHeader';
import { ApiError } from '@/api/client';
import { useTables, useGuestsForSeating, useSeatGuest } from './hooks/useTables';
import { TableCard } from './components/TableCard';
import { SeatGuestModal } from './components/SeatGuestModal';

export function TablesPage() {
  const { data: tables, isLoading } = useTables();
  const { data: guests } = useGuestsForSeating();
  const seatGuest = useSeatGuest();

  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [seatError, setSeatError] = useState<string | undefined>();

  function guestsFor(tableId: string) {
    return (guests ?? []).filter((guest) => guest.tableId === tableId);
  }

  function handleSeat(guestId: string) {
    if (!activeTable) return;
    seatGuest.mutate(
      { tableId: activeTable.id, guestId },
      {
        onSuccess: () => {
          setActiveTable(null);
          setSeatError(undefined);
        },
        onError: (error) => {
          setSeatError(error instanceof ApiError ? error.message : 'Could not seat guest');
        },
      },
    );
  }

  return (
    <div>
      <PageHeader title="Reception Tables" description="Manage seating for the reception." />

      {isLoading && <p className="text-sm text-slate-500">Loading tables…</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables?.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            seatedGuests={guestsFor(table.id)}
            onSeatGuest={() => {
              setActiveTable(table);
              setSeatError(undefined);
            }}
          />
        ))}
      </div>

      <SeatGuestModal
        open={activeTable !== null}
        table={activeTable}
        unseatedGuests={(guests ?? []).filter((guest) => guest.tableId === null)}
        onClose={() => setActiveTable(null)}
        onSeat={handleSeat}
        errorMessage={seatError}
      />
    </div>
  );
}
```

- [ ] **Step 7: Create `client/src/features/vendors/hooks/useVendors.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VendorCreateInput } from '@buttercup/shared/schemas';
import { vendorsApi } from '@/api/vendorsApi';

export function useVendors() {
  return useQuery({ queryKey: ['vendors'], queryFn: vendorsApi.list });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VendorCreateInput) => vendorsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vendorsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}
```

- [ ] **Step 8: Create `client/src/features/vendors/components/VendorCard.tsx`**

```tsx
import type { Vendor } from '@buttercup/shared/types';
import { VENDOR_CATEGORY_LABELS, VENDOR_STATUS_LABELS } from '@buttercup/shared/constants';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

const STATUS_TONE = {
  booked: 'success',
  pending: 'warning',
  contacted: 'neutral',
  declined: 'danger',
} as const;

interface VendorCardProps {
  vendor: Vendor;
  onDelete: () => void;
}

export function VendorCard({ vendor, onDelete }: VendorCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
        <Badge tone={STATUS_TONE[vendor.status]}>{VENDOR_STATUS_LABELS[vendor.status]}</Badge>
      </div>
      <p className="mb-1 text-sm text-slate-500">{VENDOR_CATEGORY_LABELS[vendor.category]}</p>
      <p className="text-sm text-slate-600">{vendor.contactName}</p>
      <p className="text-sm text-slate-600">{vendor.phone}</p>
      <p className="mb-3 text-sm text-slate-600">{vendor.email}</p>
      <p className="mb-3 text-sm text-slate-700">
        Estimated: ${vendor.estimatedCost.toLocaleString()}
        {vendor.actualCost !== null && ` · Actual: $${vendor.actualCost.toLocaleString()}`}
      </p>
      <Button variant="danger" onClick={onDelete}>
        Remove
      </Button>
    </div>
  );
}
```

- [ ] **Step 9: Create `client/src/features/vendors/components/VendorFormModal.tsx`**

```tsx
import { useState } from 'react';
import { vendorCreateSchema } from '@buttercup/shared/schemas';
import type { VendorCategory } from '@buttercup/shared/types';
import { VENDOR_CATEGORY_LABELS } from '@buttercup/shared/constants';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface VendorFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    category: VendorCategory;
    contactName: string;
    phone: string;
    email: string;
    estimatedCost: number;
  }) => void;
}

const CATEGORIES = Object.keys(VENDOR_CATEGORY_LABELS) as VendorCategory[];

export function VendorFormModal({ open, onClose, onSubmit }: VendorFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('caterer');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = vendorCreateSchema.safeParse({
      name,
      category,
      contactName,
      phone,
      email,
      estimatedCost: Number(estimatedCost),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Vendor">
      <form onSubmit={handleSubmit}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as VendorCategory)}
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {VENDOR_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Contact name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          error={errors.contactName}
        />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input
          label="Estimated cost"
          type="number"
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.value)}
          error={errors.estimatedCost}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
```

- [ ] **Step 10: Create `client/src/features/vendors/VendorsPage.tsx`**

```tsx
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { useCreateVendor, useDeleteVendor, useVendors } from './hooks/useVendors';
import { VendorCard } from './components/VendorCard';
import { VendorFormModal } from './components/VendorFormModal';

export function VendorsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: vendors, isLoading } = useVendors();
  const createVendor = useCreateVendor();
  const deleteVendor = useDeleteVendor();

  // TODO: vendor search is case-sensitive — normalize case before matching
  const filtered = (vendors ?? []).filter((vendor) => vendor.name.includes(search));

  return (
    <div>
      <PageHeader
        title="Vendors"
        description="Florists, caterers, music, and photography."
        actions={<Button onClick={() => setModalOpen(true)}>Add Vendor</Button>}
      />

      <Input
        label="Search"
        placeholder="Search vendors by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-xs"
      />

      {isLoading && <p className="text-sm text-slate-500">Loading vendors…</p>}

      {!isLoading && filtered.length === 0 && (
        <EmptyState title="No vendors found" description="Try a different search or add a new vendor." />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} onDelete={() => deleteVendor.mutate(vendor.id)} />
        ))}
      </div>

      <VendorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(input) => {
          createVendor.mutate({ ...input, actualCost: null, status: 'contacted' });
          setModalOpen(false);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 11: Wire routes in `client/src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './layout/AppLayout';
import { GuestsPage } from './features/guests/GuestsPage';
import { TablesPage } from './features/tables/TablesPage';
import { VendorsPage } from './features/vendors/VendorsPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Dashboard placeholder</div>} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/tasks" element={<div>Tasks placeholder</div>} />
            <Route path="/budget" element={<div>Budget placeholder</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 12: Typecheck and run client tests**

Run: `npx tsc -p client/tsconfig.json --noEmit && npm test -w client`
Expected: no type errors; all existing tests still pass (no new tests added this task).

- [ ] **Step 13: Commit**

```bash
git add client/src/api/tablesApi.ts client/src/api/vendorsApi.ts client/src/features/tables client/src/features/vendors client/src/App.tsx
git commit -m "Add Tables and Vendors features"
```

---

### Task 8: Add Tasks + Budget features

**Files:**
- Create: `client/src/api/tasksApi.ts`, `client/src/api/budgetApi.ts`
- Create: `client/src/features/tasks/hooks/useTasks.ts`, `client/src/features/tasks/components/TaskList.tsx`, `client/src/features/tasks/components/TaskFormModal.tsx`, `client/src/features/tasks/TasksPage.tsx`
- Create: `client/src/features/budget/hooks/useBudget.ts`, `client/src/features/budget/components/BudgetTable.tsx`, `client/src/features/budget/BudgetPage.tsx`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Consumes: `apiFetch`, `Task`/`BudgetItem` types, `taskCreateSchema`/`budgetItemCreateSchema`, `TASK_PRIORITY_LABELS`.
- Produces: `useTasks()`, `useBudgetItems()`, `useBudgetSummary()`; `<TasksPage />`, `<BudgetPage />`.

- [ ] **Step 1: Create `client/src/api/tasksApi.ts`**

```ts
import type { Task } from '@buttercup/shared/types';
import type { TaskCreateInput, TaskUpdateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export const tasksApi = {
  list(): Promise<Task[]> {
    return apiFetch<Task[]>('/tasks');
  },
  create(input: TaskCreateInput): Promise<Task> {
    return apiFetch<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: TaskUpdateInput): Promise<Task> {
    return apiFetch<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
  },
};
```

- [ ] **Step 2: Create `client/src/api/budgetApi.ts`**

```ts
import type { BudgetItem } from '@buttercup/shared/types';
import type { BudgetItemCreateInput } from '@buttercup/shared/schemas';
import { apiFetch } from './client';

export interface BudgetSummary {
  totalPlanned: number;
  totalActual: number;
  remaining: number;
}

export const budgetApi = {
  list(): Promise<BudgetItem[]> {
    return apiFetch<BudgetItem[]>('/budget');
  },
  summary(): Promise<BudgetSummary> {
    return apiFetch<BudgetSummary>('/budget/summary');
  },
  create(input: BudgetItemCreateInput): Promise<BudgetItem> {
    return apiFetch<BudgetItem>('/budget', { method: 'POST', body: JSON.stringify(input) });
  },
};
```

- [ ] **Step 3: Create `client/src/features/tasks/hooks/useTasks.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@buttercup/shared/types';
import type { TaskCreateInput } from '@buttercup/shared/schemas';
import { tasksApi } from '@/api/tasksApi';

export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: tasksApi.list });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskCreateInput) => tasksApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useToggleTaskCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task }: { task: Task }) => tasksApi.update(task.id, { completed: !task.completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
```

- [ ] **Step 4: Create `client/src/features/tasks/components/TaskList.tsx`**

```tsx
import type { Task } from '@buttercup/shared/types';
import { TASK_PRIORITY_LABELS } from '@buttercup/shared/constants';
import { Badge } from '@/components/Badge';

const PRIORITY_TONE = { high: 'danger', medium: 'warning', low: 'neutral' } as const;

interface TaskListProps {
  tasks: Task[];
  onToggleCompleted: (task: Task) => void;
}

export function TaskList({ tasks, onToggleCompleted }: TaskListProps) {
  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-3 p-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompleted(task)}
            className="mt-1"
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {task.title}
              </p>
              <Badge tone={PRIORITY_TONE[task.priority]}>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
            </div>
            {task.description && <p className="text-sm text-slate-500">{task.description}</p>}
            <p className="text-xs text-slate-400">
              Due {task.dueDate}
              {task.assignedTo && ` · ${task.assignedTo}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Create `client/src/features/tasks/components/TaskFormModal.tsx`**

```tsx
import { useState } from 'react';
import { taskCreateSchema } from '@buttercup/shared/schemas';
import type { TaskPriority } from '@buttercup/shared/types';
import { TASK_PRIORITY_LABELS } from '@buttercup/shared/constants';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { title: string; dueDate: string; priority: TaskPriority; assignedTo: string }) => void;
}

const PRIORITIES = Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[];

export function TaskFormModal({ open, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = taskCreateSchema
      .pick({ title: true, dueDate: true, priority: true, assignedTo: true })
      .safeParse({ title, dueDate, priority, assignedTo });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {TASK_PRIORITY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Assigned to"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
```

- [ ] **Step 6: Create `client/src/features/tasks/TasksPage.tsx`**

```tsx
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useCreateTask, useTasks, useToggleTaskCompleted } from './hooks/useTasks';
import { TaskList } from './components/TaskList';
import { TaskFormModal } from './components/TaskFormModal';

export function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const toggleCompleted = useToggleTaskCompleted();

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Wedding planning checklist."
        actions={<Button onClick={() => setModalOpen(true)}>Add Task</Button>}
      />

      {isLoading && <p className="text-sm text-slate-500">Loading tasks…</p>}

      {!isLoading && tasks && tasks.length === 0 && (
        <EmptyState title="No tasks yet" description="Add your first checklist item." />
      )}

      {!isLoading && tasks && tasks.length > 0 && (
        <TaskList tasks={tasks} onToggleCompleted={(task) => toggleCompleted.mutate({ task })} />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(input) => {
          createTask.mutate(input);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 7: Create `client/src/features/budget/hooks/useBudget.ts`**

```ts
import { useQuery } from '@tanstack/react-query';
import { budgetApi } from '@/api/budgetApi';

export function useBudgetItems() {
  return useQuery({ queryKey: ['budget', 'items'], queryFn: budgetApi.list });
}

export function useBudgetSummary() {
  return useQuery({ queryKey: ['budget', 'summary'], queryFn: budgetApi.summary });
}
```

- [ ] **Step 8: Create `client/src/features/budget/components/BudgetTable.tsx`**

```tsx
import type { BudgetItem } from '@buttercup/shared/types';

interface BudgetTableProps {
  items: BudgetItem[];
}

export function BudgetTable({ items }: BudgetTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 text-slate-500">
        <tr>
          <th className="py-2">Category</th>
          <th className="py-2">Planned</th>
          <th className="py-2">Actual</th>
          <th className="py-2">Difference</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const difference = item.planned - item.actual;
          return (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-2 font-medium text-slate-800">{item.category}</td>
              <td className="py-2 text-slate-600">${item.planned.toLocaleString()}</td>
              <td className="py-2 text-slate-600">${item.actual.toLocaleString()}</td>
              <td className={`py-2 ${difference < 0 ? 'text-red-600' : 'text-green-700'}`}>
                {difference < 0 ? '-' : ''}${Math.abs(difference).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 9: Create `client/src/features/budget/BudgetPage.tsx`**

```tsx
import { PageHeader } from '@/components/PageHeader';
import { useBudgetItems, useBudgetSummary } from './hooks/useBudget';
import { BudgetTable } from './components/BudgetTable';

export function BudgetPage() {
  const { data: items, isLoading } = useBudgetItems();
  const { data: summary } = useBudgetSummary();

  return (
    <div>
      <PageHeader title="Budget" description="Planned vs. actual wedding spend." />

      {summary && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Planned</p>
            <p className="text-xl font-semibold text-slate-900">${summary.totalPlanned.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Actual</p>
            <p className="text-xl font-semibold text-slate-900">${summary.totalActual.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className={`text-xl font-semibold ${summary.remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
              ${summary.remaining.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {isLoading && <p className="text-sm text-slate-500">Loading budget…</p>}

      {!isLoading && items && <BudgetTable items={items} />}
    </div>
  );
}
```

- [ ] **Step 10: Wire routes in `client/src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './layout/AppLayout';
import { GuestsPage } from './features/guests/GuestsPage';
import { TablesPage } from './features/tables/TablesPage';
import { VendorsPage } from './features/vendors/VendorsPage';
import { TasksPage } from './features/tasks/TasksPage';
import { BudgetPage } from './features/budget/BudgetPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Dashboard placeholder</div>} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 11: Typecheck and run client tests**

Run: `npx tsc -p client/tsconfig.json --noEmit && npm test -w client`
Expected: no type errors; all existing tests still pass.

- [ ] **Step 12: Commit**

```bash
git add client/src/api/tasksApi.ts client/src/api/budgetApi.ts client/src/features/tasks client/src/features/budget client/src/App.tsx
git commit -m "Add Tasks and Budget features"
```

---

### Task 9: Add Dashboard + finish client test suite

**Files:**
- Create: `client/src/api/dashboardApi.ts`
- Create: `client/src/features/dashboard/hooks/useDashboard.ts`, `client/src/features/dashboard/components/StatCard.tsx`, `client/src/features/dashboard/components/RecentActivity.tsx`, `client/src/features/dashboard/DashboardPage.tsx`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Consumes: `apiFetch`, `DashboardSummary` shape from server (Task 3): `{ guestCount, rsvpStats, budgetSummary, upcomingTasks, recentActivity }`.
- Produces: `useDashboard()`; `<DashboardPage />` mounted at `/`.

- [ ] **Step 1: Create `client/src/api/dashboardApi.ts`**

```ts
import type { Task } from '@buttercup/shared/types';
import { apiFetch } from './client';
import type { BudgetSummary } from './budgetApi';

export interface RsvpStats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
}

export interface RecentActivityItem {
  id: string;
  message: string;
}

export interface DashboardSummary {
  guestCount: number;
  rsvpStats: RsvpStats;
  budgetSummary: BudgetSummary;
  upcomingTasks: Task[];
  recentActivity: RecentActivityItem[];
}

export const dashboardApi = {
  summary(): Promise<DashboardSummary> {
    return apiFetch<DashboardSummary>('/dashboard');
  },
};
```

- [ ] **Step 2: Create `client/src/features/dashboard/hooks/useDashboard.ts`**

```ts
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboardApi';

export function useDashboard() {
  return useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.summary });
}
```

- [ ] **Step 3: Create `client/src/features/dashboard/components/StatCard.tsx`**

```tsx
interface StatCardProps {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'negative';
}

const TONE_CLASSES = {
  default: 'text-slate-900',
  positive: 'text-green-700',
  negative: 'text-red-600',
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</p>
    </div>
  );
}
```

- [ ] **Step 4: Create `client/src/features/dashboard/components/RecentActivity.tsx`**

```tsx
import type { RecentActivityItem } from '@/api/dashboardApi';
import { EmptyState } from '@/components/EmptyState';

interface RecentActivityProps {
  items: RecentActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return <EmptyState title="No recent activity" description="Completed tasks will show up here." />;
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="p-3 text-sm text-slate-700">
          {item.message}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Create `client/src/features/dashboard/DashboardPage.tsx`**

```tsx
import { PageHeader } from '@/components/PageHeader';
import { useDashboard } from './hooks/useDashboard';
import { StatCard } from './components/StatCard';
import { RecentActivity } from './components/RecentActivity';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Your wedding, at a glance." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Guests" value={String(data.guestCount)} />
        <StatCard label="Attending" value={String(data.rsvpStats.attending)} tone="positive" />
        <StatCard label="Pending RSVPs" value={String(data.rsvpStats.pending)} />
        <StatCard
          label="Budget Remaining"
          value={`$${data.budgetSummary.remaining.toLocaleString()}`}
          tone={data.budgetSummary.remaining < 0 ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Upcoming Tasks</h2>
          {data.upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing due — you've thought of everything.</p>
          ) : (
            <ul className="space-y-2">
              {data.upcomingTasks.map((task) => (
                <li key={task.id} className="rounded-md border border-slate-200 bg-white p-3 text-sm">
                  <span className="font-medium text-slate-800">{task.title}</span>
                  <span className="ml-2 text-slate-400">due {task.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Recent Activity</h2>
          <RecentActivity items={data.recentActivity} />
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Wire the route in `client/src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './layout/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { GuestsPage } from './features/guests/GuestsPage';
import { TablesPage } from './features/tables/TablesPage';
import { VendorsPage } from './features/vendors/VendorsPage';
import { TasksPage } from './features/tasks/TasksPage';
import { BudgetPage } from './features/budget/BudgetPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 7: Full-stack manual smoke test**

Run: `npm run dev` (background)
Expected: both `server` and `client` boot without errors.

Run (after a couple seconds for boot): `curl -s http://localhost:3001/api/dashboard | head -c 300`
Expected: JSON with `guestCount`, `rsvpStats`, `budgetSummary`, `upcomingTasks`, `recentActivity`.

Run: `curl -s http://localhost:5173/ | grep -o '<div id="root">'`
Expected: match found (client is serving).

Stop the background `npm run dev` process.

- [ ] **Step 8: Run full test suite and typecheck across the repo**

Run: `npm test`
Expected: all server and client tests pass (server ~13, client ~4).

Run: `npx tsc -p server/tsconfig.json --noEmit && npx tsc -p client/tsconfig.json --noEmit && npx tsc -p shared/tsconfig.json --noEmit`
Expected: no errors in any package.

- [ ] **Step 9: Commit**

```bash
git add client/src/api/dashboardApi.ts client/src/features/dashboard client/src/App.tsx
git commit -m "Add Dashboard feature and wire full client routing"
```

---

### Task 10: Add README and `/docs/issues.md`

**Files:**
- Create: `README.md`
- Create: `docs/issues.md`

**Interfaces:**
- Consumes: nothing programmatically — pure documentation reflecting the app built in Tasks 1-9 and the TODOs left in code (guest search optimization, dietary restrictions, vendor invoices, pagination/sorting/filtering, export, seating conflict detection, auth, notifications, SQLite migration).

- [ ] **Step 1: Write `README.md`**

```md
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
```

- [ ] **Step 2: Write `docs/issues.md`**

Write the file with the exact structure below (30 issues, each with title, tag, and 1-3 sentence description). Use this content:

```md
# Issue Backlog

A running list of feature requests, bugs, refactors, and technical debt for Buttercup Wedding Planner. Mirrors the TODOs left in the codebase.

## Feature Requests

1. **Add dietary restrictions to guest profiles** `enhancement`
   Guests currently have a single `mealPreference` enum. Replace or extend with a free-form dietary restrictions field (allergies, kosher, halal, etc.) — see `TODO: support dietary restrictions` in `shared/src/types/guest.ts`.

2. **Improve seating optimization algorithm** `enhancement`
   `TableService.detectSeatingConflicts()` currently returns an empty array. Implement real conflict detection — e.g., flag households split across tables or known feuds (Prince Humperdinck's party seated near Westley's).

3. **Export seating chart to PDF** `enhancement`
   The Export button on the Guests page is currently disabled. Wire it up to generate a printable seating chart / guest list PDF.

4. **Add wedding timeline / day-of schedule page** `enhancement`
   Add a new page for the wedding-day timeline (ceremony, cocktail hour, reception, etc.), separate from the planning task checklist.

5. **Email RSVP reminders** `enhancement`
   `NotificationService.sendRsvpReminder()` currently only logs to the console. Integrate a real email provider and trigger reminders for guests with `rsvpStatus: 'pending'`.

6. **Add authentication** `enhancement`
   `requireAuth` middleware is a no-op stub. Add real login (even a simple single-user password gate) before this app leaves demo status.

7. **Add audit logging** `enhancement`
   There is no record of who changed what. Add an audit log for guest/vendor/task/budget mutations, surfaced somewhere in the UI.

8. **Implement pagination on list endpoints** `enhancement`
   `GET /api/guests`, `/api/vendors`, `/api/tasks` accept `page` query params but ignore them. Implement real pagination and update the client to page through results.

9. **Implement sorting on list endpoints** `enhancement`
   Similarly, `sort` query params are parsed but unused. Add sorting (by name, due date, cost, etc.) on the server and wire up the disabled "Sort by name" control on the Guests page.

10. **Implement filtering on list endpoints** `enhancement`
    Vendor and task filtering by category/status/priority isn't implemented server-side. Add filter query params and corresponding UI controls.

11. **Add vendor invoices** `enhancement`
    Vendors track `estimatedCost`/`actualCost` but there's no invoice tracking. Add an invoices sub-resource with line items, due dates, and paid status.

12. **Add a guest detail page** `enhancement`
    Currently guests are only editable via a modal from the list. A dedicated `/guests/:id` page would give room for a longer notes field, RSVP history, and household grouping.

13. **Support household-level RSVP** `enhancement`
    Guests in the same household currently RSVP independently. Consider letting one household member RSVP for the whole household at once.

14. **Add a budget category breakdown chart** `enhancement`
    The Budget page is table-only. Add a simple chart (bar or pie) visualizing planned vs. actual by category.

15. **Add vendor contract file uploads** `enhancement`
    There's no way to attach a signed contract or quote to a vendor record. Add file upload support (even just a URL field to start).

## Bugs

16. **Fix duplicate RSVP bug** `bug`
    Rapidly double-submitting the guest RSVP update can create a race where two PATCH requests reorder unexpectedly against the in-memory array. Add request de-duplication or optimistic UI locking.

17. **Vendor search is case sensitive** `bug`
    `VendorsPage` filters vendors with `vendor.name.includes(search)`, which is case-sensitive. Normalize both sides to lowercase before comparing.

18. **Table capacity validation doesn't account for pending plus-ones** `bug`
    `TableService.seatGuest` counts seated guests but not their `plusOne` flag, so a table can end up over its physical capacity when plus-ones are added later.

19. **Guest search doesn't trim whitespace** `bug`
    A trailing space in the guest search box (`"Buttercup "`) returns no results because the search term isn't trimmed before matching.

20. **Deleting a seated guest doesn't free their table seat visually until refetch** `bug`
    After deleting a guest via the Guests page, the Tables page (if open in another tab) won't reflect the freed seat until its query is invalidated too.

21. **Budget remaining doesn't handle items with `actual` greater than `planned` clearly in the UI** `bug`
    Over-budget categories show a red negative number but there's no way to see the app's overall budget health at a glance without opening the Budget page.

## Refactoring / Technical Debt

22. **Replace mock repository with SQLite** `tech-debt`
    All five repositories are in-memory arrays that reset on server restart. Introduce a real SQLite-backed repository implementation behind the existing `IRepository<T>` interface.

23. **Optimize guest search** `tech-debt`
    `GuestService.listGuests` does a linear scan with a template-string `includes()` check. Fine at demo scale; revisit if guest lists grow — see `TODO: optimize guest search`.

24. **Extract a shared form-validation hook** `tech-debt`
    `GuestFormModal`, `VendorFormModal`, and `TaskFormModal` each hand-roll the same "safeParse, map ZodError issues to field errors" logic. Extract a `useZodForm` hook to remove the duplication.

25. **Add request logging middleware** `tech-debt`
    The Express app has no request logging. Add `morgan` or similar for basic observability, especially useful once real users hit the API.

26. **Type the dashboard aggregate response explicitly on the server** `tech-debt`
    `DashboardService.getSummary()`'s return type is currently inferred via `ReturnType<...>` chaining. Define an explicit `DashboardSummary` interface in `shared/` so client and server share one contract instead of the client re-declaring it in `api/dashboardApi.ts`.

27. **Consolidate Tailwind color tokens** `tech-debt`
    Status colors (RSVP badges, vendor status, task priority) are hand-mapped to Tailwind classes in three different files. Centralize into a single tone → class lookup shared across features.

28. **Add integration tests for API routes** `tech-debt`
    Current server tests cover repositories and services directly. Add `supertest`-based route tests to catch regressions in request validation, status codes, and error-handler behavior.

## Accessibility & Polish

29. **Improve accessibility** `enhancement`
    Modals don't trap focus or restore focus to the triggering element on close, and several icon-only buttons (like the modal close button) rely on a single `aria-label`. Run an accessibility audit and address focus management, color contrast, and keyboard navigation.

30. **Add empty/loading/error states consistently across all pages** `enhancement`
    Loading and empty states exist on most pages but error states (failed fetch) are not handled consistently — some pages will show a blank screen if the API call fails. Standardize on a shared error banner component.
```

- [ ] **Step 3: Sanity-check the docs render correctly**

Run: `grep -c '^[0-9]*\. \*\*' docs/issues.md`
Expected: `30` (confirms 30 numbered issue entries were written).

- [ ] **Step 4: Commit**

```bash
git add README.md docs/issues.md
git commit -m "Add README and issue backlog documentation"
```

---

## Final Verification

- [ ] Run `npm install` from a clean state (if not already run in Task 1) and confirm no errors.
- [ ] Run `npm test` from the repo root — all server and client tests pass.
- [ ] Run `npm run lint` — no errors (warnings for intentional TODOs/unused fields are acceptable).
- [ ] Run `npm run dev`, confirm `http://localhost:5173` loads the Dashboard, and each nav item (Guests, Tables, Vendors, Tasks, Budget) renders without console errors. Stop the dev servers when done.
- [ ] Confirm `git log --oneline` on `agent/init-buttercup-app` shows 10 commits (Scaffold → Shared → Server core → Server tests → Client shell → Guests → Tables/Vendors → Tasks/Budget → Dashboard → README/docs), reading as staged feature work.
