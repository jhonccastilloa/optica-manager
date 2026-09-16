import type { PrescriptionListItem } from "@optica/contracts"
import { Link } from "react-router"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateOnly } from "@/lib/date/dayjs"

type PrescriptionListProps = {
  prescriptions: PrescriptionListItem[]
}

const patientName = (prescription: PrescriptionListItem) =>
  `${prescription.patient.firstName} ${prescription.patient.lastName}`

const formatNumber = (number: number) => String(number).padStart(6, "0")

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N.º receta</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell className="font-medium">#{formatNumber(prescription.number)}</TableCell>
                <TableCell>{patientName(prescription)}</TableCell>
                <TableCell>{prescription.patient.dni ?? "—"}</TableCell>
                <TableCell>{formatDateOnly(prescription.prescriptionDate)}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" render={<Link to={`/prescriptions/${prescription.id}`} />} aria-label={`Ver receta ${formatNumber(prescription.number)}`}>
                    <EyeIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id} size="sm">
            <CardHeader>
              <CardTitle>Receta #{formatNumber(prescription.number)}</CardTitle>
              <CardDescription>{formatDateOnly(prescription.prescriptionDate)}</CardDescription>
              <CardAction>
                <Button size="icon" variant="ghost" render={<Link to={`/prescriptions/${prescription.id}`} />} aria-label={`Ver receta ${formatNumber(prescription.number)}`}><EyeIcon /></Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{patientName(prescription)}</p>
              <p className="text-sm text-muted-foreground">{prescription.patient.dni ? `DNI ${prescription.patient.dni}` : "DNI no registrado"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
