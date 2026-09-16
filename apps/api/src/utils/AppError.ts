import { ERROR_CODES, type ErrorCode } from "@optica/contracts";

export type AppErrorOptions = {
  code?: ErrorCode;
  details?: unknown;
  cause?: unknown;
  isOperational?: boolean;
};

const getDefaultCode = (statusCode: number) => {
  if (statusCode === 400) return ERROR_CODES.BAD_REQUEST;
  if (statusCode === 404) return ERROR_CODES.NOT_FOUND;
  if (statusCode === 409) return ERROR_CODES.CONFLICT;
  if (statusCode === 422) return ERROR_CODES.UNPROCESSABLE_ENTITY;
  if (statusCode >= 500) return ERROR_CODES.INTERNAL_SERVER_ERROR;

  return ERROR_CODES.REQUEST_ERROR;
};

export default class AppError extends Error {
  readonly statusCode: number;
  readonly status: "fail" | "error";
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    options: AppErrorOptions | boolean = {},
  ) {
    const normalizedOptions =
      typeof options === "boolean"
        ? { isOperational: options }
        : options;

    super(message, { cause: normalizedOptions.cause });
    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.code = normalizedOptions.code ?? getDefaultCode(statusCode);
    this.details = normalizedOptions.details;
    this.isOperational = normalizedOptions.isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }
}
