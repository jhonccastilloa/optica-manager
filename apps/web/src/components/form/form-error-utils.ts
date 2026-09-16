import type {
  FieldPath,
  FieldValues,
  UseFormSetError,
} from "react-hook-form"

import { getApiFieldErrors } from "@/api/errors"

export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  const fieldErrors = getApiFieldErrors(error)

  fieldErrors.forEach((fieldError) => {
    const fieldPath = fieldError.path.join(".") as FieldPath<T>

    setError(fieldPath, {
      type: fieldError.code ?? "server",
      message: fieldError.message,
    })
  })

  return fieldErrors.length > 0
}
