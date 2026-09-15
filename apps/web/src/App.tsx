import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "@/components/theme-provider"
import { router } from "@/router/router"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="optica-manager-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
