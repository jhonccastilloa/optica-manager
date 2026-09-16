import { RouterProvider } from "react-router/dom"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalDrawer } from "@/components/global-drawer"
import { GlobalLoader } from "@/components/global-loader"
import { Toaster } from "@/components/ui/toast"
import { QueryProvider } from "@/providers/query-provider"
import { router } from "@/router/router"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="optica-manager-theme">
      <QueryProvider>
          <RouterProvider router={router} />
          <Toaster />
          <GlobalDrawer />
          <GlobalLoader />
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
