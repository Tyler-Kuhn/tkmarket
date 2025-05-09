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
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          const error = new AppError("Invalid Token", 403);
          return next(error);
        }
      
        
        if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
          req.user = { userId: decoded.userId as number };
          return next();
        }
      
        const error = new AppError("Invalid Token Payload", 403);
        next(error);
      });
    }
  }
);
