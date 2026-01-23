'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOrder(items: any[], total: number, paymentMethod: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Not authenticated" };
  }

  // Validate input parameters
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Invalid items array" };
  }

  if (typeof total !== 'number' || total <= 0 || total > 100000) {
    return { error: "Invalid total amount" };
  }

  const allowedPaymentMethods = ['paypal', 'payoneer', 'direct_vendor', 'wise', 'btc', 'binance', 'usdt'];
  if (!allowedPaymentMethods.includes(paymentMethod.toLowerCase())) {
    return { error: "Invalid payment method" };
  }

  try {
    // Validate each item against database
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
        return { error: "Invalid item data" };
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0 || item.quantity > 100) {
        return { error: "Invalid item quantity" };
      }

      if (typeof item.price !== 'number' || item.price <= 0 || item.price > 10000) {
        return { error: "Invalid item price" };
      }

      // Check if product exists in database
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, price: true }
      });

      if (!product) {
        return { error: `Product ${item.id} not found` };
      }

      // Verify price hasn't been tampered with (allow 1% variance for rounding)
      const priceVariance = Math.abs(product.price - item.price) / product.price;
      if (priceVariance > 0.01) {
        return { error: `Price mismatch for product ${item.id}` };
      }

      validatedItems.push({
        productId: item.id,
        quantity: item.quantity,
        price: product.price, // Use database price
      });

      calculatedTotal += product.price * item.quantity;
    }

    // Verify total matches calculated total (allow 1% variance for rounding)
    const totalVariance = Math.abs(calculatedTotal - total) / calculatedTotal;
    if (totalVariance > 0.01) {
      return { error: "Total amount mismatch" };
    }

    // Create order with validated data
    const order = await prisma.order.create({
      data: {
        userId: parseInt(session.user.id),
        total: calculatedTotal,
        currency: "USD",
        status: "PENDING", // Changed to PENDING for manual payment verification
        paymentMethod: paymentMethod.toLowerCase(),
        items: {
          create: validatedItems,
        },
      },
    });

    // Note: Stock management removed as Product model doesn't have stock field
    // In a production environment, you would either:
    // 1. Add a stock field to the Product model
    // 2. Implement stock management in a separate Stock model
    // 3. Handle inventory through a different system

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Order creation error:', error);
    return { error: "Failed to create order" };
  }
}

export async function getOrders() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      }
    });
    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(id: number, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/orders');
    return { success: true, order };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { error: "Failed to update order status" };
  }
}
