'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getPaddleMapByProductId, syncProductToPaddleCatalog } from "@/lib/paddle-catalog";

function getPaddleApiBaseUrl() {
  const env = (process.env.PADDLE_ENV || "sandbox").toLowerCase();
  return env === "live"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";
}

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

  const allowedPaymentMethods = ['paypal', 'payoneer', 'direct_vendor', 'wise', 'btc', 'binance', 'usdt', 'paddle'];
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

export async function createPaddleCheckout(orderId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Not authenticated" };
  }

  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) {
    return { error: "Paddle is not configured (missing PADDLE_API_KEY)." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, email: true } },
      items: { select: { productId: true, quantity: true } },
    },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  const sessionUserId = Number(session.user.id);
  if (session.user.role !== "ADMIN" && order.userId !== sessionUserId) {
    return { error: "Unauthorized" };
  }

  const mappingEntries = await Promise.all(
    order.items.map(async (item) => {
      let map = await getPaddleMapByProductId(item.productId);
      if (!map) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, description: true, price: true, currency: true },
        });
        if (product) {
          try {
            await syncProductToPaddleCatalog(product);
            map = await getPaddleMapByProductId(item.productId);
          } catch (syncError) {
            console.error(`Paddle auto-sync failed for product ${item.productId}:`, syncError);
          }
        }
      }
      return [item.productId, map?.paddlePriceId || ""] as const;
    })
  );
  const priceMap = Object.fromEntries(mappingEntries) as Record<number, string>;
  const missingMappings = order.items.filter((item) => !priceMap[item.productId]);
  if (missingMappings.length > 0) {
    return {
      error: `Missing Paddle sync for product IDs: ${missingMappings.map((i) => i.productId).join(", ")}. Sync products in Admin > Products.`,
    };
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${paddleApiKey}`,
    },
    body: JSON.stringify({
      items: order.items.map((item) => ({
        price_id: priceMap[item.productId],
        quantity: item.quantity,
      })),
      customer: order.user?.email ? { email: order.user.email } : undefined,
      custom_data: {
        orderId: String(order.id),
      },
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.error?.detail || payload?.error?.message || "Failed to create Paddle transaction";
    return { error: detail };
  }

  const checkoutUrl = payload?.data?.checkout?.url;
  if (!checkoutUrl) {
    return { error: "Paddle transaction created but no checkout URL returned." };
  }

  return {
    success: true,
    checkoutUrl,
    transactionId: payload?.data?.id || null,
  };
}

export async function createDirectPaddlePaymentLink(input: {
  productId: number;
  quantity: number;
  customerEmail?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) {
    return { error: "Paddle is not configured (missing PADDLE_API_KEY)." };
  }

  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      currency: true,
    },
  });

  if (!product) {
    return { error: "Product not found." };
  }

  if (!Number.isInteger(input.quantity) || input.quantity <= 0 || input.quantity > 100) {
    return { error: "Quantity must be between 1 and 100." };
  }

  const email = input.customerEmail?.trim();
  let map = await getPaddleMapByProductId(product.id);
  if (!map) {
    try {
      await syncProductToPaddleCatalog({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
      });
      map = await getPaddleMapByProductId(product.id);
    } catch (syncError) {
      console.error(`Paddle auto-sync failed for product ${product.id}:`, syncError);
    }
  }
  const priceId = map?.paddlePriceId;
  if (!priceId) {
    return { error: `Could not sync product ${product.id} to Paddle. Check Paddle setup (default payment link, key permissions) and try again.` };
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${paddleApiKey}`,
    },
    body: JSON.stringify({
      items: [
        {
          price_id: priceId,
          quantity: input.quantity,
        },
      ],
      customer: email ? { email } : undefined,
      custom_data: {
        source: "admin-direct-link",
        productId: String(product.id),
        productSlug: product.slug,
      },
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.error?.detail || payload?.error?.message || "Failed to create Paddle transaction";
    return { error: detail };
  }

  const checkoutUrl = payload?.data?.checkout?.url;
  if (!checkoutUrl) {
    return { error: "Paddle transaction created but no checkout URL returned." };
  }

  return {
    success: true,
    checkoutUrl,
    transactionId: payload?.data?.id || null,
    productName: product.name,
  };
}

export async function createCustomGameOrderCheckout(input: {
  email: string;
  budgetUsd: number;
  projectBrief: string;
}) {
  const paddleApiKey = process.env.PADDLE_API_KEY;
  if (!paddleApiKey) {
    return { error: "Paddle is not configured (missing PADDLE_API_KEY)." };
  }

  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  if (!Number.isFinite(input.budgetUsd) || input.budgetUsd < 2000 || input.budgetUsd > 50000) {
    return { error: "Budget must be between USD 2,000 and USD 50,000." };
  }

  const projectBrief = input.projectBrief.trim();
  if (projectBrief.length < 20) {
    return { error: "Please provide at least 20 characters of project details." };
  }

  const customProduct = await prisma.product.findUnique({
    where: { slug: "custom-exclusive-3d-game-build" },
    select: { id: true, name: true },
  });

  if (!customProduct) {
    return { error: "Custom game product is not configured." };
  }

  const order = await prisma.order.create({
    data: {
      userId: null,
      total: input.budgetUsd,
      currency: "USD",
      status: "PENDING",
      paymentMethod: "paddle",
      items: {
        create: [
          {
            productId: customProduct.id,
            quantity: 1,
            price: input.budgetUsd,
          },
        ],
      },
    },
  });

  const amountInCents = Math.round(input.budgetUsd * 100);
  const response = await fetch(`${getPaddleApiBaseUrl()}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${paddleApiKey}`,
    },
    body: JSON.stringify({
      currency_code: "USD",
      customer: { email },
      items: [
        {
          quantity: 1,
          price: {
            name: `Custom 3D Game Build (${input.budgetUsd.toLocaleString("en-US")} USD)`,
            description: projectBrief.slice(0, 240),
            unit_price: {
              amount: String(amountInCents),
              currency_code: "USD",
            },
            product: {
              name: "Custom Exclusive 3D Game Build",
              description: "Private, never-published 3D game project with source delivery.",
              tax_category: "standard",
            },
          },
        },
      ],
      custom_data: {
        orderId: String(order.id),
        type: "custom-game-order",
        buyerEmail: email,
        projectBrief,
      },
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    const detail = payload?.error?.detail || payload?.error?.message || "Failed to create Paddle transaction";
    return { error: detail };
  }

  const checkoutUrl = payload?.data?.checkout?.url;
  if (!checkoutUrl) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return { error: "Paddle transaction created but no checkout URL returned." };
  }

  return {
    success: true,
    checkoutUrl,
    orderId: order.id,
  };
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
