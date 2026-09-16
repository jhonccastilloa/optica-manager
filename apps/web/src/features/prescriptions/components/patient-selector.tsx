import { useDeferredValue, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import type { PatientSummary } from "@optica/contracts"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PatientForm } from "@/features/patients/components/patient-form"
import { usePatientsQuery } from "@/features/patients/hooks/use-patients"
import { closeDialog, openDialog } from "@/utils/dialog"

type PatientSelectorProps = {
  initialPatient?: PatientSummary
}

const patientName = (patient: PatientSummary) =>
  `${patient.firstName} ${patient.lastName}`

export function PatientSelector({ initialPatient }: PatientSelectorProps) {
  const { control, setValue } = useFormContext()
  const patientId = useWatch({ control, name: "patientId" }) as string | undefined
  const [query, setQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | undefined>(
    initialPatient,
  )
  const deferredQuery = useDeferredValue(query.trim())
  const searchQuery = usePatientsQuery(
    { page: 1, pageSize: 8, q: deferredQuery },
    { enabled: deferredQuery.length >= 2 },
  )

  const selectPatient = (patient: PatientSummary) => {
    setValue("patientId", patient.id, { shouldDirty: true, shouldValidate: true })
    setSelectedPatient(patient)
    setQuery("")
  }

  const clearPatient = () => {
    setValue("patientId", "", { shouldDirty: true, shouldValidate: true })
    setSelectedPatient(undefined)
  }

  const openQuickCreate = () => {
    openDialog({
      title: "Registrar paciente",
      description: "Al guardar, quedará seleccionado automáticamente en la receta.",
      className: "sm:max-w-xl",
      content: (
        <PatientForm
          onCancel={closeDialog}
          onSuccess={(patient) => {
            selectPatient(patient)
            closeDialog()
          }}
        />
      ),
    })
  }

  if (patientId && selectedPatient) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{patientName(selectedPatient)}</p>
          <p className="text-sm text-muted-foreground">
            {selectedPatient.dni ? `DNI ${selectedPatient.dni}` : "DNI no registrado"}
            {selectedPatient.phone ? ` · ${selectedPatient.phone}` : ""}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={clearPatient}>
          <XIcon />
          Cambiar paciente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Buscar por nombre, DNI o celular..."
            aria-label="Buscar paciente"
          />
        </div>
        <Button type="button" variant="outline" onClick={openQuickCreate}>
          <PlusIcon />
          Registrar paciente
        </Button>
      </div>

      {deferredQuery.length > 0 && deferredQuery.length < 2 && (
        <p className="text-sm text-muted-foreground">Ingresa al menos 2 caracteres para buscar.</p>
      )}

      {searchQuery.isFetching && <p className="text-sm text-muted-foreground">Buscando pacientes…</p>}

      {!searchQuery.isFetching && deferredQuery.length >= 2 && searchQuery.data?.items.length === 0 && (
        <p className="text-sm text-muted-foreground">No se encontraron pacientes. Puedes registrarlo sin salir de la receta.</p>
      )}

      {searchQuery.data && searchQuery.data.items.length > 0 && (
        <div className="max-h-56 overflow-y-auto rounded-lg border">
          {searchQuery.data.items.map((patient) => (
            <button
              key={patient.id}
              type="button"
              className="flex w-full flex-col gap-0.5 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted"
              onClick={() => selectPatient(patient)}
            >
              <span className="font-medium">{patientName(patient)}</span>
              <span className="text-sm text-muted-foreground">
                {patient.dni ? `DNI ${patient.dni}` : "DNI no registrado"}
                {patient.phone ? ` · ${patient.phone}` : ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
