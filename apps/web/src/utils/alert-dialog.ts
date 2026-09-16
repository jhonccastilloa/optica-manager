import {
  useAlertDialogStore,
  type AlertDialogOptions,
} from "@/store/use-alert-dialog-store"

export const openAlertDialog = (options: AlertDialogOptions) =>
  useAlertDialogStore.getState().openAlertDialog(options)

export const closeAlertDialog = () =>
  useAlertDialogStore.getState().closeAlertDialog()

export const forceCloseAlertDialog = () =>
  useAlertDialogStore.getState().forceCloseAlertDialog()
