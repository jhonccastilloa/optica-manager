import { z } from "zod"
import {
  createPaginatedResponseSchema,
  paginationSchema,
} from "./pagination"

const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim().length === 0
        ? undefined
        : value,
    z.string().trim().min(1).max(max).optional(),
  )

export const patientIdSchema = z.uuid()

export const patientCreateSchema = z.object({
  firstName: z.string().trim().min(1, "Los nombres son obligatorios.").max(100),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios.").max(100),
  dni: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim().length === 0
        ? undefined
        : value,
    z.string().trim().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos.").optional(),
  ),
  phone: optionalText(30),
  address: optionalText(500),
  reference: optionalText(500),
})

export const patientUpdateSchema = patientCreateSchema

export const patientListQuerySchema = paginationSchema.extend({
  q: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(100).optional(),
  ),
})

export const patientSummarySchema = z.object({
  id: patientIdSchema,
  firstName: z.string(),
  lastName: z.string(),
  dni: z.string().nullable(),
  phone: z.string().nullable(),
})

export const patientSchema = patientSummarySchema.extend({
  address: z.string().nullable(),
  reference: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const patientListResponseSchema = createPaginatedResponseSchema(
  patientSchema,
)

export type PatientCreateInput = z.infer<typeof patientCreateSchema>
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>
export type PatientListQuery = z.infer<typeof patientListQuerySchema>
export type PatientSummary = z.infer<typeof patientSummarySchema>
export type Patient = z.infer<typeof patientSchema>
