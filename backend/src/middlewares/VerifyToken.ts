import { config } from "@src/configs/AppConfig";
import { AppError } from "@src/exceptions/AppError";
import { ErrorType } from "@src/exceptions/ErrorType";
import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";

const jwtCheck = auth({
  audience: config.AUTH0_AUDIENCE,
  issuerBaseURL: config.AUTH0_DOMAIN,
  tokenSigningAlg: "RS256",
});

export function checkAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const hasAccessToken = req.headers["authorization"]?.split(" ")[1];
  if (!hasAccessToken) {
    return next(new AppError(ErrorType.UNAUTHORIZED));
  }

  jwtCheck(req, res, (err: any) => {
    if (err) {
      return next(new AppError(ErrorType.UNAUTHORIZED));
    }
    next();
  });
}

export function checkPermission(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1]!;
      const decodedToken = jwt.decode(token) as any;
      const permissions: string[] = decodedToken?.permissions || [];
      if (!permissions.includes(requiredPermission)) {
        return next(new AppError(ErrorType.FORBIDDEN));
      }
      next();
    } catch (error) {
      return next(new AppError(ErrorType.FORBIDDEN));
    }
  };
}
