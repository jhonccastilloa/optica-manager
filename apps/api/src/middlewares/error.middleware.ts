import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { handlePrismaError } from "../utils/errorUtils";
import { ENV } from "@/config/env";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { logger } from "@/utils/logger";
import { ERROR_CODES } from "@optica/contracts";

const createErrorResponse = (
  err: AppError,
  requestId: string | undefined,
  includeStack: boolean,
) => ({
  status: err.status,
  code: err.code,
  message: err.isOperational
    ? err.message
    : "Algo salió mal. Por favor intente más tarde.",
  ...(err.details !== undefined ? { details: err.details } : {}),
  ...(requestId ? { requestId } : {}),
  ...(includeStack && err.stack ? { stack: err.stack } : {}),
});

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) return next(err);

  let error = err instanceof AppError
    ? err
    : new AppError(
        err instanceof Error ? err.message : "Error interno del servidor.",
        500,
        { isOperational: false, cause: err },
      );

  // Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { message, statusCode, code } = handlePrismaError(err);
    error = new AppError(message, statusCode, { code, cause: err });
  }

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError(
      "No se pudieron validar los datos enviados.",
      400,
      { code: ERROR_CODES.DATABASE_VALIDATION_ERROR, cause: err },
    );
  }

  // Prisma Unknown
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    error = new AppError(
      "Error desconocido al interactuar con la base de datos",
      500,
      { code: ERROR_CODES.DATABASE_ERROR, cause: err },
    );
  }
  // Zod Validation Error
  if (err instanceof ZodError) {
    error = new AppError("Hay errores de validación.", 400, {
      code: ERROR_CODES.VALIDATION_ERROR,
      details: {
        fields: err.issues.map((issue) => ({
          path: issue.path,
          code: issue.code,
          message: issue.message,
        })),
      },
      cause: err,
    });
  }

  const requestId = res.getHeader("x-request-id")?.toString();
  const isServerError = error.statusCode >= 500;
  const logMessage = `[${requestId ?? "no-request-id"}] ${error.code}: ${error.message}`;

  if (isServerError) {
    logger.error(logMessage);
  } else {
    logger.warn(logMessage);
  }

  return res
    .status(error.statusCode)
    .json(createErrorResponse(error, requestId, ENV.NODE_ENV === "dev"));
};
