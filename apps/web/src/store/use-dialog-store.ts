import type { ReactNode } from "react"
import { create } from "zustand"

import {
  defaultCloseGuardMessage,
  type CloseGuard,
} from "@/lib/close-guard"

export type DialogOptions = {
  title?: ReactNode
  description?: ReactNode
  content: ReactNode
  className?: string
  dismissible?: boolean
  showCloseButton?: boolean
}

type DialogState = {
  isOpen: boolean
  options: DialogOptions | null
  closeGuard: CloseGuard
  openDialog: (options: DialogOptions) => boolean
  closeDialog: () => boolean
  forceCloseDialog: () => void
  setCloseGuard: (isBlocked: boolean, message?: string) => void
  clearDialog: () => void
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  options: null,
  closeGuard: {
    isBlocked: false,
    message: defaultCloseGuardMessage,
  },
  openDialog: (options) => {
    if (get().isOpen && get().closeGuard.isBlocked) {
      return false
    }

    set({
      isOpen: true,
      options,
      closeGuard: {
        isBlocked: false,
        message: defaultCloseGuardMessage,
      },
    })
    return true
  },
  closeDialog: () => {
    if (get().closeGuard.isBlocked) {
      return false
    }

    set({ isOpen: false })
    return true
  },
  forceCloseDialog: () => set({ isOpen: false }),
  setCloseGuard: (isBlocked, message = defaultCloseGuardMessage) =>
    set({ closeGuard: { isBlocked, message } }),
  clearDialog: () =>
    set({
      options: null,
      closeGuard: {
        isBlocked: false,
        message: defaultCloseGuardMessage,
      },
    }),
}))
