import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchFunction from "../errors/errMiddleware";
import AppError from "../errors/appError";

const secretKey: string = process.env.SECRET_KEY || "defaultSecretKey";

export const authenticateToken = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      const error = new AppError("Access Denied", 403);
      next(error);
    }

    jwt.verify(token as string, secretKey, (err, tokenPayload) => {
      if (err) {
        const error = new AppError("Invalid Token", 403);
        return next(error);
      }

      const payload = tokenPayload as JwtPayload;


      req.user = { userId: payload.userId as number };
      return next();
    });
  }
);
