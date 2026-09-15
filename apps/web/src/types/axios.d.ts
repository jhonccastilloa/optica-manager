import "axios"

declare module "axios" {
  interface AxiosRequestConfig {
    /** Evita que esta request active el loader global. */
    skipGlobalLoader?: boolean
    /** Evita que esta request muestre un Toast automático ante un error. */
    skipErrorToast?: boolean
  }
}
