import { useLocation } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const pageTitles: Record<string, string> = {
  "/": "Panel principal",
}

export function AppBreadcrumb() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? "Óptica Manager"

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
