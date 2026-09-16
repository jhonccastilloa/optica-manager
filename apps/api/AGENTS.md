# API Guidelines

Run API commands from `apps/api` or use pnpm filters from the monorepo root.

## Module structure

- New business capabilities belong in `src/modules/<domain>/`.
- Follow the current module shape: `<domain>.routes.ts`, `<domain>.controller.ts`, `<domain>.service.ts`, and `<domain>.mapper.ts` when the API contract differs from Prisma persistence.
- Routes wire HTTP paths and controllers. Controllers validate/adapt HTTP input and return responses. Services own business rules and Prisma access.
- Do not pass Express `Request` or `Response` into services, and do not access Prisma from routes or controllers.
- Keep the existing route registration in `src/server.ts` explicit.

## Contracts, validation, and errors

- Use schemas from `@optica/contracts` at the HTTP boundary. Infer types from schemas instead of duplicating DTO interfaces.
- Map allowed input explicitly before persistence; never pass an unfiltered request body directly into Prisma.
- Use `AppError`, shared `ERROR_CODES`, and the global error middleware for client-visible errors. Let Zod and Prisma errors reach the centralized handler.
- API serializers and mappers must preserve the shared contract, including date-only values and Prisma `Decimal` values.

## Prisma

- `prisma/schema.prisma` and its versioned migrations are the database source of truth.
- For schema changes, update the schema, generate a Prisma migration when the database is available, and regenerate the client. Do not use `prisma db push` as the normal workflow.
- Do not edit an already-applied migration. Do not hand-edit generated Prisma client files.
- Evaluate indexes, unique constraints, foreign-key behavior, and transaction needs whenever a domain relation or write flow changes.

## Verification

- Run `pnpm --filter @optica/api typecheck` for TypeScript changes.
- Also run `pnpm --filter @optica/contracts build` whenever a shared contract changes.
