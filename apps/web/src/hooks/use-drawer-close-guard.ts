import { useEffect } from "react"

import { useDrawerStore } from "@/store/use-drawer-store"

const defaultCloseMessage =
  "La operación está en curso. Espera a que termine para cerrar."

export function useDrawerCloseGuard(
  isBlocked: boolean,
  message = defaultCloseMessage,
) {
  const setCloseGuard = useDrawerStore((state) => state.setCloseGuard)

  useEffect(() => {
    setCloseGuard(isBlocked, message)

    return () => {
      setCloseGuard(false)
    }
  }, [isBlocked, message, setCloseGuard])
}
