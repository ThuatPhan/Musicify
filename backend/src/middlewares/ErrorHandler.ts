import ApiResponse from "@src/dtos/ApiResponse";
import { AppError } from "@src/exceptions/AppError";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (err instanceof AppError) {
    res.status(err.status).json(ApiResponse.error(err.message, err.status));
    return;
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.error(
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
};
