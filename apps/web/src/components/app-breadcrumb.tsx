import { useLocation } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const pageTitles: Record<string, string> = {
  "/": "Panel principal",
  "/patients": "Pacientes",
  "/prescriptions": "Recetas",
}

export function AppBreadcrumb() {
  const { pathname } = useLocation()
  const title = pathname.startsWith("/patients/")
    ? "Detalle de paciente"
    : pathname === "/prescriptions/new"
      ? "Nueva receta"
      : pathname.endsWith("/edit")
        ? "Editar receta"
        : pathname.startsWith("/prescriptions/")
          ? "Detalle de receta"
          : pageTitles[pathname] ?? "Óptica Manager"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
