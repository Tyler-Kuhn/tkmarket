import express from "express";
import { register, login, getUser } from "./userAuthController";
import { authenticateToken } from "./userAuthMiddleware";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/user", authenticateToken, getUser);

export default router