import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchFunction from "../errors/errMiddleware";
import { User } from "../config/interfaces";
import AppError from "../errors/appError";
import dotenv from "dotenv";

dotenv.config();
const secretKey: string = process.env.SECRET_KEY || "defaultSecretKey";
const saltRounds = 10;

export const regiterUser = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      const error = new AppError("Somthing went wrong...", 500);
      return next(error);
    }
    res.status(201).json(newUser);
  }
);

export const userLogin = catchFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new AppError("Invalid email", 400);
      return next(error);
    }
    if (user?.password) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        const error = new AppError("Password does not match", 400);
        return next(error);
      }
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    
    if (!token){
      const error = new AppError("Something went wrong", 500);
      return next(error);
    }

    res.json({ token });
  }
);
