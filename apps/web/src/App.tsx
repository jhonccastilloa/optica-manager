import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { router } from "@/router/router"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="optica-manager-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  )
}

export default App
