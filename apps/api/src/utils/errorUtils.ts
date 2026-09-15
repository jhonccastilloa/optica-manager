import { Prisma } from "@/generated/prisma/client";

export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): { message: string; statusCode: number } => {
  const { code, meta } = err;

  switch (code) {
    case "P2002":
      return {
        statusCode: 400,
        message: `Ya existe un valor duplicado en el campo único: ${meta?.target}`,
      };
    case "P2003":
      return {
        statusCode: 400,
        message: `Violación de llave foránea en el campo: ${meta?.field_name}`,
      };
    case "P2025":
      return {
        statusCode: 404,
        message: `Registro no encontrado o no pudo ser eliminado de la tabla ${meta?.modelName}`,
      };
    case "P2014":
      return {
        statusCode: 400,
        message: `Registro duplicado en la relación: ${meta?.relation_name}`,
      };
    default:
      return {
        statusCode: 500,
        message: "Error desconocido de la base de datos.",
      };
  }
};
