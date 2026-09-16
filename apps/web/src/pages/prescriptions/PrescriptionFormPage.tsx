import { useParams, useSearchParams } from "react-router"
import { FileTextIcon } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { PrescriptionForm } from "@/features/prescriptions/components/prescription-form"
import { usePrescriptionQuery } from "@/features/prescriptions/hooks/use-prescriptions"
import { usePatientQuery } from "@/features/patients/hooks/use-patients"

type PrescriptionFormPageProps = {
  mode: "create" | "edit"
}

export default function PrescriptionFormPage({ mode }: PrescriptionFormPageProps) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialPatientId = mode === "create" ? searchParams.get("patientId") ?? undefined : undefined
  const prescriptionQuery = usePrescriptionQuery(mode === "edit" ? id : undefined)
  const initialPatientQuery = usePatientQuery(initialPatientId)

  if (mode === "edit" && prescriptionQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-56 w-full" /><Skeleton className="h-96 w-full" /></div>
  }

  if (mode === "create" && initialPatientId && initialPatientQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-56 w-full" /></div>
  }

  if (mode === "edit" && (prescriptionQuery.isError || !prescriptionQuery.data)) {
    return <Empty><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>No se encontró la receta</EmptyTitle><EmptyDescription>La receta solicitada no existe o no se pudo cargar.</EmptyDescription></EmptyHeader></Empty>
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{mode === "edit" ? "Editar receta" : "Nueva receta"}</h1>
        <p className="text-muted-foreground">{mode === "edit" ? "Actualiza la información clínica y técnica de la receta." : "Registra las mediciones y recomendaciones del paciente."}</p>
      </div>
      <PrescriptionForm
        prescription={prescriptionQuery.data}
        initialPatient={initialPatientQuery.data}
      />
    </section>
  )
}
