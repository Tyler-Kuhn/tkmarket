import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";
import AppError from "../errors/appError";
import { createOrderWithItems } from "./orderService";

export const addOrder = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.userId;
    const { addressId, items } = req.body;

    if (!addressId || items || !Array.isArray(items) || items.length === 0) {
      const error = new AppError("Missing addressId or items", 400);
      next(error);
    }

    const order = await createOrderWithItems(
      parseInt(userId),
      parseInt(addressId),
      items
    );
    res.status(201).json(order);
  }
);
