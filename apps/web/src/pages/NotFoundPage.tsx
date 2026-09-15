import { Link } from "react-router"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Error 404</p>
      <h1 className="text-4xl font-semibold tracking-tight">Página no encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        La dirección que buscas no existe o aún no está disponible.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Volver al panel
      </Link>
    </main>
  )
}
