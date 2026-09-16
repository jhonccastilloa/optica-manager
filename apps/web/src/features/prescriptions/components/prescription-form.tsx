import { zodResolver } from "@hookform/resolvers/zod"
import {
  prescriptionCreateSchema,
  type PatientSummary,
  type Prescription,
  type PrescriptionCreateInput,
} from "@optica/contracts"
import { useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { useBeforeUnload, useBlocker, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormWrapper, SelectField, TextareaField, TextField, applyApiFieldErrors } from "@/components/form"
import { getApiErrorMessage } from "@/api/errors"
import { toast } from "@/components/ui/toast"
import {
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
} from "@/features/prescriptions/hooks/use-prescriptions"
import { PatientSelector } from "./patient-selector"
import { VisionSection } from "./vision-section"
import { ConfirmAlertDialog } from "@/components/dialogs"

type PrescriptionFormProps = {
  prescription?: Prescription
  initialPatient?: PatientSummary
}

const personalizationOptions = [
  { value: "SIGNATURE", label: "Signature" },
  { value: "EYEPRINT", label: "Eyeprint" },
  { value: "FREE_EVOLUTION", label: "FreeEvolution" },
] as const

const frameTypeOptions = [
  { value: "FULL_RIM", label: "Aro completo" },
  { value: "SEMI_RIMLESS", label: "Semi al aire" },
  { value: "RIMLESS", label: "Al aire" },
] as const

const createEmptyEyeMeasurement = () => ({
  sphere: null,
  cylinder: null,
  axis: null,
  dnp: null,
  height: null,
  prism: { value: null, base: null },
})

const getDefaultValues = (
  prescription?: Prescription,
  initialPatient?: PatientSummary,
) =>
  prescription
    ? {
        patientId: prescription.patient.id,
        prescriptionDate: prescription.prescriptionDate,
        far: prescription.far,
        near: prescription.near,
        personalization: prescription.personalization,
        ocularDiagnosis: prescription.ocularDiagnosis,
        refractiveDiagnosis: prescription.refractiveDiagnosis,
        treatment: prescription.treatment,
        observations: prescription.observations,
      }
    : {
        patientId: initialPatient?.id ?? "",
        prescriptionDate: new Date().toISOString().slice(0, 10),
        far: { od: createEmptyEyeMeasurement(), oi: createEmptyEyeMeasurement() },
        near: { od: createEmptyEyeMeasurement(), oi: createEmptyEyeMeasurement() },
        personalization: {
          vertexDistance: null,
          pantoscopicAngle: null,
          panoramicAngle: null,
          type: null,
          frameType: null,
        },
        ocularDiagnosis: null,
        refractiveDiagnosis: null,
        treatment: null,
        observations: null,
      }

export function PrescriptionForm({
  prescription,
  initialPatient,
}: PrescriptionFormProps) {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(prescriptionCreateSchema),
    defaultValues: getDefaultValues(prescription, initialPatient),
  })
  const createMutation = useCreatePrescriptionMutation()
  const updateMutation = useUpdatePrescriptionMutation()
  const isPending = createMutation.isPending || updateMutation.isPending
  const hasSavedRef = useRef(false)
  const shouldBlockNavigation = useCallback(
    () => form.formState.isDirty && !hasSavedRef.current,
    [form.formState.isDirty],
  )
  const blocker = useBlocker(shouldBlockNavigation)

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!shouldBlockNavigation()) return

        event.preventDefault()
        event.returnValue = ""
      },
      [shouldBlockNavigation],
    ),
  )

  const onSubmit = async (values: unknown) => {
    const input = prescriptionCreateSchema.parse(values) as PrescriptionCreateInput

    try {
      const savedPrescription = prescription
        ? await updateMutation.mutateAsync({ id: prescription.id, input })
        : await createMutation.mutateAsync(input)

      toast.add({
        title: prescription ? "Receta actualizada" : "Receta registrada",
        description: `Receta #${String(savedPrescription.number).padStart(6, "0")}`,
        type: "success",
      })
      hasSavedRef.current = true
      navigate(`/prescriptions/${savedPrescription.id}`)
    } catch (error) {
      if (!applyApiFieldErrors(error, form.setError)) {
        form.setError("root.server", { message: getApiErrorMessage(error) })
      }
    }
  }

  return (
    <FormWrapper form={form} onSubmit={onSubmit} className="gap-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Paciente</CardTitle>
          <CardDescription>Busca un paciente existente o regístralo sin salir de la receta.</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientSelector initialPatient={prescription?.patient ?? initialPatient} />
          {form.formState.errors.patientId?.message && (
            <p className="mt-2 text-sm text-destructive" role="alert">{String(form.formState.errors.patientId.message)}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Información de receta</CardTitle></CardHeader>
        <CardContent className="max-w-xs">
          <TextField name="prescriptionDate" label="Fecha de receta" type="date" />
        </CardContent>
      </Card>

      <VisionSection name="far" title="Vista lejana" description="Mediciones para visión a distancia." />
      <VisionSection name="near" title="Vista cercana" description="Mediciones para visión próxima." />

      <Card>
        <CardHeader>
          <CardTitle>Parámetros de personalización</CardTitle>
          <CardDescription>Estos valores se registran manualmente según la medición y la montura.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TextField name="personalization.vertexDistance" label="Distancia de vértice (mm)" inputMode="decimal" />
          <TextField name="personalization.pantoscopicAngle" label="Ángulo pantoscópico (°)" inputMode="decimal" />
          <TextField name="personalization.panoramicAngle" label="Ángulo panorámico (°)" inputMode="decimal" />
          <SelectField name="personalization.type" label="Diseño de personalización" options={personalizationOptions} placeholder="No especificado" />
          <SelectField name="personalization.frameType" label="Tipo de montura" options={frameTypeOptions} placeholder="No especificado" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Diagnóstico y recomendaciones</CardTitle></CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <TextareaField name="ocularDiagnosis" label="Diagnóstico ocular" rows={4} />
          <TextareaField name="refractiveDiagnosis" label="Diagnóstico refractivo" rows={4} />
          <TextareaField name="treatment" label="Tratamiento / recomendaciones" rows={4} fieldClassName="lg:col-span-2" />
          <TextareaField name="observations" label="Observaciones" rows={4} fieldClassName="lg:col-span-2" />
        </CardContent>
      </Card>

      {form.formState.errors.root?.server?.message && (
        <p className="text-sm text-destructive" role="alert">{form.formState.errors.root.server.message}</p>
      )}

      <div className="fixed right-0 bottom-0 left-0 z-20 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:left-[var(--sidebar-width)]">
        <div className="mx-auto flex max-w-6xl flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" disabled={isPending} aria-busy={isPending}>{prescription ? "Guardar cambios" : "Guardar receta"}</Button>
        </div>
      </div>

      <ConfirmAlertDialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (!open && blocker.state === "blocked") blocker.reset()
        }}
        title="¿Descartar los cambios?"
        description="Hay información de la receta que todavía no se ha guardado."
        confirmLabel="Descartar cambios"
        cancelLabel="Seguir editando"
        confirmVariant="destructive"
        onConfirm={() => blocker.proceed?.()}
      />
    </FormWrapper>
  )
}
