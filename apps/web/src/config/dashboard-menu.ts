import { LayoutDashboardIcon, type LucideIcon } from "lucide-react"

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
]
