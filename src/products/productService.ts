import prisma from "../config/db";

export const createProduct = async (
  name: string,
  price: string,
  description: string
) => {
  const newProduct = await prisma.product.create({
    data: { name, price, description },
  });


  return newProduct;
};

export const getAllProducts = async () => {
  const allProducts = await prisma.product.findMany();

  return allProducts;
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findMany({
    where: { id },
  });

  return product;
};

export const updateProduct = async (
  id: number,
  name?: string,
  price?: string,
  description?: string,
  reviews?: string,
  ratings?: string
) => {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, price, description, reviews, ratings},
  });

  return updatedProduct;
};

export const deleteProduct = async (id: number) => {
  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  return deletedProduct;
};
