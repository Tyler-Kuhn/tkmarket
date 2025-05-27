import { Request, Response, NextFunction } from "express";
import catchFunction from "../errors/errMiddleware";

import AppError from "../errors/appError";

import {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
} from "./userAuthServices";

export const register = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new AppError("Missing required fields", 400);
      return next(error);
    }

    const newUserToken = await registerUser(name, email, password);

    if (!newUserToken) {
      const error = new AppError("Something went wrong", 500);
      return next(error);
    }
    res.status(201).json({newUserToken});
  }
);

export const login = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new AppError("Missing email or password", 400);
      return next(error);
    }

    const token = await loginUser(email, password);

    if (!token) {
      const error = new AppError("Invalid email or password", 400);
      return next(error);
    }

    res.status(200).json({ token });
  }
);

export const getUser = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    if (!userId) {
      const error = new AppError("Unauthorized", 401);
      return next(error);
    }

    const user = await getUserById(userId);

    if (!user) {
      const error = new AppError("User not found", 404);
      return next(error);
    }

    res.status(200).json(user);
  }
);

export const updateUser = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    if (!userId) {
      const error = new AppError("Unauthorized", 401);
      return next(error);
    }
    
    const { name, email } = req.body;

    const updatedUser = await updateUserById(userId, name, email);


    res.status(201).json(updatedUser);
  }
);
