import type { Patient } from "@optica/contracts"
import { Link } from "react-router"
import { PencilIcon } from "lucide-react"
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

type PatientListProps = {
  patients: Patient[]
  onEdit: (patient: Patient) => void
}

const getPatientName = (patient: Patient) =>
  `${patient.firstName} ${patient.lastName}`

export function PatientList({ patients, onEdit }: PatientListProps) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  <Link className="hover:underline" to={`/patients/${patient.id}`}>
                    {getPatientName(patient)}
                  </Link>
                </TableCell>
                <TableCell>{patient.dni ?? "—"}</TableCell>
                <TableCell>{patient.phone ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Editar ${getPatientName(patient)}`}
                    onClick={() => onEdit(patient)}
                  >
                    <PencilIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {patients.map((patient) => (
          <Card key={patient.id} size="sm">
            <CardHeader>
              <CardTitle>
                <Link to={`/patients/${patient.id}`}>{getPatientName(patient)}</Link>
              </CardTitle>
              <CardDescription>
                DNI: {patient.dni ?? "No registrado"}
              </CardDescription>
              <CardAction>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Editar ${getPatientName(patient)}`}
                  onClick={() => onEdit(patient)}
                >
                  <PencilIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {patient.phone ?? "Celular no registrado"}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
