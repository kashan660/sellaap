import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_CONFIG } from '@/lib/cache';
import { getCjVariants, getCjVariantStock } from '@/lib/cj/catalog';
import { getCjOrderTracking } from '@/lib/cj/orders';

// Hit by Vercel Cron (see vercel.json). Re-syncs price/stock for CJ-sourced
// products and polls tracking for orders already submitted to CJ.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = { productsSynced: 0, productErrors: 0, ordersChecked: 0, orderErrors: 0 };

  const settings = await prisma.dropshipSettings.findFirst();
  const markupPercent = settings?.markupPercent ?? 30;

  const cjProducts = await prisma.product.findMany({
    where: { sourceType: 'CJ', cjProductId: { not: null }, cjVariantId: { not: null } },
  });

  for (const product of cjProducts) {
    try {
      const variants = await getCjVariants(product.cjProductId as string);
      const variant = variants.find((v) => v.vid === product.cjVariantId);
      if (!variant) continue;

      const stockQuantity = await getCjVariantStock(variant.vid).catch(() => product.stockQuantity);
      const price = Math.round(variant.sellPrice * (1 + markupPercent / 100) * 100) / 100;

      await prisma.product.update({
        where: { id: product.id },
        data: { price, costPrice: variant.sellPrice, stockQuantity, lastSyncedAt: new Date() },
      });
      results.productsSynced++;
    } catch (error) {
      console.error(`CJ sync failed for product ${product.id}:`, error);
      results.productErrors++;
    }
  }

  if (results.productsSynced > 0) {
    revalidatePath('/products');
    revalidatePath('/admin/products');
    CACHE_CONFIG.products.tags.forEach((tag) => revalidateTag(tag, 'max'));
  }

  const submittedOrders = await prisma.order.findMany({
    where: { fulfillmentStatus: 'SUBMITTED', cjOrderId: { not: null } },
  });

  for (const order of submittedOrders) {
    results.ordersChecked++;
    try {
      const tracking = await getCjOrderTracking(order.cjOrderId as string);
      if (tracking.trackingNumber) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            trackingNumber: tracking.trackingNumber,
            trackingCarrier: tracking.trackingCarrier,
            fulfillmentStatus: 'SHIPPED',
            shippedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error(`CJ tracking poll failed for order ${order.id}:`, error);
      results.orderErrors++;
    }
  }

  if (results.ordersChecked > 0) {
    revalidatePath('/admin/orders');
  }

  return NextResponse.json({ success: true, ...results });
}
