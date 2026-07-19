import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { fulfillOrderWithCj } from "@/lib/actions/cj";

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
  const customOrderId = event?.data?.custom_data?.orderId;
  const orderId = Number(customOrderId);

  if (!eventType || Number.isNaN(orderId) || orderId <= 0) {
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
