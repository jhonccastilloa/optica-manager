import type {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"
import { FormProvider } from "react-hook-form"

import { cn } from "@/lib/utils"

type FormWrapperProps<T extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> & {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  onError?: SubmitErrorHandler<T>
}

export function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  onError,
  className,
  ...props
}: FormWrapperProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        {...props}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={cn("flex flex-col gap-5", className)}
      />
    </FormProvider>
  )
}
