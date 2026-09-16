import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectField, TextField } from "@/components/form"

type EyeMeasurementFieldsProps = {
  name: "far.od" | "far.oi" | "near.od" | "near.oi"
  title: "OD" | "OI"
}

const prismBaseOptions = [
  { value: "IN", label: "Interna" },
  { value: "OUT", label: "Externa" },
  { value: "UP", label: "Superior" },
  { value: "DOWN", label: "Inferior" },
] as const

export function EyeMeasurementFields({ name, title }: EyeMeasurementFieldsProps) {
  const { control, setValue } = useFormContext()
  const cylinder = useWatch({ control, name: `${name}.cylinder` }) as string | null
  const hasCylinder = Boolean(cylinder)

  useEffect(() => {
    if (!hasCylinder) setValue(`${name}.axis`, null)
  }, [hasCylinder, name, setValue])

  return (
    <Card size="sm">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <TextField name={`${name}.sphere`} label="Esfera" inputMode="decimal" placeholder="-5.50" />
        <TextField name={`${name}.cylinder`} label="Cilindro" inputMode="decimal" placeholder="-0.50" />
        <TextField name={`${name}.axis`} label="Eje" inputMode="numeric" placeholder="0 a 180" disabled={!hasCylinder} />
        <TextField name={`${name}.dnp`} label="DNP" inputMode="decimal" placeholder="31.0" />
        <TextField name={`${name}.height`} label="Altura" inputMode="decimal" placeholder="19.0" />
        <TextField name={`${name}.prism.value`} label="Prisma (Δ)" inputMode="decimal" placeholder="2.00" />
        <SelectField name={`${name}.prism.base`} label="Base de prisma" options={prismBaseOptions} placeholder="Seleccione una base" />
      </CardContent>
    </Card>
  )
}
