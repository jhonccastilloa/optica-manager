import { useEffect } from "react"

import { defaultCloseGuardMessage } from "@/lib/close-guard"

type SetCloseGuard = (isBlocked: boolean, message?: string) => void

export function useCloseGuard(
  setCloseGuard: SetCloseGuard,
  isBlocked: boolean,
  message = defaultCloseGuardMessage,
) {
  useEffect(() => {
    setCloseGuard(isBlocked, message)

    return () => {
      setCloseGuard(false)
    }
  }, [isBlocked, message, setCloseGuard])
}
