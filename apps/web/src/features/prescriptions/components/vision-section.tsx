import { useFormContext, useWatch } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeMeasurementFields } from "./eye-measurement-fields"

type VisionSectionProps = {
  name: "far" | "near"
  title: string
  description: string
}

const toNumber = (value: unknown) => {
  if (typeof value !== "string" || value.trim() === "") return null
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? parsed : null
}

export function VisionSection({ name, title, description }: VisionSectionProps) {
  const { control } = useFormContext()
  const odDnp = useWatch({ control, name: `${name}.od.dnp` })
  const oiDnp = useWatch({ control, name: `${name}.oi.dnp` })
  const odValue = toNumber(odDnp)
  const oiValue = toNumber(oiDnp)
  const dip = odValue === null || oiValue === null ? null : odValue + oiValue

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <EyeMeasurementFields name={`${name}.od`} title="OD" />
          <EyeMeasurementFields name={`${name}.oi`} title="OI" />
        </div>
        <p className="text-sm text-muted-foreground">
          DIP total: <span className="font-medium text-foreground">{dip === null ? "—" : `${dip.toFixed(2)} mm`}</span>
        </p>
      </CardContent>
    </Card>
  )
}
