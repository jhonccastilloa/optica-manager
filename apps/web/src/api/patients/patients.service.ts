import {
  patientListResponseSchema,
  patientSchema,
  type PatientCreateInput,
  type PatientListQuery,
  type PatientUpdateInput,
} from "@optica/contracts"
import api from "@/api/api"

type PatientListParams = Partial<PatientListQuery>

export const patientsService = {
  async list(params: PatientListParams) {
    const response = await api.get("/patients", {
      params,
      skipGlobalLoader: true,
    })

    return patientListResponseSchema.parse(response.data)
  },

  async getById(id: string) {
    const response = await api.get(`/patients/${id}`, {
      skipGlobalLoader: true,
    })

    return patientSchema.parse(response.data)
  },

  async create(input: PatientCreateInput) {
    const response = await api.post("/patients", input)

    return patientSchema.parse(response.data)
  },

  async update(id: string, input: PatientUpdateInput) {
    const response = await api.patch(`/patients/${id}`, input)

    return patientSchema.parse(response.data)
  },
}
