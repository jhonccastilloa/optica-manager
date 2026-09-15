import axios from "axios"
import { toast } from "@/components/ui/toast"
import ENV from "@/config/env"
import { getApiErrorMessage, normalizeApiError } from "@/api/errors"
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

const shouldShowErrorToast = (error: unknown) => {
  if (axios.isCancel(error)) return false
  if (!axios.isAxiosError(error)) return true

  return error.config?.skipErrorToast !== true
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

    if (shouldShowErrorToast(error)) {
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
