import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { toast } from "@/components/ui/toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  useDrawerStore,
  type DrawerSide,
} from "@/store/use-drawer-store"

function getSwipeDirection(side: DrawerSide) {
  switch (side) {
    case "left":
      return "left" as const
    case "top":
      return "up" as const
    case "bottom":
      return "down" as const
    default:
      return "right" as const
  }
}

export function GlobalDrawer() {
  const isMobile = useIsMobile()
  const {
    isOpen,
    options,
    closeGuard,
    closeDrawer,
    clearDrawer,
  } = useDrawerStore()

  const side = options?.side ?? "right"
  const swipeDirection = isMobile ? "down" : getSwipeDirection(side)
  const isHorizontal = swipeDirection === "left" || swipeDirection === "right"

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !closeDrawer()) {
          toast.add({
            title: "Operación en curso",
            description: closeGuard.message,
            type: "warning",
          })
        }
      }}
      onOpenChangeComplete={(open) => {
        if (!open) clearDrawer()
      }}
      swipeDirection={swipeDirection}
      disablePointerDismissal={
        options?.dismissible === false || closeGuard.isBlocked
      }
      showSwipeHandle={
        (options?.showSwipeHandle ?? isMobile) && !closeGuard.isBlocked
      }
    >
      <DrawerContent
        className={cn("max-w-full", options?.className)}
        style={
          {
            ...(isHorizontal
              ? {
                  "--drawer-content-width":
                    options?.width ?? "min(100vw, 40rem)",
                }
              : {
                  "--drawer-content-height": options?.height ?? "auto",
                }),
          } as React.CSSProperties
        }
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {(options?.title || options?.description) && (
            <DrawerHeader>
              {options.title && <DrawerTitle>{options.title}</DrawerTitle>}
              {options.description && (
                <DrawerDescription>
                  {options.description}
                </DrawerDescription>
              )}
            </DrawerHeader>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {options?.content}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
