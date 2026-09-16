import { useDeferredValue } from "react"
import { useSearchParams } from "react-router"
import { PlusIcon, SearchIcon, UsersIcon } from "lucide-react"
import type { Patient } from "@optica/contracts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { PatientForm } from "@/features/patients/components/patient-form"
import { PatientList } from "@/features/patients/components/patient-list"
import { usePatientsQuery } from "@/features/patients/hooks/use-patients"
import { closeDialog, openDialog } from "@/utils/dialog"

const pageSize = 20

const getPage = (value: string | null) => {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export default function PatientsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") ?? ""
  const page = getPage(searchParams.get("page"))
  const deferredQuery = useDeferredValue(q)
  const patientsQuery = usePatientsQuery({
    page,
    pageSize,
    q: deferredQuery || undefined,
  })

  const updateSearchParams = (next: { q?: string; page?: number }) => {
    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous)

        if (next.q === undefined || next.q === "") params.delete("q")
        else params.set("q", next.q)

        if (next.page === undefined || next.page === 1) params.delete("page")
        else params.set("page", String(next.page))

        return params
      },
      { replace: true },
    )
  }

  const openPatientDialog = (patient?: Patient) => {
    openDialog({
      title: patient ? "Editar paciente" : "Nuevo paciente",
      description: patient
        ? "Actualiza la información de contacto del paciente."
        : "Registra los datos del paciente para asociar sus recetas.",
      content: (
        <PatientForm
          patient={patient}
          onCancel={closeDialog}
          onSuccess={() => closeDialog()}
        />
      ),
      className: "sm:max-w-xl",
    })
  }

  const data = patientsQuery.data

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gestiona la información y el historial de tus pacientes.</p>
        </div>
        <Button onClick={() => openPatientDialog()}>
          <PlusIcon />
          Nuevo paciente
        </Button>
      </div>

      <div className="relative max-w-lg">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(event) => updateSearchParams({ q: event.target.value, page: 1 })}
          className="pl-9"
          placeholder="Buscar por nombre, DNI o celular..."
          aria-label="Buscar pacientes"
        />
      </div>

      {patientsQuery.isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {patientsQuery.isError && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><UsersIcon /></EmptyMedia>
            <EmptyTitle>No se pudieron cargar los pacientes</EmptyTitle>
            <EmptyDescription>Verifica la conexión con la API e inténtalo nuevamente.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button variant="outline" onClick={() => patientsQuery.refetch()}>Reintentar</Button></EmptyContent>
        </Empty>
      )}

      {!patientsQuery.isLoading && !patientsQuery.isError && data?.items.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><UsersIcon /></EmptyMedia>
            <EmptyTitle>{q ? "No encontramos pacientes" : "Aún no hay pacientes"}</EmptyTitle>
            <EmptyDescription>{q ? "Prueba con otro nombre, DNI o celular." : "Registra el primer paciente para empezar a digitalizar recetas."}</EmptyDescription>
          </EmptyHeader>
          {!q && <EmptyContent><Button onClick={() => openPatientDialog()}><PlusIcon />Nuevo paciente</Button></EmptyContent>}
        </Empty>
      )}

      {data && data.items.length > 0 && (
        <>
          <PatientList patients={data.items} onEdit={openPatientDialog} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{data.pagination.total} paciente{data.pagination.total === 1 ? "" : "s"}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateSearchParams({ q, page: page - 1 })}>Anterior</Button>
              <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => updateSearchParams({ q, page: page + 1 })}>Siguiente</Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
