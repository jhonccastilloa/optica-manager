# Shared API Contracts

## Source of truth

`packages/contracts` owns the public contract between the API and the web application. Its Zod schemas define request inputs, response payloads, pagination, serialized enums, and public error codes. Types must be inferred from those schemas whenever they describe the same shape.

## Contract-changing work

Treat all of the following as contract changes:

- HTTP method, path, route parameter, query parameter, or request body.
- Response shape, field name, type, optionality, nullability, date serialization, or enum value.
- Pagination, filtering, ordering, totals, and lookup result shape.
- Error status, error code, error body, or field-level validation path.

For a contract change, complete the affected work in the same task:

1. Update the Zod schema and inferred types in `@optica/contracts`.
2. Update API validation, controller/service input mapping, and response mapper.
3. Update the Axios service, query hook/query keys, mutations, and invalidations when applicable.
4. Update every form, list, detail page, and field-error mapping that consumes the contract.
5. Build contracts and run the relevant API and web checks.

Do not leave a known frontend consumer expecting an obsolete shape. Do not duplicate a contract in a local interface only to avoid updating the shared schema.

## Contract design

- Keep transport contracts oriented to the domain even when Prisma persistence is flatter; map between them in the API mapper/service layer.
- Use explicit serialized formats. A PostgreSQL `DATE` is a date-only string (`YYYY-MM-DD`), not a timestamp requiring timezone conversion.
- For lookup endpoints, return only the fields needed to select or display an entity.
- Keep public errors compatible with `apiErrorResponseSchema` and field validation paths compatible with React Hook Form.
- Prefer additive, backward-compatible changes when consumers cannot be updated atomically. This monorepo normally allows an atomic cross-package update.
