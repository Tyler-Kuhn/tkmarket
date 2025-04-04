import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";

import AppError from "../errors/appError";

import { registerUser, loginUser } from "./userAuthServices";

export const register = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Incoming request:", req.body);
    const { name, email, password } = req.body;

    const newUser = await registerUser(name, email, password);

    if (!newUser) {
      const error = new AppError("Something went wrong", 500);
      next(error);
    }
    res.status(201).json(newUser);
  }
);

export const login = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const token = await loginUser(email, password);

    if (!token) {
      const error = new AppError("Invalid email or password", 400);
      next(error);
    }

    res.json({ token });
  }
);
