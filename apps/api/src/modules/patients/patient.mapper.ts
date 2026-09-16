import type { Patient as PrismaPatient } from "@/generated/prisma/client"
import type { Patient, PatientSummary } from "@optica/contracts"

type PatientSummarySource = Pick<
  PrismaPatient,
  "id" | "firstName" | "lastName" | "dni" | "phone"
>

export function toPatientSummary(patient: PatientSummarySource): PatientSummary {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    dni: patient.dni,
    phone: patient.phone,
  }
}

export function toPatient(patient: PrismaPatient): Patient {
  return {
    ...toPatientSummary(patient),
    address: patient.address,
    reference: patient.reference,
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
  }
}
