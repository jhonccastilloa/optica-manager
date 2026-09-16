import {
  useDrawerStore,
  type DrawerOptions,
} from "@/store/use-drawer-store"

export const openDrawer = (options: DrawerOptions) =>
  useDrawerStore.getState().openDrawer(options)

export const closeDrawer = () => useDrawerStore.getState().closeDrawer()

export const forceCloseDrawer = () =>
  useDrawerStore.getState().forceCloseDrawer()
