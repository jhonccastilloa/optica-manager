import { createBrowserRouter } from "react-router"
import DashboardLayout from "@/layouts/DashboardLayout"
import DashboardPage from "@/pages/DashboardPage"
import NotFoundPage from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
])
