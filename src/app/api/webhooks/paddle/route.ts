import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fulfillOrderWithCj } from "@/lib/actions/cj";
import { getTierByPriceId, getBillingPeriodForPriceId } from "@/lib/membership/tiers";

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function verifyPaddleSignature(rawBody: string, signatureHeader: string, secret: string) {
  const pairs = signatureHeader.split(";").map((p) => p.trim());
  const ts = pairs.find((p) => p.startsWith("ts="))?.split("=")[1];
  const h1 = pairs.find((p) => p.startsWith("h1="))?.split("=")[1];
  if (!ts || !h1) return false;

  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  return timingSafeEqual(expected, h1);
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "PADDLE_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing paddle-signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  if (!verifyPaddleSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType = event?.event_type as string | undefined;
  if (!eventType) {
    return NextResponse.json({ received: true });
  }

  if (eventType.startsWith("subscription.")) {
    return handleSubscriptionEvent(eventType, event);
  }

  const customOrderId = event?.data?.custom_data?.orderId;
  const orderId = Number(customOrderId);

  if (Number.isNaN(orderId) || orderId <= 0) {
    return NextResponse.json({ received: true });
  }

  try {
    if (eventType === "transaction.completed") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });
      await fulfillOrderWithCj(orderId);
    } else if (eventType === "transaction.payment_failed") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
    } else if (eventType === "transaction.canceled") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/profile");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paddle webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// Sellaap+ membership subscriptions - see prisma Subscription model and
// src/lib/membership/tiers.ts. The signed-in user's id is passed as
// custom_data.userId when the client opens Paddle.Checkout.open() from the
// membership pricing page.
async function handleSubscriptionEvent(eventType: string, event: any) {
  const data = event?.data;
  const paddleSubscriptionId = data?.id as string | undefined;
  if (!paddleSubscriptionId) {
    return NextResponse.json({ received: true });
  }

  try {
    if (eventType === "subscription.canceled") {
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId },
        data: { status: "canceled", scheduledCancelAt: null },
      });
      revalidatePath("/profile");
      revalidatePath("/membership");
      return NextResponse.json({ received: true });
    }

    // subscription.created / subscription.updated
    const priceId = data?.items?.[0]?.price?.id as string | undefined;
    const tier = priceId ? getTierByPriceId(priceId) : undefined;
    const billingPeriod = tier && priceId ? getBillingPeriodForPriceId(tier, priceId) : null;
    const status = (data?.status as string | undefined) ?? "active";
    const currentBillingPeriodEnd = data?.current_billing_period?.ends_at
      ? new Date(data.current_billing_period.ends_at)
      : null;
    // Present (with action: "cancel") when a cancellation is scheduled for
    // end-of-period but hasn't taken effect yet - status stays "active".
    const scheduledCancelAt =
      data?.scheduled_change?.action === "cancel" && data.scheduled_change.effective_at
        ? new Date(data.scheduled_change.effective_at)
        : null;

    if (eventType === "subscription.created") {
      const userId = Number(data?.custom_data?.userId);
      if (!userId || Number.isNaN(userId) || !tier || !billingPeriod) {
        console.error("subscription.created missing userId or unknown price_id", { userId, priceId });
        return NextResponse.json({ received: true });
      }

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          tier: tier.key,
          billingPeriod,
          status,
          paddleSubscriptionId,
          paddleCustomerId: data?.customer_id ?? "",
          paddlePriceId: priceId ?? "",
          currentBillingPeriodEnd,
          scheduledCancelAt,
        },
        update: {
          tier: tier.key,
          billingPeriod,
          status,
          paddleSubscriptionId,
          paddleCustomerId: data?.customer_id ?? "",
          paddlePriceId: priceId ?? "",
          currentBillingPeriodEnd,
          scheduledCancelAt,
        },
      });
    } else if (eventType === "subscription.updated") {
      const existing = await prisma.subscription.findUnique({ where: { paddleSubscriptionId } });
      if (!existing) {
        // Updated event arrived before/without a created event we recognized - ignore.
        return NextResponse.json({ received: true });
      }

      await prisma.subscription.update({
        where: { paddleSubscriptionId },
        data: {
          ...(tier ? { tier: tier.key } : {}),
          ...(billingPeriod ? { billingPeriod } : {}),
          ...(priceId ? { paddlePriceId: priceId } : {}),
          status,
          currentBillingPeriodEnd,
          scheduledCancelAt,
        },
      });
    }

    revalidatePath("/profile");
    revalidatePath("/membership");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paddle subscription webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
