export type CloseGuard = {
  isBlocked: boolean
  message: string
}

export const defaultCloseGuardMessage =
  "La operación está en curso. Espera a que termine para cerrar."
