import type { ReactNode } from "react"
import { create } from "zustand"

export type DrawerSide = "left" | "right" | "top" | "bottom"

export type DrawerOptions = {
  title?: ReactNode
  description?: ReactNode
  content: ReactNode
  side?: DrawerSide
  width?: string
  height?: string
  className?: string
  dismissible?: boolean
  showSwipeHandle?: boolean
}

type DrawerState = {
  isOpen: boolean
  options: DrawerOptions | null
  closeGuard: {
    isBlocked: boolean
    message: string
  }
  openDrawer: (options: DrawerOptions) => boolean
  closeDrawer: () => boolean
  forceCloseDrawer: () => void
  setCloseGuard: (isBlocked: boolean, message?: string) => void
  clearDrawer: () => void
}

const defaultCloseMessage =
  "La operación está en curso. Espera a que termine para cerrar."

export const useDrawerStore = create<DrawerState>((set, get) => ({
  isOpen: false,
  options: null,
  closeGuard: {
    isBlocked: false,
    message: defaultCloseMessage,
  },
  openDrawer: (options) => {
    if (get().isOpen && get().closeGuard.isBlocked) {
      return false
    }

    set({
      isOpen: true,
      options,
      closeGuard: {
        isBlocked: false,
        message: defaultCloseMessage,
      },
    })
    return true
  },
  closeDrawer: () => {
    if (get().closeGuard.isBlocked) {
      return false
    }

    set({ isOpen: false })
    return true
  },
  forceCloseDrawer: () => set({ isOpen: false }),
  setCloseGuard: (isBlocked, message = defaultCloseMessage) =>
    set({ closeGuard: { isBlocked, message } }),
  clearDrawer: () =>
    set({
      options: null,
      closeGuard: {
        isBlocked: false,
        message: defaultCloseMessage,
      },
    }),
}))
