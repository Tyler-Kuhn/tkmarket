import prisma from "../config/db";
import AppError from "../errors/appError";

export const createProduct = async (
  name: string,
  price: string,
  description: string
) => {
  const newProduct = await prisma.product.create({
    data: { name, price, description },
  });

  if (!newProduct) {
    throw new AppError("Somthing went wrong", 500);
  }

  return newProduct;
};

export const getAllProducts = async () => {
  const allProducts = await prisma.product.findMany();

  if (!allProducts) {
    throw new AppError("Something went wrong", 500);
  }

  return allProducts;
};

export const getProductByName = async (name: string) => {
  const product = await prisma.product.findMany({
    where: { name },
  });

  return product;
};

export const updateProduct = async (
  id: string,
  name?: string,
  price?: string,
  description?: string,
  reviews?: string,
  ratings?: string
) => {
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { name, price, description, reviews, ratings},
  });

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const deletedProduct = await prisma.product.delete({
    where: { id: parseInt(id) },
  });

  return deletedProduct;
};
