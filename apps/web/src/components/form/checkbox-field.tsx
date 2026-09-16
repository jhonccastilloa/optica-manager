import { useId, type ComponentProps, type ReactNode } from "react"
import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormFieldMessage,
} from "@/components/form/form-field-message"

type CheckboxFieldProps<T extends FieldValues> = Omit<
  ComponentProps<typeof Checkbox>,
  "checked" | "defaultChecked" | "onCheckedChange" | "inputRef" | "name"
> & {
  name: FieldPath<T>
  label: ReactNode
  description?: ReactNode
  fieldClassName?: string
}

export function CheckboxField<T extends FieldValues>({
  name,
  label,
  description,
  fieldClassName,
  id,
  ...props
}: CheckboxFieldProps<T>) {
  const { control } = useFormContext<T>()
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          className={fieldClassName}
          data-invalid={fieldState.invalid}
        >
          <Checkbox
            {...props}
            id={fieldId}
            name={field.name}
            checked={field.value === true}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
          />
          <FieldContent>
            <FieldLabel htmlFor={fieldId}>
              <FieldTitle>{label}</FieldTitle>
            </FieldLabel>
            <FormFieldMessage
              description={description}
              error={fieldState.error}
              id={fieldId}
            />
          </FieldContent>
        </Field>
      )}
    />
  )
}
