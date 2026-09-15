import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { handlePrismaError } from "../utils/errorUtils";
import { ENV } from "@/config/env";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";

const sendErrorDev = (err: AppError, res: Response) => {
  console.error("💥 ERROR", err);

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error("💥 ERROR NO CONTROLADO", err);

  return res.status(500).json({
    status: "error",
    message: "Algo salió mal. Por favor intente más tarde.",
  });
};

export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error =
    err instanceof AppError ? err : new AppError(err.message, 500, false);

  // Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { message, statusCode } = handlePrismaError(err);
    error = new AppError(message, statusCode);
  }

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError(
      "Error de validación de datos: " + err.message.split("\n")[1],
      400,
    );
  }

  // Prisma Unknown
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    error = new AppError(
      "Error desconocido al interactuar con la base de datos",
      500,
    );
  }
  // Zod Validation Error
  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => {
      return `${issue.message}`;
    });
    error = new AppError(messages.join(", "), 400);
  }
  if (ENV.NODE_ENV === "dev") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
