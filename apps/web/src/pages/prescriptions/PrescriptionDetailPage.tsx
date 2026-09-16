import { Link, useParams } from "react-router"
import { FileTextIcon, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateOnly } from "@/lib/date/dayjs"
import { PrescriptionMeasurements } from "@/features/prescriptions/components/prescription-measurements"
import { usePrescriptionQuery } from "@/features/prescriptions/hooks/use-prescriptions"

const formatNumber = (number: number) => String(number).padStart(6, "0")

const personalizationTypeLabels = {
  SIGNATURE: "Signature",
  EYEPRINT: "Eyeprint",
  FREE_EVOLUTION: "FreeEvolution",
} as const

const frameTypeLabels = {
  FULL_RIM: "Aro completo",
  SEMI_RIMLESS: "Semi al aire",
  RIMLESS: "Al aire",
} as const

export default function PrescriptionDetailPage() {
  const { id } = useParams()
  const prescriptionQuery = usePrescriptionQuery(id)
  const prescription = prescriptionQuery.data

  if (prescriptionQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-40 w-full" /><Skeleton className="h-72 w-full" /></div>
  }

  if (prescriptionQuery.isError || !prescription) {
    return <Empty><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>No se encontró la receta</EmptyTitle><EmptyDescription>La receta solicitada no existe o no se pudo cargar.</EmptyDescription></EmptyHeader></Empty>
  }

  const patientName = `${prescription.patient.firstName} ${prescription.patient.lastName}`

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Receta #{formatNumber(prescription.number)}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{patientName}</h1>
          <p className="text-muted-foreground">Fecha: {formatDateOnly(prescription.prescriptionDate)}</p>
        </div>
        <Button render={<Link to={`/prescriptions/${prescription.id}/edit`} />}><PencilIcon />Editar receta</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Paciente</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="text-muted-foreground">DNI:</span> {prescription.patient.dni ?? "No registrado"}</p>
          <p><span className="text-muted-foreground">Celular:</span> {prescription.patient.phone ?? "No registrado"}</p>
          <Button variant="link" className="h-auto justify-start p-0" render={<Link to={`/patients/${prescription.patient.id}`} />}>Ver ficha del paciente</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <PrescriptionMeasurements title="Vista lejana" measurements={prescription.far} />
        <PrescriptionMeasurements title="Vista cercana" measurements={prescription.near} />
      </div>

      <Card>
        <CardHeader><CardTitle>Parámetros de personalización</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <p><span className="text-muted-foreground">Distancia de vértice:</span> {prescription.personalization.vertexDistance ? `${prescription.personalization.vertexDistance} mm` : "—"}</p>
          <p><span className="text-muted-foreground">Ángulo pantoscópico:</span> {prescription.personalization.pantoscopicAngle ? `${prescription.personalization.pantoscopicAngle}°` : "—"}</p>
          <p><span className="text-muted-foreground">Ángulo panorámico:</span> {prescription.personalization.panoramicAngle ? `${prescription.personalization.panoramicAngle}°` : "—"}</p>
          <p><span className="text-muted-foreground">Diseño:</span> {prescription.personalization.type ? personalizationTypeLabels[prescription.personalization.type] : "—"}</p>
          <p><span className="text-muted-foreground">Montura:</span> {prescription.personalization.frameType ? frameTypeLabels[prescription.personalization.frameType] : "—"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Diagnóstico y recomendaciones</CardTitle></CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <div><p className="mb-1 text-sm font-medium">Diagnóstico ocular</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{prescription.ocularDiagnosis ?? "—"}</p></div>
          <div><p className="mb-1 text-sm font-medium">Diagnóstico refractivo</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{prescription.refractiveDiagnosis ?? "—"}</p></div>
          <div className="lg:col-span-2"><p className="mb-1 text-sm font-medium">Tratamiento / recomendaciones</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{prescription.treatment ?? "—"}</p></div>
          <div className="lg:col-span-2"><p className="mb-1 text-sm font-medium">Observaciones</p><p className="whitespace-pre-wrap text-sm text-muted-foreground">{prescription.observations ?? "—"}</p></div>
        </CardContent>
      </Card>
    </section>
  )
}
