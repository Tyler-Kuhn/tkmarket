import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import catchFunction from "../errors/errMiddleware";
import AppError from "../errors/appError";


const secretKey: string = process.env.SECRET_KEY || "defaultSecretKey";

export const authenticateToken = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      const error = new AppError("Access Denied", 403);
      next(error);
    }

    if (token) {
      jwt.verify(token, secretKey, (err, user) => {
        if(err){
            const error = new AppError("Invalid Token", 403);
            next(error);
        }

        (req as any).user = user
        next()
      });
    }
  }
);
