import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../errors/appError";
import { User } from "../config/interfaces";

const secretKey: string = process.env.SECRET_KEY || "defaultSecretKey";
const saltRounds = 10;

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!newUser) {
    throw new AppError("Something went wrong", 500);
  }

  const user: User | null = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("Invalid Email", 400);
  }

  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

  return token;
};

export const loginUser = async (email: string, password: string) => {
  const user: User | null = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("Email doesn't match an account", 400);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError("Password doesn't match", 400);
  }

  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

  return token;
};

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
};

export const updateUserById = async (
  userId: string,
  name?: string,
  email?: string
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });
};
