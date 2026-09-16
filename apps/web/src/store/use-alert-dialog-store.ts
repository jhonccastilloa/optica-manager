import { create } from "zustand"

export type AlertDialogOptions = {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
  onError?: (error: unknown) => void
}

type AlertDialogState = {
  isOpen: boolean
  isPending: boolean
  options: AlertDialogOptions | null
  openAlertDialog: (options: AlertDialogOptions) => boolean
  closeAlertDialog: () => boolean
  forceCloseAlertDialog: () => void
  confirmAlertDialog: () => Promise<void>
  clearAlertDialog: () => void
}

export const useAlertDialogStore = create<AlertDialogState>((set, get) => ({
  isOpen: false,
  isPending: false,
  options: null,
  openAlertDialog: (options) => {
    if (get().isOpen) return false

    set({
      isOpen: true,
      isPending: false,
      options,
    })
    return true
  },
  closeAlertDialog: () => {
    if (get().isPending) return false

    set({ isOpen: false })
    return true
  },
  forceCloseAlertDialog: () =>
    set({ isOpen: false, isPending: false }),
  confirmAlertDialog: async () => {
    const { isOpen, isPending, options } = get()

    if (!isOpen || isPending || !options) return

    set({ isPending: true })

    try {
      await options.onConfirm()
    } finally {
      set({ isPending: false })
    }
  },
  clearAlertDialog: () => {
    if (get().isOpen) return

    set({
      options: null,
      isPending: false,
    })
  },
}))
