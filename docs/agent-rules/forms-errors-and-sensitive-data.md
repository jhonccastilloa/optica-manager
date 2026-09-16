# Forms, Errors, and Sensitive Data

## Forms

New forms use the established stack:

1. A Zod schema from `@optica/contracts`.
2. React Hook Form with `zodResolver`.
3. `FormWrapper` and reusable field components from `src/components/form` when suitable.
4. `applyApiFieldErrors` to map API `VALIDATION_ERROR` field paths into React Hook Form errors.
5. A React Query mutation for submission and module-specific cache invalidation on success.

Keep client validation focused on format and immediate user feedback. Backend validation and business rules remain authoritative. Do not convert server validation errors into generic toasts when they can be shown beside the affected field.

## Error behavior

- The Axios client normalizes API errors and displays a toast for unexpected failures.
- Validation errors are normally handled by the form and should use the shared public error contract.
- Preserve request IDs from API responses in diagnostics when available, but do not surface internals to end users.

## Sensitive data

Patient and prescription data is sensitive. Do not add logging, analytics, screenshots, fixtures, examples, or commits that include real names, DNI values, phones, addresses, clinical measurements, prescriptions, tokens, environment values, or database URLs.

Use clearly fictional data for development examples and tests. Keep server logs useful without recording raw request bodies or clinical details unless an explicit, reviewed operational requirement exists.
