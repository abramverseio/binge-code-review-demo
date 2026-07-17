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
