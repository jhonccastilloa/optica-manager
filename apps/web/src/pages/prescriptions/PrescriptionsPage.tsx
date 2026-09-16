import { useDeferredValue } from "react"
import { Link, useSearchParams } from "react-router"
import { FileTextIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { PrescriptionList } from "@/features/prescriptions/components/prescription-list"
import { usePrescriptionsQuery } from "@/features/prescriptions/hooks/use-prescriptions"

const pageSize = 20

const getPage = (value: string | null) => {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export default function PrescriptionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") ?? ""
  const page = getPage(searchParams.get("page"))
  const deferredQuery = useDeferredValue(q)
  const prescriptionsQuery = usePrescriptionsQuery({
    page,
    pageSize,
    q: deferredQuery || undefined,
  })

  const updateSearchParams = (next: { q?: string; page?: number }) => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous)
      if (next.q === undefined || next.q === "") params.delete("q")
      else params.set("q", next.q)
      if (next.page === undefined || next.page === 1) params.delete("page")
      else params.set("page", String(next.page))
      return params
    }, { replace: true })
  }

  const data = prescriptionsQuery.data

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recetas</h1>
          <p className="text-muted-foreground">Consulta y registra las recetas de tus pacientes.</p>
        </div>
        <Button render={<Link to="/prescriptions/new" />}><PlusIcon />Nueva receta</Button>
      </div>

      <div className="relative max-w-lg">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(event) => updateSearchParams({ q: event.target.value, page: 1 })} className="pl-9" placeholder="Buscar por N.º, paciente o DNI..." aria-label="Buscar recetas" />
      </div>

      {prescriptionsQuery.isLoading && <div className="space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>}

      {prescriptionsQuery.isError && (
        <Empty><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>No se pudieron cargar las recetas</EmptyTitle><EmptyDescription>Verifica la conexión con la API e inténtalo nuevamente.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => prescriptionsQuery.refetch()}>Reintentar</Button></EmptyContent></Empty>
      )}

      {!prescriptionsQuery.isLoading && !prescriptionsQuery.isError && data?.items.length === 0 && (
        <Empty><EmptyHeader><EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia><EmptyTitle>{q ? "No encontramos recetas" : "Aún no hay recetas"}</EmptyTitle><EmptyDescription>{q ? "Prueba con otro número, paciente o DNI." : "Registra la primera receta digital."}</EmptyDescription></EmptyHeader>{!q && <EmptyContent><Button render={<Link to="/prescriptions/new" />}><PlusIcon />Nueva receta</Button></EmptyContent>}</Empty>
      )}

      {data && data.items.length > 0 && (
        <>
          <PrescriptionList prescriptions={data.items} />
          <div className="flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">{data.pagination.total} receta{data.pagination.total === 1 ? "" : "s"}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateSearchParams({ q, page: page - 1 })}>Anterior</Button><Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => updateSearchParams({ q, page: page + 1 })}>Siguiente</Button></div></div>
        </>
      )}
    </section>
  )
}
