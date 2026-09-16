import { createBrowserRouter } from "react-router"
import DashboardLayout from "@/layouts/DashboardLayout"
import DashboardPage from "@/pages/DashboardPage"
import NotFoundPage from "@/pages/NotFoundPage"
import PatientsPage from "@/pages/patients/PatientsPage"
import PatientDetailPage from "@/pages/patients/PatientDetailPage"
import PrescriptionsPage from "@/pages/prescriptions/PrescriptionsPage"
import PrescriptionDetailPage from "@/pages/prescriptions/PrescriptionDetailPage"
import PrescriptionFormPage from "@/pages/prescriptions/PrescriptionFormPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "patients",
        Component: PatientsPage,
      },
      {
        path: "patients/:id",
        Component: PatientDetailPage,
      },
      {
        path: "prescriptions",
        Component: PrescriptionsPage,
      },
      {
        path: "prescriptions/new",
        Component: () => <PrescriptionFormPage mode="create" />,
      },
      {
        path: "prescriptions/:id",
        Component: PrescriptionDetailPage,
      },
      {
        path: "prescriptions/:id/edit",
        Component: () => <PrescriptionFormPage mode="edit" />,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
])
