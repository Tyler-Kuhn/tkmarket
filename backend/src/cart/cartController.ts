import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";
import AppError from "../errors/appError";
import {
  getUserCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearUserCart,
  createCartIfNotExists,
} from "./cartService";

export const getCart = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("Unauthorized", 403));

    const cart = await getUserCart(userId);
    res.status(200).json(cart);
  }
);

export const createCart = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("Unauthorized", 403));

    const cart = await createCartIfNotExists(userId);
    res.status(201).json(cart);
  }
);

export const addToCart = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("Unauthorized", 403));

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return next(new AppError("Product ID and quantity are required", 400));
    }

    const item = await addItemToCart(userId, productId, quantity);
    res.status(201).json(item);
  }
);

export const updateCartItem = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartItemId = parseInt(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return next(new AppError("Quantity must be at least 1", 400));
    }

    const updatedItem = await updateCartItemQuantity(cartItemId, quantity);
    res.status(200).json(updatedItem);
  }
);

export const removeFromCart = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const cartItemId = parseInt(req.params.id);

    await removeCartItem(cartItemId);
    res.status(200).json("Item removed from cart");
  }
);

export const clearCart = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) return next(new AppError("Unauthorized", 403));

    await clearUserCart(userId);
    res.status(200).json("Cart cleared");
  }
);
