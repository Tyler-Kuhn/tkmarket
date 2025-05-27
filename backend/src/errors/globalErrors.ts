import { Request, Response, NextFunction } from "express";
import AppError from "./appError";

export default function globalErrorHandler(
  err: AppError | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Global error handler:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({
    error: "Something went wrong on the server",
  });
}