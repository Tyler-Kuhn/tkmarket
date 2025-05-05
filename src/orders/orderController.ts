import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";
import AppError from "../errors/appError";
import {
  createOrderWithItems,
  getUserOrders,
  getOrderById,
  updateOrderWithItems,
  deleteOrderWithItems,
} from "./orderService";

export const addOrder = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.user?.userId);
    const { addressId, items } = req.body;

    if (!userId) {
      const error = new AppError("Unautorized", 403);
      next(error);
    }

    if (!addressId || items || !Array.isArray(items) || items.length === 0) {
      const error = new AppError("Missing addressId or items", 400);
      next(error);
    }

    const order = await createOrderWithItems(
      userId,
      parseInt(addressId),
      items
    );
    res.status(201).json(order);
  }
);

export const getOrders = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.user?.userId);

    if (!userId) {
      const error = new AppError("Unautorized", 403);
      next(error);
    }

    const orders = await getUserOrders(userId);

    res.status(200).json(orders);
  }
);

export const getOrder = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.user?.userId);
    const orderId = parseInt(req.params.id);

    if (!userId) {
      const error = new AppError("Unautorized", 403);
      next(error);
    }

    const order = await getOrderById(userId, orderId);

    res.status(200).json(order);
  }
);

export const updateOrder = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.user?.userId);
    const orderId = parseInt(req.params.id);

    if (!userId) {
      const error = new AppError("Unautorized", 403);
      next(error);
    }

    if (!orderId || isNaN(orderId)) {
      const error = new AppError("Invalid order ID", 400);
      next(error);
    }

    const { status, addressId, items } = req.body;

    const updatedOrder = await updateOrderWithItems(orderId, userId, {
      status,
      addressId,
      items,
    });

    res.status(200).json(updatedOrder);
  }
);

export const deleteOrder = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const orderId = parseInt(req.params.id);

    if (!userId) {
      const error = new AppError("Unautorized", 403);
      next(error);
    }

    if (!orderId || isNaN(orderId)) {
      const error = new AppError("Invalid order ID", 400);
      next(error);
    }

    const result = await deleteOrderWithItems(orderId, userId);

    res.status(200).json(result);
  }
);
