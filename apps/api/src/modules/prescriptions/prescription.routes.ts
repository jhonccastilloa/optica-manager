import { Router } from "express"
import { prescriptionController } from "./prescription.controller"

const prescriptionRouter = Router()

prescriptionRouter.get("/", prescriptionController.list)
prescriptionRouter.post("/", prescriptionController.create)
prescriptionRouter.get("/:id", prescriptionController.getById)
prescriptionRouter.patch("/:id", prescriptionController.update)

export default prescriptionRouter
