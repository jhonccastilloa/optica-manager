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
import { Input } from "@/components/ui/input"
import {
  FormFieldMessage,
} from "@/components/form/form-field-message"

type TextFieldProps<T extends FieldValues> = Omit<
  ComponentProps<typeof Input>,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref"
> & {
  name: FieldPath<T>
  label?: ReactNode
  description?: ReactNode
  fieldClassName?: string
}

export function TextField<T extends FieldValues>({
  name,
  label,
  description,
  fieldClassName,
  id,
  ...props
}: TextFieldProps<T>) {
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
          <Input
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
