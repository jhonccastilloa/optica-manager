import type { ReactNode } from "react"
import type { FieldError as ReactHookFormFieldError } from "react-hook-form"

import {
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

type FormFieldMessageProps = {
  description?: ReactNode
  error?: ReactHookFormFieldError
  id: string
}

export function FormFieldMessage({
  description,
  error,
  id,
}: FormFieldMessageProps) {
  return (
    <>
      {description && (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      )}
      <FieldError
        id={`${id}-error`}
        errors={error ? [{ message: error.message }] : undefined}
      />
    </>
  )
}
