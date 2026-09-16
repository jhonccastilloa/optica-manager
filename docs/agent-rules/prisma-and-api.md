# Prisma and API Boundaries

## API modules

Create new business capabilities as vertical modules in `apps/api/src/modules/<domain>/` using only the files that the feature needs. The current baseline is routes, controller, service, and mapper.

- Routes wire HTTP paths to controllers.
- Controllers parse validated HTTP input and translate results into HTTP responses.
- Services own business rules, persistence access, relation checks, and transactions.
- Mappers translate between Prisma records and shared API contracts when their shapes differ.

Do not create repositories, use cases, domain folders, or events by default. Add a layer only when a demonstrated need exists: substantial reuse, non-trivial transaction boundaries, complex domain policy, external integration, or test isolation.

## Input and errors

- Parse request params, query, and body with the relevant shared Zod schemas before calling the service.
- Map only permitted fields into persistence input to avoid mass assignment.
- Use `AppError` and `ERROR_CODES` for expected operational failures. The global middleware normalizes Zod and Prisma errors.
- Do not expose stack traces, database internals, environment values, or sensitive patient information in public errors.

## Prisma workflow

- Update `apps/api/prisma/schema.prisma` first.
- Create a versioned migration through Prisma Migrate when the database is reachable, then regenerate the client.
- Never use `prisma db push` as a replacement for committed migrations.
- Do not change an applied migration; create a new migration for a later schema change.
- Use transactions for writes that must succeed or fail together. Evaluate uniqueness, foreign keys, indexes, and concurrent writes as part of every data-model change.

Prisma `Decimal` values require explicit mapping at the API boundary; clients receive contract-safe serialized values rather than Prisma runtime objects.
