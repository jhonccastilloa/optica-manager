import type {
  Patient as PrismaPatient,
  Prescription as PrismaPrescription,
} from "@/generated/prisma/client"
import type {
  EyeMeasurement,
  Personalization,
  Prescription,
  PrescriptionListItem,
  PrismBase,
} from "@optica/contracts"
import { toPatientSummary } from "@/modules/patients/patient.mapper"

type PrescriptionWithPatient = PrismaPrescription & {
  patient: Pick<
    PrismaPatient,
    "id" | "firstName" | "lastName" | "dni" | "phone"
  >
}

type DecimalValue = { toString: () => string } | null

const toDecimalString = (value: DecimalValue) => value?.toString() ?? null

const toEyeMeasurement = (
  sphere: DecimalValue,
  cylinder: DecimalValue,
  axis: number | null,
  dnp: DecimalValue,
  height: DecimalValue,
  prismValue: DecimalValue,
  prismBase: PrismBase | null,
): EyeMeasurement => ({
  sphere: toDecimalString(sphere),
  cylinder: toDecimalString(cylinder),
  axis,
  dnp: toDecimalString(dnp),
  height: toDecimalString(height),
  prism: {
    value: toDecimalString(prismValue),
    base: prismBase,
  },
})

const toPersonalization = (
  prescription: PrismaPrescription,
): Personalization => ({
  vertexDistance: toDecimalString(prescription.vertexDistance),
  pantoscopicAngle: toDecimalString(prescription.pantoscopicAngle),
  panoramicAngle: toDecimalString(prescription.panoramicAngle),
  type: prescription.personalizationType,
  frameType: prescription.frameType,
})

export function toPrescriptionListItem(
  prescription: PrescriptionWithPatient,
): PrescriptionListItem {
  return {
    id: prescription.id,
    number: prescription.number,
    prescriptionDate: prescription.prescriptionDate.toISOString().slice(0, 10),
    patient: toPatientSummary(prescription.patient),
  }
}

export function toPrescription(
  prescription: PrescriptionWithPatient,
): Prescription {
  return {
    ...toPrescriptionListItem(prescription),
    far: {
      od: toEyeMeasurement(
        prescription.farOdSphere,
        prescription.farOdCylinder,
        prescription.farOdAxis,
        prescription.farOdDnp,
        prescription.farOdHeight,
        prescription.farOdPrismValue,
        prescription.farOdPrismBase,
      ),
      oi: toEyeMeasurement(
        prescription.farOiSphere,
        prescription.farOiCylinder,
        prescription.farOiAxis,
        prescription.farOiDnp,
        prescription.farOiHeight,
        prescription.farOiPrismValue,
        prescription.farOiPrismBase,
      ),
    },
    near: {
      od: toEyeMeasurement(
        prescription.nearOdSphere,
        prescription.nearOdCylinder,
        prescription.nearOdAxis,
        prescription.nearOdDnp,
        prescription.nearOdHeight,
        prescription.nearOdPrismValue,
        prescription.nearOdPrismBase,
      ),
      oi: toEyeMeasurement(
        prescription.nearOiSphere,
        prescription.nearOiCylinder,
        prescription.nearOiAxis,
        prescription.nearOiDnp,
        prescription.nearOiHeight,
        prescription.nearOiPrismValue,
        prescription.nearOiPrismBase,
      ),
    },
    personalization: toPersonalization(prescription),
    ocularDiagnosis: prescription.ocularDiagnosis,
    refractiveDiagnosis: prescription.refractiveDiagnosis,
    treatment: prescription.treatment,
    observations: prescription.observations,
    createdAt: prescription.createdAt.toISOString(),
    updatedAt: prescription.updatedAt.toISOString(),
  }
}
