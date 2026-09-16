import axios from "axios"
import {
  apiErrorResponseSchema,
  type ApiErrorDetails as ContractApiErrorDetails,
  type ApiErrorField as ContractApiErrorField,
} from "@optica/contracts"

export type ApiErrorField = ContractApiErrorField
export type ApiErrorDetails = ContractApiErrorDetails

type ApiErrorPayload = {
  message?: unknown
  error?: unknown
  code?: unknown
  details?: unknown
  requestId?: unknown
}

type ApiErrorOptions = {
  status?: number
  code?: string
  details?: unknown
  requestId?: string
  cause?: unknown
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string
  readonly details?: unknown
  readonly requestId?: string

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = "ApiError"
    this.status = options.status
    this.code = options.code
    this.details = options.details
    this.requestId = options.requestId
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError

const getPayloadObject = (payload: unknown): ApiErrorPayload | undefined => {
  if (!payload || typeof payload !== "object") return undefined

  return payload as ApiErrorPayload
}

const getValidatedPayload = (payload: unknown) => {
  const parsedPayload = apiErrorResponseSchema.safeParse(payload)

  return parsedPayload.success ? parsedPayload.data : undefined
}

const getNestedErrorPayload = (payload: unknown) => {
  const data = getPayloadObject(payload)

  if (!data || !data.error || typeof data.error !== "object") {
    return undefined
  }

  return getPayloadObject(data.error)
}

const getPayloadMessage = (payload: unknown) => {
  const validatedPayload = getValidatedPayload(payload)
  const data = getPayloadObject(payload)
  const nestedError = getNestedErrorPayload(payload)

  if (validatedPayload) return validatedPayload.message
  if (typeof data?.message === "string") return data.message
  if (typeof data?.error === "string") return data.error
  if (typeof nestedError?.message === "string") return nestedError.message

  return undefined
}

const getPayloadCode = (payload: unknown) => {
  const validatedPayload = getValidatedPayload(payload)
  const data = getPayloadObject(payload)
  const nestedError = getNestedErrorPayload(payload)

  if (validatedPayload) return validatedPayload.code
  if (typeof data?.code === "string") return data.code
  if (typeof nestedError?.code === "string") return nestedError.code

  return undefined
}

const getPayloadDetails = (payload: unknown) => {
  const validatedPayload = getValidatedPayload(payload)
  const data = getPayloadObject(payload)
  const nestedError = getNestedErrorPayload(payload)

  if (validatedPayload) return validatedPayload.details
  return data?.details ?? nestedError?.details
}

const getPayloadRequestId = (payload: unknown) => {
  const validatedPayload = getValidatedPayload(payload)
  const data = getPayloadObject(payload)
  const nestedError = getNestedErrorPayload(payload)

  if (validatedPayload) return validatedPayload.requestId
  if (typeof data?.requestId === "string") return data.requestId
  if (typeof nestedError?.requestId === "string") return nestedError.requestId

  return undefined
}

export const getApiErrorMessage = (error: unknown) => {
  if (isApiError(error)) return error.message

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "La solicitud tardó demasiado."
    }

    if (error.code === "ERR_NETWORK") {
      return "No se pudo conectar con el servidor."
    }

    return (
      getPayloadMessage(error.response?.data) ??
      "No se pudo completar la solicitud."
    )
  }

  if (error instanceof Error) return error.message

  return "Ocurrió un error inesperado."
}

export const normalizeApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error

  if (axios.isAxiosError(error)) {
    const payload = error.response?.data

    return new ApiError(getApiErrorMessage(error), {
      status: error.response?.status,
      code: getPayloadCode(payload) ?? error.code,
      details: getPayloadDetails(payload),
      requestId: getPayloadRequestId(payload),
      cause: error,
    })
  }

  return new ApiError(getApiErrorMessage(error), { cause: error })
}

export const getApiFieldErrors = (error: unknown): ApiErrorField[] => {
  const normalizedError = normalizeApiError(error)
  const details = normalizedError.details

  if (!details || typeof details !== "object") return []

  const fields = (details as ApiErrorDetails).fields

  if (!Array.isArray(fields)) return []

  return fields.filter(
    (field): field is ApiErrorField =>
      !!field &&
      typeof field === "object" &&
      Array.isArray(field.path) &&
      typeof field.message === "string",
  )
}
