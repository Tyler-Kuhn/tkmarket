import { Prisma } from "@prisma/client";
import prisma from "../config/db";
import { OrderItems } from "@prisma/client";

// CREATE
export const createOrderWithItems = async (
  userId: number,
  addressId: number,
  items: OrderItems[]
) => {
  return await prisma.$transaction(async (tx: { product: { findMany: (arg0: { where: { id: { in: any[]; }; }; select: { id: boolean; price: boolean; }; }) => any; }; order: { create: (arg0: { data: { userId: number; addressId: number; totalPrice: number; items: { create: { productId: any; quantity: any; price: number; }[]; }; }; include: { items: boolean; address: boolean; }; }) => any; }; }) => {
    
    const productIds = items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

   
    const priceMap = new Map<number, number>();
    for (const product of products) {
      priceMap.set(product.id, Number(product.price));
    }

    
    const itemsWithPrice = items.map((item) => {
      const price = priceMap.get(item.productId);
      if (price === undefined) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
      };
    });

    const totalPrice = itemsWithPrice.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        addressId,
        totalPrice,
        items: {
          create: itemsWithPrice,
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
    items?: OrderItems[];
  }
) => {
  return await prisma.$transaction(async (tx: { order: { findUnique: (arg0: { where: { id: number; }; include: { items: boolean; }; }) => any; update: (arg0: { where: { id: number; }; data: { status: string | undefined; addressId: number | undefined; totalPrice: any; }; include: { items: boolean; address: boolean; }; }) => any; }; orderItems: { findMany: (arg0: { where: { orderId: number; }; }) => any; delete: (arg0: { where: { id: any; }; }) => any; update: (arg0: { where: { id: any; }; data: { quantity: any; price: any; }; }) => any; createMany: (arg0: { data: { orderId: number; productId: any; quantity: any; price: any; }[]; }) => any; }; }) => {
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder || existingOrder.userId !== userId) {
      throw new Error("Order not found or unauthorized.");
    }

    let newTotalPrice = existingOrder.totalPrice;

    if (data.items) {
      const existingItems = await tx.orderItems.findMany({
        where: { orderId },
      });

      const existingMap = new Map(
  (existingItems as OrderItems[]).map((item) => [`${item.productId}`, item])
);

      const newMap = new Map(
        data.items.map((item) => [`${item.productId}`, item])
      );

      const toCreate = data.items.filter(
        (item) => !existingMap.has(`${item.productId}`)
      );
      const toUpdate = data.items.filter((item) => {
        const existing = existingMap.get(`${item.productId}`);
        return (
          existing &&
          (existing.quantity !== item.quantity || existing.price !== item.price)
        );
      });
      const toDelete = existingItems.filter(
        (item: { productId: any; }) => !newMap.has(`${item.productId}`)
      );

      for (const item of toDelete) {
        await tx.orderItems.delete({
          where: { id: item.id },
        });
      }

      for (const item of toUpdate) {
        const existing = existingMap.get(`${item.productId}`);
        await tx.orderItems.update({
          where: { id: existing!.id },
          data: {
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      if (toCreate.length > 0) {
        await tx.orderItems.createMany({
          data: toCreate.map((item) => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }
      newTotalPrice = new Prisma.Decimal(
        data.items.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        )
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
export const deleteOrderWithItems = async (orderId: number, userId: number) => {
  return await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder || existingOrder.userId !== userId) {
      throw new Error("Order not found or unauthorized.");
    }

    await tx.order.delete({
      where: { id: orderId },
    });

    return { message: "Order deleted successfully." };
  });
};
