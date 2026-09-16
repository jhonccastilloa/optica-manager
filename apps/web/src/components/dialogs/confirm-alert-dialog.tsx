import type { ReactNode } from "react"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export type ConfirmAlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  onBlockedClose?: () => void
  title: ReactNode
  description: ReactNode
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  confirmVariant?: "default" | "destructive"
  isPending?: boolean
  onConfirm: () => void | Promise<void>
  onError?: (error: unknown) => void
  className?: string
}

export function ConfirmAlertDialog({
  open,
  onOpenChange,
  onOpenChangeComplete,
  onBlockedClose,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "default",
  isPending = false,
  onConfirm,
  onError,
  className,
}: ConfirmAlertDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const isBusy = isPending || isConfirming

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isBusy) {
      onBlockedClose?.()
      return
    }

    onOpenChange(nextOpen)
  }

  const handleConfirm = async () => {
    if (isBusy) return

    setIsConfirming(true)

    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      onError?.(error)
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
    >
      <AlertDialogContent
        size="sm"
        className={cn("max-w-md", className)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isBusy}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            disabled={isBusy}
            aria-busy={isBusy}
            onClick={handleConfirm}
          >
            {isBusy && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
