import prisma from "../config/db";
import { OrderItemInput } from "../config/interfaces";

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
      },
    });

    return order;
  });
};

export const getUserOrders = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });

  return orders;
};

export const getOrderById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { userId, id: orderId },
    include: { items: true },
  });

  return order;
};

export const updateOrderWithItems = async (
  orderId: number,
  userId: number,
  data: { status?: string; addressId?: number; items?: OrderItemInput[] }
) => {
  return await prisma.$transaction(async (tx) => {
    const existingOrder = prisma.order.findUnique({
      where: { userId, id: orderId },
      include: { items: true },
    });

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

      const newTotal = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await tx.order.update({
        where: { id: orderId },
        data: { totalPrice: newTotal },
      });
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: data.status,
        addressId: data.addressId,
      },
      include: {
        items: true,
      },
    });
    return updatedOrder;
  });
};
