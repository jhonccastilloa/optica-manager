import type { Request, Response } from "express"
import {
  prescriptionCreateSchema,
  prescriptionListQuerySchema,
  prescriptionUpdateSchema,
} from "@optica/contracts"
import { z } from "zod"
import { prescriptionService } from "./prescription.service"

const prescriptionParamsSchema = z.object({ id: z.uuid() })

export const prescriptionController = {
  async list(req: Request, res: Response) {
    const query = prescriptionListQuerySchema.parse(req.query)
    const response = await prescriptionService.list(query)

    res.json(response)
  },

  async getById(req: Request, res: Response) {
    const { id } = prescriptionParamsSchema.parse(req.params)
    const prescription = await prescriptionService.getById(id)

    res.json(prescription)
  },

  async create(req: Request, res: Response) {
    const input = prescriptionCreateSchema.parse(req.body)
    const prescription = await prescriptionService.create(input)

    res.status(201).json(prescription)
  },

  async update(req: Request, res: Response) {
    const { id } = prescriptionParamsSchema.parse(req.params)
    const input = prescriptionUpdateSchema.parse(req.body)
    const prescription = await prescriptionService.update(id, input)

    res.json(prescription)
  },
}
