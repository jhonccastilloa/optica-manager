import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme, type Theme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const options: { label: string; value: Theme; icon: typeof SunIcon }[] = [
  { label: "Claro", value: "light", icon: SunIcon },
  { label: "Oscuro", value: "dark", icon: MoonIcon },
  { label: "Sistema", value: "system", icon: MonitorIcon },
]

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const activeOption = options.find((option) => option.value === theme)
  const ActiveIcon = activeOption?.icon ?? MonitorIcon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Cambiar tema" />
        }
      >
        <ActiveIcon />
        <span className="sr-only">Cambiar tema</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tema</DropdownMenuLabel>
          {options.map((option) => {
            const Icon = option.icon
            const isActive = option.value === theme

            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTheme(option.value)}
              >
                <Icon />
                <span>{option.label}</span>
                {isActive && <CheckIcon className="ml-auto" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
