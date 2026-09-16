import { Router } from "express"
import { patientController } from "./patient.controller"

const patientRouter = Router()

patientRouter.get("/", patientController.list)
patientRouter.post("/", patientController.create)
patientRouter.get("/:id", patientController.getById)
patientRouter.patch("/:id", patientController.update)

export default patientRouter
