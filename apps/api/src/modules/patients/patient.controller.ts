import type { Request, Response } from "express"
import {
  patientCreateSchema,
  patientIdSchema,
  patientListQuerySchema,
  patientUpdateSchema,
} from "@optica/contracts"
import { z } from "zod"
import { patientService } from "./patient.service"

const patientParamsSchema = z.object({ id: patientIdSchema })

export const patientController = {
  async list(req: Request, res: Response) {
    const query = patientListQuerySchema.parse(req.query)
    const response = await patientService.list(query)

    res.json(response)
  },

  async getById(req: Request, res: Response) {
    const { id } = patientParamsSchema.parse(req.params)
    const patient = await patientService.getById(id)

    res.json(patient)
  },

  async create(req: Request, res: Response) {
    const input = patientCreateSchema.parse(req.body)
    const patient = await patientService.create(input)

    res.status(201).json(patient)
  },

  async update(req: Request, res: Response) {
    const { id } = patientParamsSchema.parse(req.params)
    const input = patientUpdateSchema.parse(req.body)
    const patient = await patientService.update(id, input)

    res.json(patient)
  },
}
