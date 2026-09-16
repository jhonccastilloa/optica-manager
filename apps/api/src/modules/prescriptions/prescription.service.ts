import type {
  Prescription,
  PrescriptionCreateInput,
  PrescriptionListQuery,
  PrescriptionUpdateInput,
} from "@optica/contracts"
import { ERROR_CODES } from "@optica/contracts"
import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/config/db"
import AppError from "@/utils/AppError"
import { toPrescription, toPrescriptionListItem } from "./prescription.mapper"

const patientSelection = {
  id: true,
  firstName: true,
  lastName: true,
  dni: true,
  phone: true,
} as const

const includePatient = { patient: { select: patientSelection } } as const

const prescriptionNotFoundError = () =>
  new AppError("Receta no encontrada.", 404, {
    code: ERROR_CODES.RESOURCE_NOT_FOUND,
  })

const patientNotFoundError = () =>
  new AppError("Paciente no encontrado.", 404, {
    code: ERROR_CODES.RESOURCE_NOT_FOUND,
  })

const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`)

const toPrescriptionData = (
  input: PrescriptionCreateInput | PrescriptionUpdateInput,
) => ({
  patientId: input.patientId,
  prescriptionDate: toDate(input.prescriptionDate),

  farOdSphere: input.far.od.sphere,
  farOdCylinder: input.far.od.cylinder,
  farOdAxis: input.far.od.axis,
  farOdDnp: input.far.od.dnp,
  farOdHeight: input.far.od.height,
  farOdPrismValue: input.far.od.prism.value,
  farOdPrismBase: input.far.od.prism.base,

  farOiSphere: input.far.oi.sphere,
  farOiCylinder: input.far.oi.cylinder,
  farOiAxis: input.far.oi.axis,
  farOiDnp: input.far.oi.dnp,
  farOiHeight: input.far.oi.height,
  farOiPrismValue: input.far.oi.prism.value,
  farOiPrismBase: input.far.oi.prism.base,

  nearOdSphere: input.near.od.sphere,
  nearOdCylinder: input.near.od.cylinder,
  nearOdAxis: input.near.od.axis,
  nearOdDnp: input.near.od.dnp,
  nearOdHeight: input.near.od.height,
  nearOdPrismValue: input.near.od.prism.value,
  nearOdPrismBase: input.near.od.prism.base,

  nearOiSphere: input.near.oi.sphere,
  nearOiCylinder: input.near.oi.cylinder,
  nearOiAxis: input.near.oi.axis,
  nearOiDnp: input.near.oi.dnp,
  nearOiHeight: input.near.oi.height,
  nearOiPrismValue: input.near.oi.prism.value,
  nearOiPrismBase: input.near.oi.prism.base,

  vertexDistance: input.personalization.vertexDistance,
  pantoscopicAngle: input.personalization.pantoscopicAngle,
  panoramicAngle: input.personalization.panoramicAngle,
  personalizationType: input.personalization.type,
  frameType: input.personalization.frameType,

  ocularDiagnosis: input.ocularDiagnosis,
  refractiveDiagnosis: input.refractiveDiagnosis,
  treatment: input.treatment,
  observations: input.observations,
})

export const prescriptionService = {
  async list(query: PrescriptionListQuery) {
    const where: Prisma.PrescriptionWhereInput = {
      patientId: query.patientId,
    }

    if (query.q) {
      const number = /^\d+$/.test(query.q) ? Number(query.q) : undefined

      where.OR = [
        ...(number === undefined ? [] : [{ number }]),
        { patient: { firstName: { contains: query.q, mode: "insensitive" } } },
        { patient: { lastName: { contains: query.q, mode: "insensitive" } } },
        { patient: { dni: { contains: query.q } } },
      ]
    }

    const [prescriptions, total] = await prisma.$transaction([
      prisma.prescription.findMany({
        where,
        include: includePatient,
        orderBy: [{ prescriptionDate: "desc" }, { number: "desc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.prescription.count({ where }),
    ])

    return {
      items: prescriptions.map(toPrescriptionListItem),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    }
  },

  async getById(id: string): Promise<Prescription> {
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: includePatient,
    })

    if (!prescription) throw prescriptionNotFoundError()

    return toPrescription(prescription)
  },

  async create(input: PrescriptionCreateInput): Promise<Prescription> {
    const patient = await prisma.patient.findUnique({
      where: { id: input.patientId },
      select: { id: true },
    })

    if (!patient) throw patientNotFoundError()

    const prescription = await prisma.prescription.create({
      data: toPrescriptionData(input),
      include: includePatient,
    })

    return toPrescription(prescription)
  },

  async update(
    id: string,
    input: PrescriptionUpdateInput,
  ): Promise<Prescription> {
    const [prescription, patient] = await Promise.all([
      prisma.prescription.findUnique({ where: { id }, select: { id: true } }),
      prisma.patient.findUnique({ where: { id: input.patientId }, select: { id: true } }),
    ])

    if (!prescription) throw prescriptionNotFoundError()
    if (!patient) throw patientNotFoundError()

    const updatedPrescription = await prisma.prescription.update({
      where: { id },
      data: toPrescriptionData(input),
      include: includePatient,
    })

    return toPrescription(updatedPrescription)
  },
}
