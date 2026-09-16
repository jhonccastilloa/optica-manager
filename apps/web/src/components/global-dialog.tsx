import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { useDialogStore } from "@/store/use-dialog-store"

export function GlobalDialog() {
  const {
    isOpen,
    options,
    closeGuard,
    closeDialog,
    clearDialog,
  } = useDialogStore()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !closeDialog()) {
          toast.add({
            title: "Operación en curso",
            description: closeGuard.message,
            type: "warning",
          })
        }
      }}
      onOpenChangeComplete={(open) => {
        if (!open) clearDialog()
      }}
      disablePointerDismissal={
        options?.dismissible === false || closeGuard.isBlocked
      }
    >
      <DialogContent
        className={cn("max-h-[min(90vh,48rem)] overflow-hidden", options?.className)}
        showCloseButton={options?.showCloseButton ?? true}
      >
        <div className="flex min-h-0 flex-col gap-4">
          {(options?.title || options?.description) && (
            <DialogHeader>
              {options.title && <DialogTitle>{options.title}</DialogTitle>}
              {options.description && (
                <DialogDescription>
                  {options.description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          <div className="min-h-0 overflow-y-auto">{options?.content}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
