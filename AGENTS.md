# Optica Manager Guidelines

`optica-manager` is a pnpm monorepo for a small optical practice. Keep this file short; detailed cross-cutting rules live in `docs/agent-rules/`.

## Workspace boundaries

- `apps/web`: React, Vite, React Router, TanStack Query, React Hook Form, shadcn/ui, and Zustand for global UI only.
- `apps/api`: Express, TypeScript, Prisma, PostgreSQL, Winston, and centralized errors.
- `packages/contracts`: shared Zod schemas, API contracts, error codes, and types inferred from schemas.
- Do not move code between applications or introduce a dependency across their boundaries without a concrete need.
- Authentication is not part of the V1. Do not add auth, users, roles, or permission infrastructure unless the task explicitly requires it.

## Cross-cutting rules

- `@optica/contracts` is the source of truth for shared request, response, pagination, enum, and error contracts. Update affected contracts, API consumers, React Query hooks, and UI together; see `docs/agent-rules/shared-contracts.md`.
- Keep server state in TanStack Query. Zustand is reserved for global client UI such as theme, loader, and global overlays; see `docs/agent-rules/frontend-state-and-overlays.md`.
- Follow the existing vertical API-module structure and Prisma Migrate workflow; see `docs/agent-rules/prisma-and-api.md`.
- Build forms with the established React Hook Form, Zod, reusable field, and API-field-error patterns; see `docs/agent-rules/forms-errors-and-sensitive-data.md`.
- Prefer focused, domain-specific changes. Do not add layers, generic abstractions, or dependencies before they solve demonstrated duplication or complexity.

## Documentation routing

- Put rules that apply across the monorepo in `docs/agent-rules/`.
- Keep package-specific instructions in the closest package `AGENTS.md`.
- Update an established rule when a cross-application pattern changes; do not document a one-off implementation as a global convention.

## Verification and commits

- Run the narrowest relevant validation first, then the checks in `docs/agent-rules/verification.md` that apply to the touched packages.
- Use Conventional Commit subjects when creating commits.
- Never commit `.env` files, database URLs, patient data, prescription data, generated backups, or machine-specific artifacts.
