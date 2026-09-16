import { ConfirmAlertDialog } from "@/components/dialogs"
import { toast } from "@/components/ui/toast"
import { useAlertDialogStore } from "@/store/use-alert-dialog-store"

export function GlobalAlertDialog() {
  const {
    isOpen,
    isPending,
    options,
    closeAlertDialog,
    confirmAlertDialog,
    clearAlertDialog,
  } = useAlertDialogStore()

  if (!options) return null

  return (
    <ConfirmAlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return

        closeAlertDialog()
      }}
      onBlockedClose={() => {
        toast.add({
          title: "Operación en curso",
          description:
            "La confirmación está en curso. Espera a que termine para cerrar.",
          type: "warning",
        })
      }}
      onOpenChangeComplete={(open) => {
        if (!open) clearAlertDialog()
      }}
      title={options.title}
      description={options.description}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      confirmVariant={options.confirmVariant}
      isPending={isPending}
      onConfirm={confirmAlertDialog}
      onError={options.onError}
    />
  )
}
