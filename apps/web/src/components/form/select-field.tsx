import { useId, type ReactNode } from "react"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormFieldMessage,
} from "@/components/form/form-field-message"

export type SelectOption = {
  value: string
  label: ReactNode
  disabled?: boolean
}

type SelectFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  options: readonly SelectOption[]
  label?: ReactNode
  description?: ReactNode
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
  fieldClassName?: string
  triggerClassName?: string
}

export function SelectField<T extends FieldValues>({
  name,
  options,
  label,
  description,
  placeholder = "Seleccione una opción",
  disabled,
  required,
  id,
  fieldClassName,
  triggerClassName,
}: SelectFieldProps<T>) {
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
          <Select
            value={field.value ?? null}
            onValueChange={(value) => field.onChange(value ?? "")}
            disabled={disabled}
            required={required}
            name={field.name}
            inputRef={field.ref}
          >
            <SelectTrigger
              id={fieldId}
              className={triggerClassName}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
