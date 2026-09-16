import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  PatientCreateInput,
  PatientListQuery,
  PatientUpdateInput,
} from "@optica/contracts"
import { patientsService } from "@/api/patients/patients.service"
import { prescriptionKeys } from "@/features/prescriptions/prescription-query-keys"
import { patientKeys } from "@/features/patients/patient-query-keys"

export function usePatientsQuery(
  params: Partial<PatientListQuery>,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientsService.list(params),
    enabled: options.enabled,
  })
}

export function usePatientQuery(id: string | undefined) {
  return useQuery({
    queryKey: patientKeys.detail(id ?? ""),
    queryFn: () => patientsService.getById(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useCreatePatientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: PatientCreateInput) => patientsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
  })
}

export function useUpdatePatientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PatientUpdateInput }) =>
      patientsService.update(id, input),
    onSuccess: async (patient) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: patientKeys.detail(patient.id) }),
        queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() }),
      ])
    },
  })
}
