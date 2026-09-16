import { z } from "zod"

export const errorCodeSchema = z.enum([
  "BAD_REQUEST",
  "VALIDATION_ERROR",
  "DATABASE_VALIDATION_ERROR",
  "NOT_FOUND",
  "RESOURCE_NOT_FOUND",
  "CONFLICT",
  "UNPROCESSABLE_ENTITY",
  "DUPLICATE_RESOURCE",
  "RELATION_CONFLICT",
  "DATABASE_ERROR",
  "REQUEST_ERROR",
  "INTERNAL_SERVER_ERROR",
] as const)

export const ERROR_CODES = errorCodeSchema.enum

export const apiErrorFieldSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])),
  code: z.string().optional(),
  message: z.string(),
})

export const apiErrorDetailsSchema = z.object({
  fields: z.array(apiErrorFieldSchema).optional(),
}).passthrough()

export const apiErrorResponseSchema = z.object({
  status: z.enum(["fail", "error"]),
  code: errorCodeSchema,
  message: z.string(),
  details: z.unknown().optional(),
  requestId: z.string().optional(),
  stack: z.string().optional(),
})

export type ErrorCode = z.infer<typeof errorCodeSchema>
export type ApiErrorField = z.infer<typeof apiErrorFieldSchema>
export type ApiErrorDetails = z.infer<typeof apiErrorDetailsSchema>
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
