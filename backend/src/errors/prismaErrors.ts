import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import AppError from "./appError";

const prismaErrorHandler = (
  err: Prisma.PrismaClientKnownRequestError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
   
    if (err.code === "P2002") {
      return next(new AppError("Unique constraint failed", 400));
    }

    
    if (err.code === "P2003") {
      return next(new AppError("Foreign key constraint failed", 400));
    }

    
    return next(new AppError("A database error occurred", 500));
  }

  
  next(err);
};

export default prismaErrorHandler;