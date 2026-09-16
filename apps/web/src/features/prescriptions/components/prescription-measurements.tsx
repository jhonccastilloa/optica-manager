import type { EyeMeasurement, VisionMeasurements } from "@optica/contracts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PrescriptionMeasurementsProps = {
  title: string
  measurements: VisionMeasurements
}

const values: Array<{ label: string; getValue: (measurement: EyeMeasurement) => string }> = [
  { label: "Esfera", getValue: (measurement) => measurement.sphere ?? "—" },
  { label: "Cilindro", getValue: (measurement) => measurement.cylinder ?? "—" },
  { label: "Eje", getValue: (measurement) => measurement.axis === null ? "—" : `${measurement.axis}°` },
  { label: "DNP", getValue: (measurement) => measurement.dnp ? `${measurement.dnp} mm` : "—" },
  { label: "Altura", getValue: (measurement) => measurement.height ? `${measurement.height} mm` : "—" },
  { label: "Prisma", getValue: (measurement) => measurement.prism.value && measurement.prism.base ? `${measurement.prism.value} Δ · ${measurement.prism.base}` : "—" },
]

const toNumber = (value: string | null) => value === null ? null : Number(value)

export function PrescriptionMeasurements({ title, measurements }: PrescriptionMeasurementsProps) {
  const odDnp = toNumber(measurements.od.dnp)
  const oiDnp = toNumber(measurements.oi.dnp)
  const dip = odDnp === null || oiDnp === null ? null : odDnp + oiDnp

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 text-sm">
          <span className="font-medium text-muted-foreground">Medición</span>
          <span className="font-medium text-muted-foreground">OD</span>
          <span className="font-medium text-muted-foreground">OI</span>
          {values.map((item) => (
            <div className="contents" key={item.label}>
              <span className="border-t py-2 text-muted-foreground">{item.label}</span>
              <span className="border-t py-2">{item.getValue(measurements.od)}</span>
              <span className="border-t py-2">{item.getValue(measurements.oi)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">DIP total: <span className="font-medium text-foreground">{dip === null ? "—" : `${dip.toFixed(2)} mm`}</span></p>
      </CardContent>
    </Card>
  )
}
