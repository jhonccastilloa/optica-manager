import {
  useDialogStore,
  type DialogOptions,
} from "@/store/use-dialog-store"

export const openDialog = (options: DialogOptions) =>
  useDialogStore.getState().openDialog(options)

export const closeDialog = () => useDialogStore.getState().closeDialog()

export const forceCloseDialog = () =>
  useDialogStore.getState().forceCloseDialog()
