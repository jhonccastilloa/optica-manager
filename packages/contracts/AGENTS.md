# Shared Contracts Guidelines

`@optica/contracts` is the public boundary shared by `apps/api` and `apps/web`.

- Define shared request, response, pagination, enum, and error schemas with Zod in `src/`.
- Derive TypeScript types with `z.infer`; do not duplicate schema-shaped interfaces.
- Preserve `src/index.ts` as the intentional public package entrypoint. It is not an application barrel file to remove.
- Keep client-visible error codes in `src/errors.ts` and use them from both applications.
- Treat changes to field names, optionality, nullability, serialized dates, enums, pagination, and error shapes as API contract changes.
- When a contract changes, update its API validation and serialization, frontend service and React Query consumer, and every affected form or screen in the same task.
- Run `pnpm --filter @optica/contracts build` after every contract change.
