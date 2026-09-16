import {
  prescriptionListResponseSchema,
  prescriptionSchema,
  type PrescriptionCreateInput,
  type PrescriptionListQuery,
  type PrescriptionUpdateInput,
} from "@optica/contracts"
import api from "@/api/api"

type PrescriptionListParams = Partial<PrescriptionListQuery>

export const prescriptionsService = {
  async list(params: PrescriptionListParams) {
    const response = await api.get("/prescriptions", {
      params,
      skipGlobalLoader: true,
    })

    return prescriptionListResponseSchema.parse(response.data)
  },

  async getById(id: string) {
    const response = await api.get(`/prescriptions/${id}`, {
      skipGlobalLoader: true,
    })

    return prescriptionSchema.parse(response.data)
  },

  async create(input: PrescriptionCreateInput) {
    const response = await api.post("/prescriptions", input)

    return prescriptionSchema.parse(response.data)
  },

  async update(id: string, input: PrescriptionUpdateInput) {
    const response = await api.patch(`/prescriptions/${id}`, input)

    return prescriptionSchema.parse(response.data)
  },
}
