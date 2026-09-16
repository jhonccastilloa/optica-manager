import { z } from "zod"
import { patientIdSchema, patientSummarySchema } from "./patients"
import {
  createPaginatedResponseSchema,
  paginationSchema,
} from "./pagination"

const decimalPattern = /^[+-]?\d{1,3}(?:[.,]\d{1,2})?$/

const nullableDecimalSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      const normalizedValue = value.trim()
      return normalizedValue === "" ? null : normalizedValue.replace(",", ".")
    }

    return value
  },
  z.string().regex(decimalPattern, "Ingrese un decimal válido.").nullable(),
)

const nullableText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim().length === 0
        ? null
        : value,
    z.string().trim().max(max).nullable(),
  )

export const prismBaseSchema = z.enum(["IN", "OUT", "UP", "DOWN"])

export const personalizationTypeSchema = z.enum([
  "SIGNATURE",
  "EYEPRINT",
  "FREE_EVOLUTION",
])

export const frameTypeSchema = z.enum(["FULL_RIM", "SEMI_RIMLESS", "RIMLESS"])

export const prismSchema = z.object({
  value: nullableDecimalSchema,
  base: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    prismBaseSchema.nullable(),
  ),
}).superRefine((prism, context) => {
  const hasValue = prism.value !== null
  const hasBase = prism.base !== null

  if (hasValue === hasBase) return

  context.addIssue({
    code: "custom",
    message: "El prisma necesita potencia y base.",
    path: [hasValue ? "base" : "value"],
  })
})

export const eyeMeasurementSchema = z.object({
  sphere: nullableDecimalSchema,
  cylinder: nullableDecimalSchema,
  axis: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.coerce.number().int().min(0).max(180).nullable(),
  ),
  dnp: nullableDecimalSchema,
  height: nullableDecimalSchema,
  prism: prismSchema,
}).superRefine((measurement, context) => {
  if (measurement.cylinder === null && measurement.axis !== null) {
    context.addIssue({
      code: "custom",
      message: "El eje solo corresponde cuando existe cilindro.",
      path: ["axis"],
    })
  }

  if (measurement.cylinder !== null && measurement.axis === null) {
    context.addIssue({
      code: "custom",
      message: "El eje es obligatorio cuando existe cilindro.",
      path: ["axis"],
    })
  }
})

export const visionMeasurementsSchema = z.object({
  od: eyeMeasurementSchema,
  oi: eyeMeasurementSchema,
})

export const personalizationSchema = z.object({
  vertexDistance: nullableDecimalSchema,
  pantoscopicAngle: nullableDecimalSchema,
  panoramicAngle: nullableDecimalSchema,
  type: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    personalizationTypeSchema.nullable(),
  ),
  frameType: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    frameTypeSchema.nullable(),
  ),
})

export const prescriptionCreateSchema = z.object({
  patientId: patientIdSchema,
  prescriptionDate: z.iso.date(),
  far: visionMeasurementsSchema,
  near: visionMeasurementsSchema,
  personalization: personalizationSchema,
  ocularDiagnosis: nullableText(2_000),
  refractiveDiagnosis: nullableText(2_000),
  treatment: nullableText(2_000),
  observations: nullableText(2_000),
})

export const prescriptionUpdateSchema = prescriptionCreateSchema

export const prescriptionListQuerySchema = paginationSchema.extend({
  q: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(100).optional(),
  ),
  patientId: patientIdSchema.optional(),
})

export const prescriptionListItemSchema = z.object({
  id: z.uuid(),
  number: z.number().int().positive(),
  prescriptionDate: z.iso.date(),
  patient: patientSummarySchema,
})

export const prescriptionSchema = prescriptionListItemSchema.extend({
  far: visionMeasurementsSchema,
  near: visionMeasurementsSchema,
  personalization: personalizationSchema,
  ocularDiagnosis: z.string().nullable(),
  refractiveDiagnosis: z.string().nullable(),
  treatment: z.string().nullable(),
  observations: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const prescriptionListResponseSchema = createPaginatedResponseSchema(
  prescriptionListItemSchema,
)

export type PrismBase = z.infer<typeof prismBaseSchema>
export type PersonalizationType = z.infer<typeof personalizationTypeSchema>
export type FrameType = z.infer<typeof frameTypeSchema>
export type Prism = z.infer<typeof prismSchema>
export type EyeMeasurement = z.infer<typeof eyeMeasurementSchema>
export type VisionMeasurements = z.infer<typeof visionMeasurementsSchema>
export type Personalization = z.infer<typeof personalizationSchema>
export type PrescriptionCreateInput = z.infer<typeof prescriptionCreateSchema>
export type PrescriptionUpdateInput = z.infer<typeof prescriptionUpdateSchema>
export type PrescriptionListQuery = z.infer<typeof prescriptionListQuerySchema>
export type PrescriptionListItem = z.infer<typeof prescriptionListItemSchema>
export type Prescription = z.infer<typeof prescriptionSchema>
