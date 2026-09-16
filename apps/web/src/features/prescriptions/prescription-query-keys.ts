import type { PrescriptionListQuery } from "@optica/contracts"

export const prescriptionKeys = {
  all: ["prescriptions"] as const,
  lists: () => [...prescriptionKeys.all, "list"] as const,
  list: (params: Partial<PrescriptionListQuery>) =>
    [...prescriptionKeys.lists(), params] as const,
  details: () => [...prescriptionKeys.all, "detail"] as const,
  detail: (id: string) => [...prescriptionKeys.details(), id] as const,
}
