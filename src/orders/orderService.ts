import { Prisma } from "@prisma/client";
import prisma from "../config/db";
import { OrderItemInput } from "../config/interfaces";

// CREATE
export const createOrderWithItems = async (
  userId: number,
  addressId: number,
  items: OrderItemInput[]
) => {
  return await prisma.$transaction(async (tx) => {
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        addressId,
        totalPrice,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    return order;
  });
};

// READ
export const getUserOrders = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true,
    },
    orderBy: { orderedAt: "desc" },
  });
};

export const getOrderById = async (userId: number, orderId: number) => {
  return await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      address: true,
    },
  });
};

// UPDATE
export const updateOrderWithItems = async (
  orderId: number,
  userId: number,
  data: {
    status?: string;
    addressId?: number;
    items?: OrderItemInput[];
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder || existingOrder.userId !== userId) {
      throw new Error("Order not found or unauthorized.");
    }

    let newTotalPrice = existingOrder.totalPrice;

    if (data.items) {
      await tx.orderItems.deleteMany({
        where: { orderId },
      });

      await tx.orderItems.createMany({
        data: data.items.map((item) => ({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      newTotalPrice = new Prisma.Decimal(
        data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: data.status,
        addressId: data.addressId,
        totalPrice: newTotalPrice,
      },
      include: {
        items: true,
        address: true,
      },
    });

    return updatedOrder;
  });
};

// DELETE
export const deleteOrderWithItems = async (
  orderId: number,
  userId: number
) => {
  return await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder || existingOrder.userId !== userId) {
      throw new Error("Order not found or unauthorized.");
    }

    await tx.orderItems.deleteMany({
      where: { orderId },
    });

    await tx.order.delete({
      where: { id: orderId },
    });

    return { message: "Order deleted successfully." };
  });
};
