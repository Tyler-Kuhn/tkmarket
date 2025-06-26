import prisma from "../config/db";
import { Cart, CartItem } from "@prisma/client";

export const getUserCart = async (userId: number): Promise<Cart | null> => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const createCartIfNotExists = async (userId: number): Promise<Cart> => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
};

export const addItemToCart = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<CartItem> => {
  const cart = await createCartIfNotExists(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      price: parseFloat(product.price),
    },
  });
};

export const updateCartItem = async (
  cartItemId: number,
  quantity: number
): Promise<CartItem> => {
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

export const removeCartItem = async (cartItemId: number): Promise<CartItem> => {
  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const clearUserCart = async (userId: number): Promise<void> => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
