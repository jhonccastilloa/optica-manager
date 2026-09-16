# Frontend State and Overlays

## State ownership

Each value has one authoritative owner:

| State | Owner |
| --- | --- |
| API data, caching, loading, errors, mutations, invalidation | TanStack React Query |
| Theme, global loader, global dialog/drawer/alert coordination | Zustand |
| Field values, unsaved drafts, temporary selection, local interaction | Component or React Hook Form state |
| Navigation-persistent page, filter, sort, tab, or selected resource | URL path or search parameters |
| Derived values | Compute from the owner; do not store again |

Do not mirror a React Query response into Zustand or component state merely to render, sort, or filter it. A form draft may initialize from query data, but subsequent synchronization must not overwrite user edits unexpectedly.

## React Query

- Keep query-key factories with their module features.
- Include every server parameter that changes a result in the query key.
- Perform writes through mutations and invalidate or update the narrowest affected cache keys after success.
- Do not use global invalidation when module-specific invalidation restores correctness.
- Never use Zustand for API lists, API details, mutation state, or server errors.

## Overlays and request feedback

- Use the existing global `Dialog`, `Drawer`, and `AlertDialog` orchestration for shared or cross-component overlay flows.
- Dialogs suit compact, focused tasks. Drawers suit secondary workflows that need more room. Use route pages for primary workflows with substantial forms, such as a prescription.
- A close guard blocks dismissing an overlay during a mutation; a route form uses its navigation/refresh guard for unsaved changes. Do not bypass these protections accidentally.
- Axios owns global request counting and automatic error toasts. Pass `skipGlobalLoader` or `skipErrorToast` only for a deliberate UX reason.
