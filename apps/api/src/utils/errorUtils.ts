import { Prisma } from "@/generated/prisma/client";
import { ERROR_CODES, type ErrorCode } from "@optica/contracts";

export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): { message: string; statusCode: number; code: ErrorCode } => {
  const { code } = err;

  switch (code) {
    case "P2002":
      return {
        statusCode: 409,
        code: ERROR_CODES.DUPLICATE_RESOURCE,
        message: "Ya existe un registro con los datos proporcionados.",
      };
    case "P2003":
      return {
        statusCode: 409,
        code: ERROR_CODES.RELATION_CONFLICT,
        message: "No se puede completar la operación por una relación existente.",
      };
    case "P2025":
      return {
        statusCode: 404,
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "El registro solicitado no existe.",
      };
    case "P2014":
      return {
        statusCode: 409,
        code: ERROR_CODES.RELATION_CONFLICT,
        message: "La operación no es válida para la relación solicitada.",
      };
    default:
      return {
        statusCode: 500,
        code: ERROR_CODES.DATABASE_ERROR,
        message: "Error desconocido de la base de datos.",
      };
  }
};
