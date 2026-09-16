import { zodResolver } from "@hookform/resolvers/zod"
import {
  patientCreateSchema,
  type Patient,
  type PatientCreateInput,
} from "@optica/contracts"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { TextareaField, TextField, FormWrapper, applyApiFieldErrors } from "@/components/form"
import { getApiErrorMessage } from "@/api/errors"
import { toast } from "@/components/ui/toast"
import {
  useCreatePatientMutation,
  useUpdatePatientMutation,
} from "@/features/patients/hooks/use-patients"
import { useDialogCloseGuard } from "@/hooks/use-dialog-close-guard"

type PatientFormProps = {
  patient?: Patient
  onSuccess?: (patient: Patient) => void
  onCancel?: () => void
}

export function PatientForm({ patient, onSuccess, onCancel }: PatientFormProps) {
  const form = useForm({
    resolver: zodResolver(patientCreateSchema),
    defaultValues: {
      firstName: patient?.firstName ?? "",
      lastName: patient?.lastName ?? "",
      dni: patient?.dni ?? "",
      phone: patient?.phone ?? "",
      address: patient?.address ?? "",
      reference: patient?.reference ?? "",
    },
  })
  const createMutation = useCreatePatientMutation()
  const updateMutation = useUpdatePatientMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  useDialogCloseGuard(isPending)

  const onSubmit = async (values: unknown) => {
    const input = patientCreateSchema.parse(values) as PatientCreateInput

    try {
      const savedPatient = patient
        ? await updateMutation.mutateAsync({ id: patient.id, input })
        : await createMutation.mutateAsync(input)

      toast.add({
        title: patient ? "Paciente actualizado" : "Paciente registrado",
        description: `${savedPatient.firstName} ${savedPatient.lastName}`,
        type: "success",
      })
      onSuccess?.(savedPatient)
    } catch (error) {
      if (!applyApiFieldErrors(error, form.setError)) {
        form.setError("root.server", { message: getApiErrorMessage(error) })
      }
    }
  }

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="firstName" label="Nombres" autoComplete="given-name" />
        <TextField name="lastName" label="Apellidos" autoComplete="family-name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="dni"
          label="DNI"
          inputMode="numeric"
          maxLength={8}
          autoComplete="off"
        />
        <TextField
          name="phone"
          label="Celular"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>
      <TextareaField name="address" label="Dirección" rows={2} />
      <TextareaField name="reference" label="Referencia" rows={2} />

      {form.formState.errors.root?.server?.message && (
        <p className="text-sm text-destructive" role="alert">
          {form.formState.errors.root.server.message}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {patient ? "Guardar cambios" : "Registrar paciente"}
        </Button>
      </div>
    </FormWrapper>
  )
}
