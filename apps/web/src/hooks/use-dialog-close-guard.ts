import { useCloseGuard } from "@/hooks/use-close-guard"
import { useDialogStore } from "@/store/use-dialog-store"

export function useDialogCloseGuard(
  isBlocked: boolean,
  message?: string,
) {
  const setCloseGuard = useDialogStore((state) => state.setCloseGuard)

  useCloseGuard(setCloseGuard, isBlocked, message)
}
