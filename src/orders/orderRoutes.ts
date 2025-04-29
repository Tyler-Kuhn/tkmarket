import express from "express";
import { addOrder } from "./orderController";
import { authenticateToken } from "../users/userAuthMiddleware";

const router = express.Router();

router.post("/orders", authenticateToken, addOrder);

export default router;
