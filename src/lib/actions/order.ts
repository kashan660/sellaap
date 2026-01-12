'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder(items: any[], total: number, paymentMethod: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: parseInt(session.user.id),
        total: total,
        currency: "USD",
        status: "PENDING", // Changed to PENDING for manual payment verification
        paymentMethod: paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create order" };
  }
}
