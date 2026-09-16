import type {
  Patient,
  PatientCreateInput,
  PatientListQuery,
  PatientUpdateInput,
} from "@optica/contracts"
import { ERROR_CODES } from "@optica/contracts"
import { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/config/db"
import AppError from "@/utils/AppError"
import { toPatient } from "./patient.mapper"

const notFoundError = () =>
  new AppError("Paciente no encontrado.", 404, {
    code: ERROR_CODES.RESOURCE_NOT_FOUND,
  })

export const patientService = {
  async list(query: PatientListQuery) {
    const where: Prisma.PatientWhereInput = {}

    if (query.q) {
      const nameTokens = query.q.split(/\s+/).filter(Boolean)

      where.OR = [
        {
          AND: nameTokens.map((token) => ({
            OR: [
              { firstName: { contains: token, mode: "insensitive" } },
              { lastName: { contains: token, mode: "insensitive" } },
            ],
          })),
        },
        { dni: { contains: query.q } },
        { phone: { contains: query.q } },
      ]
    }

    const [patients, total] = await prisma.$transaction([
      prisma.patient.findMany({
        where,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.patient.count({ where }),
    ])

    return {
      items: patients.map(toPatient),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    }
  },

  async getById(id: string): Promise<Patient> {
    const patient = await prisma.patient.findUnique({ where: { id } })

    if (!patient) throw notFoundError()

    return toPatient(patient)
  },

  async create(input: PatientCreateInput): Promise<Patient> {
    const patient = await prisma.patient.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        dni: input.dni ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        reference: input.reference ?? null,
      },
    })

    return toPatient(patient)
  },

  async update(id: string, input: PatientUpdateInput): Promise<Patient> {
    const existingPatient = await prisma.patient.findUnique({ where: { id } })

    if (!existingPatient) throw notFoundError()

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        dni: input.dni ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        reference: input.reference ?? null,
      },
    })

    return toPatient(patient)
  },
}
