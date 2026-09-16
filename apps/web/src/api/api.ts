import axios from "axios"
import { ERROR_CODES } from "@optica/contracts"
import { toast } from "@/components/ui/toast"
import ENV from "@/config/env"
import {
  getApiErrorMessage,
  isApiError,
  normalizeApiError,
} from "@/api/errors"
import { useLoaderStore } from "@/store/use-loader-store"

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
  },
})

const shouldTrackGlobalLoader = (
  config: { skipGlobalLoader?: boolean } | undefined,
) => config !== undefined && config.skipGlobalLoader !== true

const shouldShowErrorToast = (
  error: unknown,
  normalizedError: unknown,
) => {
  if (axios.isCancel(error)) return false
  if (!axios.isAxiosError(error)) return true

  if (error.config?.skipErrorToast === true) return false

  return !(
    isApiError(normalizedError) &&
    normalizedError.code === ERROR_CODES.VALIDATION_ERROR
  )
}

api.interceptors.request.use(
  (config) => {
    if (shouldTrackGlobalLoader(config)) {
      useLoaderStore.getState().startRequest()
    }

    return config
  },
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      shouldTrackGlobalLoader(error.config)
    ) {
      useLoaderStore.getState().finishRequest()
    }

    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    if (shouldTrackGlobalLoader(response.config)) {
      useLoaderStore.getState().finishRequest()
    }

    return response
  },
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      shouldTrackGlobalLoader(error.config)
    ) {
      useLoaderStore.getState().finishRequest()
    }

    const normalizedError = normalizeApiError(error)

    if (shouldShowErrorToast(error, normalizedError)) {
      toast.add({
        title: "Error",
        description: getApiErrorMessage(normalizedError),
        type: "error",
      })
    }

    return Promise.reject(normalizedError)
  },
)

export default api
