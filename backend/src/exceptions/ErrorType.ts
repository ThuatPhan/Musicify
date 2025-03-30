import { StatusCodes } from "http-status-codes";

export enum ErrorType {
  NOT_FOUND = "Not found",
  BAD_REQUEST = "Invalid input",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  CONFLICT = "Existed resource",
  INTERNAL_ERROR = "Internal server error",
}

export const ErrorStatus: Record<string, number> = {
  [ErrorType.NOT_FOUND]: StatusCodes.NOT_FOUND,
  [ErrorType.BAD_REQUEST]: StatusCodes.BAD_REQUEST,
  [ErrorType.UNAUTHORIZED]: StatusCodes.UNAUTHORIZED,
  [ErrorType.FORBIDDEN]: StatusCodes.FORBIDDEN,
  [ErrorType.CONFLICT]: StatusCodes.CONFLICT,
  [ErrorType.INTERNAL_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,
};
