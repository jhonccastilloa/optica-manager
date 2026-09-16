import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  PrescriptionCreateInput,
  PrescriptionListQuery,
  PrescriptionUpdateInput,
} from "@optica/contracts"
import { prescriptionsService } from "@/api/prescriptions/prescriptions.service"
import { prescriptionKeys } from "@/features/prescriptions/prescription-query-keys"

export function usePrescriptionsQuery(params: Partial<PrescriptionListQuery>) {
  return useQuery({
    queryKey: prescriptionKeys.list(params),
    queryFn: () => prescriptionsService.list(params),
  })
}

export function usePrescriptionQuery(id: string | undefined) {
  return useQuery({
    queryKey: prescriptionKeys.detail(id ?? ""),
    queryFn: () => prescriptionsService.getById(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useCreatePrescriptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: PrescriptionCreateInput) =>
      prescriptionsService.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() }),
  })
}

export function useUpdatePrescriptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PrescriptionUpdateInput }) =>
      prescriptionsService.update(id, input),
    onSuccess: async (prescription) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: prescriptionKeys.detail(prescription.id),
        }),
      ])
    },
  })
}
