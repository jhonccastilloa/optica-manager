import { Loader2Icon } from "lucide-react"
import { useLoaderStore } from "@/store/use-loader-store"

export function GlobalLoader() {
  const isLoading = useLoaderStore((state) => state.pendingRequests > 0)

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <Loader2Icon className="size-10 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
