import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../errors/appError";

const secretKey: string = process.env.SECRET_KEY || "defaultSecretKey";
const saltRounds = 10;

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });


  const user = await prisma.user.findUnique({
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
  const user = await prisma.user.findUnique({
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

export const getUserById = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
};

export const updateUserById = async (
  userId: number,
  name?: string,
  email?: string
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });
};
