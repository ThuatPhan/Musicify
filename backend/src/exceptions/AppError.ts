import { ErrorType, ErrorStatus } from "@src/exceptions/ErrorType";

export class AppError extends Error {
  status: number;
  constructor(type: ErrorType, message?: string) {
    super(message ? message : type);
    this.status = ErrorStatus[type] || 500;
  }
}
