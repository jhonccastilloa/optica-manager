import axios from "axios"

type ApiErrorPayload = {
  message?: unknown
  error?: unknown
  details?: unknown
}

type ApiErrorOptions = {
  status?: number
  code?: string
  details?: unknown
  cause?: unknown
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string
  readonly details?: unknown

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = "ApiError"
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }
}

const getPayloadMessage = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return undefined

  const data = payload as ApiErrorPayload

  if (typeof data.message === "string") return data.message
  if (typeof data.error === "string") return data.error

  return undefined
}

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.message

  if (axios.isAxiosError(error)) {
    return (
      getPayloadMessage(error.response?.data) ??
      (error.code === "ECONNABORTED"
        ? "La solicitud tardó demasiado."
        : "No se pudo completar la solicitud.")
    )
  }

  if (error instanceof Error) return error.message

  return "Ocurrió un error inesperado."
}

export const normalizeApiError = (error: unknown): unknown => {
  if (!axios.isAxiosError(error)) return error

  return new ApiError(getApiErrorMessage(error), {
    status: error.response?.status,
    code: error.code,
    details: error.response?.data,
    cause: error,
  })
}
