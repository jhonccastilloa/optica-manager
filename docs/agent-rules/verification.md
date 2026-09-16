# Verification

Run the narrowest useful verification while iterating, then run the checks relevant to the touched packages before handoff.

## Current commands

```bash
pnpm --filter @optica/contracts build
pnpm --filter @optica/api typecheck
pnpm --filter @optica/web lint
pnpm --filter @optica/web build
```

Run the contracts build whenever shared schemas change. API and web scripts already build contracts before their own build/typecheck steps, but running it directly makes contract failures easier to diagnose.

## Review checklist

- Verify every changed request and response still matches `@optica/contracts`.
- Verify React Query keys include all request inputs and mutations refresh the narrowest correct data.
- Verify forms show field-level validation errors and preserve close/unsaved-change protections where applicable.
- Verify new or changed UI has loading, empty, recoverable error, disabled, and responsive behavior appropriate to the screen.
- Verify light and dark themes when changing shared or visible UI.
- Run `git diff --check` before handoff for non-whitespace-safe changes.

There is no configured automated test suite yet. Do not claim test coverage that does not exist; add focused tests only when the project adopts the required runner and the task warrants it.
