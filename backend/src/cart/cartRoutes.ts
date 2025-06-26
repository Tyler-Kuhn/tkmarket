import express from "express";
import {
  getCart,
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cartController";
import { authenticateToken } from "../users/userAuthMiddleware";

const router = express.Router();

router.use(authenticateToken);

router.post("/cart/create", createCart);

router.get("/cart", getCart);

router.post("/cart", addToCart);

router.patch("/cart/:id", updateCartItem);

router.delete("/cart/:id", removeFromCart);

router.delete("/cart", clearCart);

export default router;
