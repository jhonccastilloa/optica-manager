import { useId, type ComponentProps, type ReactNode } from "react"
import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  FormFieldMessage,
} from "@/components/form/form-field-message"

type TextareaFieldProps<T extends FieldValues> = Omit<
  ComponentProps<typeof Textarea>,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref"
> & {
  name: FieldPath<T>
  label?: ReactNode
  description?: ReactNode
  fieldClassName?: string
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  description,
  fieldClassName,
  id,
  ...props
}: TextareaFieldProps<T>) {
  const { control } = useFormContext<T>()
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          className={fieldClassName}
          data-invalid={fieldState.invalid}
        >
          {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
          <Textarea
            {...props}
            {...field}
            id={fieldId}
            value={field.value ?? ""}
          />
          <FormFieldMessage
            description={description}
            error={fieldState.error}
            id={fieldId}
          />
        </Field>
      )}
    />
  )
}
