import express from "express";
import { addOrder, getOrders, getOrder, updateOrder, deleteOrder } from "./orderController";
import { authenticateToken } from "../users/userAuthMiddleware";

const router = express.Router();

router.use(authenticateToken);

router.post("/orders", addOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;
