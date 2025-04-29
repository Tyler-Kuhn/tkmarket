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
