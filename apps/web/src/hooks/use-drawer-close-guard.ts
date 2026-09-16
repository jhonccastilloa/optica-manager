import { useCloseGuard } from "@/hooks/use-close-guard"
import { defaultCloseGuardMessage } from "@/lib/close-guard"
import { useDrawerStore } from "@/store/use-drawer-store"

export function useDrawerCloseGuard(
  isBlocked: boolean,
  message = defaultCloseGuardMessage,
) {
  const setCloseGuard = useDrawerStore((state) => state.setCloseGuard)

  useCloseGuard(setCloseGuard, isBlocked, message)
}
