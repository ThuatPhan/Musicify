import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "@src/exceptions/AppError";
import { ErrorType } from "@src/exceptions/ErrorType";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return next(
          new AppError(ErrorType.BAD_REQUEST, errorMessages[0].message)
        );
      }
      return next(new AppError(ErrorType.INTERNAL_ERROR));
    }
  };
}
