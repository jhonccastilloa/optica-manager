# Web Guidelines

Run web commands from `apps/web` or use pnpm filters from the monorepo root.

## Feature structure and remote state

- Keep HTTP calls in `src/api/<module>/<module>.service.ts`.
- Keep module query keys and TanStack Query hooks in `src/features/<module>/`.
- TanStack Query owns API data, caching, request state, mutations, and invalidation. Do not copy query data into Zustand or local state just to render it.
- Use Zustand only for global UI coordination already established in the project: loader, theme, dialog, drawer, and alert dialog.
- Keep temporary interactions and form drafts local. Use route parameters or search parameters when state must survive reload, navigation, sharing, or browser history.

## UI, overlays, and forms

- Reuse components from `src/components/ui` and the application form helpers before creating a new primitive.
- Use Tailwind semantic tokens and ensure new UI works in both light and dark themes.
- Use the global Dialog, Drawer, and AlertDialog utilities for globally coordinated flows. A route-local confirmation may remain local when it only protects that route's unsaved draft.
- Respect existing close guards when an overlay or mutation must not be dismissed while a request is running.
- Build forms with React Hook Form, Zod schemas from `@optica/contracts`, `FormWrapper`, reusable fields, and `applyApiFieldErrors` for validation responses.
- Keep the Axios global-loader and automatic-error-toast conventions. Use their per-request opt-out flags only when the interaction needs it.

## Routes and responsive behavior

- Register new screens in `src/router/router.tsx` and keep route-level pages under `src/pages/`.
- Prefer tables where cross-column comparison matters; provide a readable card/list presentation on narrow screens when a table would become unusable.
- Every data-driven screen needs loading, empty, error, and actionable states appropriate to the workflow.

## Verification

- Run `pnpm --filter @optica/web lint` and `pnpm --filter @optica/web build` for frontend TypeScript or UI changes.
- Also run `pnpm --filter @optica/contracts build` whenever a shared contract changes.
