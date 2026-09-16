import {
  FileTextIcon,
  LayoutDashboardIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export type DashboardMenuItem = {
  title: string
  to: string
  icon: LucideIcon
}

export const dashboardMenu: DashboardMenuItem[] = [
  {
    title: "Panel principal",
    to: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Pacientes",
    to: "/patients",
    icon: UsersIcon,
  },
  {
    title: "Recetas",
    to: "/prescriptions",
    icon: FileTextIcon,
  },
]
