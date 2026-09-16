import { Link, useParams, useSearchParams } from "react-router"
import { FileTextIcon, PencilIcon, PlusIcon, UserRoundIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { PatientForm } from "@/features/patients/components/patient-form"
import { usePatientQuery } from "@/features/patients/hooks/use-patients"
import { usePrescriptionsQuery } from "@/features/prescriptions/hooks/use-prescriptions"
import { PrescriptionList } from "@/features/prescriptions/components/prescription-list"
import { closeDialog, openDialog } from "@/utils/dialog"

export default function PatientDetailPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const pageValue = Number(searchParams.get("page"))
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
  const patientQuery = usePatientQuery(id)
  const prescriptionsQuery = usePrescriptionsQuery({
    page,
    pageSize: 20,
    patientId: id,
  })
  const patient = patientQuery.data

  if (patientQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-40 w-full" /><Skeleton className="h-56 w-full" /></div>
  }

  if (patientQuery.isError || !patient) {
    return <Empty><EmptyHeader><EmptyMedia variant="icon"><UserRoundIcon /></EmptyMedia><EmptyTitle>No se encontró el paciente</EmptyTitle><EmptyDescription>El paciente solicitado no existe o no se pudo cargar.</EmptyDescription></EmptyHeader></Empty>
  }

  const patientName = `${patient.firstName} ${patient.lastName}`
  const updatePage = (nextPage: number) => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous)
      if (nextPage <= 1) params.delete("page")
      else params.set("page", String(nextPage))
      return params
    })
  }
  const openEditDialog = () => {
    openDialog({
      title: "Editar paciente",
      description: "Actualiza la información de contacto del paciente.",
      className: "sm:max-w-xl",
      content: <PatientForm patient={patient} onCancel={closeDialog} onSuccess={() => closeDialog()} />,
    })
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Ficha de paciente</p>
          <h1 className="text-2xl font-semibold tracking-tight">{patientName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={openEditDialog}><PencilIcon />Editar</Button>
          <Button render={<Link to={`/prescriptions/new?patientId=${patient.id}`} />}><PlusIcon />Nueva receta</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Información del paciente</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <p><span className="text-muted-foreground">DNI:</span> {patient.dni ?? "No registrado"}</p>
          <p><span className="text-muted-foreground">Celular:</span> {patient.phone ?? "No registrado"}</p>
          <p><span className="text-muted-foreground">Dirección:</span> {patient.address ?? "No registrada"}</p>
          <p className="sm:col-span-2 lg:col-span-3"><span className="text-muted-foreground">Referencia:</span> {patient.reference ?? "No registrada"}</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold">Historial de recetas</h2><p className="text-sm text-muted-foreground">Recetas registradas para este paciente.</p></div></div>

      {prescriptionsQuery.isLoading && <div className="space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>}
      {prescriptionsQuery.isError && <Empty><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>No se pudo cargar el historial</EmptyTitle><EmptyDescription>Inténtalo nuevamente en unos momentos.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => prescriptionsQuery.refetch()}>Reintentar</Button></EmptyContent></Empty>}
      {!prescriptionsQuery.isLoading && !prescriptionsQuery.isError && prescriptionsQuery.data?.items.length === 0 && <Empty><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>Este paciente aún no tiene recetas</EmptyTitle><EmptyDescription>Puedes registrar una receta nueva desde esta ficha.</EmptyDescription></EmptyHeader><EmptyContent><Button render={<Link to={`/prescriptions/new?patientId=${patient.id}`} />}><PlusIcon />Nueva receta</Button></EmptyContent></Empty>}
      {prescriptionsQuery.data && prescriptionsQuery.data.items.length > 0 && (
        <>
          <PrescriptionList prescriptions={prescriptionsQuery.data.items} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{prescriptionsQuery.data.pagination.total} receta{prescriptionsQuery.data.pagination.total === 1 ? "" : "s"}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updatePage(page - 1)}>Anterior</Button>
              <Button variant="outline" size="sm" disabled={page >= prescriptionsQuery.data.pagination.totalPages} onClick={() => updatePage(page + 1)}>Siguiente</Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
