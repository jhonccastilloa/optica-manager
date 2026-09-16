import {
  QueryClientProvider,
  type QueryClientProviderProps,
} from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"

type QueryProviderProps = Pick<QueryClientProviderProps, "children">

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
