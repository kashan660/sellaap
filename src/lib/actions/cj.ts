'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_CONFIG } from '@/lib/cache';
import { searchCjProducts, getCjVariants, getCjVariantStock, getCjProductImages } from '@/lib/cj/catalog';
import { createCjOrder, payCjOrder, getCjOrderTracking } from '@/lib/cj/orders';
import { slugify } from '@/lib/slugify';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getDropshipSettings() {
  await requireAdmin();
  const settings = await prisma.dropshipSettings.findFirst();
  return settings ?? { id: 0, markupPercent: 30, autoFulfill: false, updatedAt: new Date() };
}

export async function updateDropshipSettings(data: { markupPercent: number; autoFulfill: boolean }) {
  await requireAdmin();
  const existing = await prisma.dropshipSettings.findFirst();
  if (existing) {
    await prisma.dropshipSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.dropshipSettings.create({ data });
  }
  revalidatePath('/admin/dropship');
  return { success: true };
}

export async function searchCjCatalog(keyword: string, pageNum = 1) {
  await requireAdmin();
  if (!keyword.trim()) return { success: true, products: [] };
  try {
    const products = await searchCjProducts(keyword, pageNum);
    return { success: true, products };
  } catch (error: any) {
    console.error('CJ catalog search failed:', error);
    return { success: false, error: error?.message || 'CJ Dropshipping search failed' };
  }
}

export async function getCjProductVariants(pid: string) {
  await requireAdmin();
  try {
    const variants = await getCjVariants(pid);
    return { success: true, variants };
  } catch (error: any) {
    console.error('CJ variant lookup failed:', error);
    return { success: false, error: error?.message || 'CJ Dropshipping variant lookup failed' };
  }
}

// Ensures a unique, name-based slug - CJ variants of the same product (e.g.
// different colors) often share a name, so a plain slugify(name) can collide.
// CJ product names are long marketing titles, so the slug is capped at a
// word boundary for a readable URL rather than reproducing the whole title.
const MAX_SLUG_LENGTH = 60;

function truncateSlug(slug: string): string {
  if (slug.length <= MAX_SLUG_LENGTH) return slug;
  const cut = slug.slice(0, MAX_SLUG_LENGTH);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > 20 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '');
}

async function uniqueProductSlug(name: string, skuHint: string) {
  const base = truncateSlug(slugify(name)) || slugify(skuHint) || 'product';
  const existing = await prisma.product.findUnique({ where: { slug: base } });
  if (!existing) return base;

  const skuSuffix = slugify(skuHint).slice(-6);
  if (skuSuffix) {
    const withSku = `${base}-${skuSuffix}`;
    if (!(await prisma.product.findUnique({ where: { slug: withSku } }))) return withSku;
  }

  let n = 2;
  while (await prisma.product.findUnique({ where: { slug: `${base}-${n}` } })) n++;
  return `${base}-${n}`;
}

export async function importCjProduct(input: { pid: string; vid: string; categoryId: number }) {
  await requireAdmin();

  if (!input.categoryId) {
    return { error: 'Please select a category before importing.' };
  }

  try {
    const variants = await getCjVariants(input.pid);
    const variant = variants.find((v) => v.vid === input.vid);
    if (!variant) {
      return { error: 'Variant not found in CJ catalog' };
    }

    const stockQuantity = await getCjVariantStock(variant.vid).catch(() => 0);
    const settings = await prisma.dropshipSettings.findFirst();
    const markupPercent = settings?.markupPercent ?? 30;
    const price = Math.round(variant.sellPrice * (1 + markupPercent / 100) * 100) / 100;
    const slug = await uniqueProductSlug(variant.name, variant.sku);
    const galleryImages = await getCjProductImages(input.pid).catch(() => []);
    const images = galleryImages.length > 0 ? galleryImages : variant.image ? [variant.image] : [];

    const product = await prisma.product.create({
      data: {
        name: variant.name,
        slug,
        description: variant.name,
        price,
        currency: 'USD',
        categoryId: input.categoryId,
        fallbackImage: variant.image || images[0] || '/placeholder.png',
        image: variant.image || images[0],
        sourceType: 'CJ',
        cjProductId: input.pid,
        cjVariantId: input.vid,
        sku: variant.sku,
        costPrice: variant.sellPrice,
        stockQuantity,
        weight: variant.weight,
        lastSyncedAt: new Date(),
        regionalAvailability: {
          create: [{ region: 'us', available: true }],
        },
        images: {
          create: images.map((url, index) => ({ url, order: index })),
        },
      },
    });

    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/');
    CACHE_CONFIG.products.tags.forEach((tag) => revalidateTag(tag, 'max'));

    return { success: true, product };
  } catch (error: any) {
    console.error('CJ product import failed:', error);
    return { error: error?.message || 'Failed to import CJ product' };
  }
}

export async function syncCjProduct(productId: number) {
  await requireAdmin();

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sourceType !== 'CJ' || !product.cjProductId || !product.cjVariantId) {
      return { error: 'Not a CJ-sourced product' };
    }

    const variants = await getCjVariants(product.cjProductId);
    const variant = variants.find((v) => v.vid === product.cjVariantId);
    if (!variant) {
      return { error: 'Variant no longer available from CJ' };
    }

    const stockQuantity = await getCjVariantStock(variant.vid).catch(() => product.stockQuantity);
    const settings = await prisma.dropshipSettings.findFirst();
    const markupPercent = settings?.markupPercent ?? 30;
    const price = Math.round(variant.sellPrice * (1 + markupPercent / 100) * 100) / 100;

    await prisma.product.update({
      where: { id: productId },
      data: {
        price,
        costPrice: variant.sellPrice,
        stockQuantity,
        lastSyncedAt: new Date(),
      },
    });

    revalidatePath('/products');
    revalidatePath('/admin/products');
    CACHE_CONFIG.products.tags.forEach((tag) => revalidateTag(tag, 'max'));

    return { success: true };
  } catch (error: any) {
    console.error('CJ product sync failed:', error);
    return { error: error?.message || 'Failed to sync CJ product' };
  }
}

async function fulfillOrder(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) throw new Error('Order not found');

  const cjItems = order.items.filter((item) => item.product.sourceType === 'CJ' && item.product.cjVariantId);
  if (cjItems.length === 0) return;

  if (!order.shippingName || !order.shippingAddress1 || !order.shippingCity || !order.shippingPostalCode) {
    await prisma.order.update({
      where: { id: orderId },
      data: { fulfillmentStatus: 'FAILED' },
    });
    throw new Error('Order is missing shipping information required for CJ fulfillment');
  }

  try {
    const { cjOrderId } = await createCjOrder(
      `sellaap-${order.id}`,
      {
        name: order.shippingName,
        phone: order.shippingPhone || '',
        address1: order.shippingAddress1,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        state: order.shippingState || '',
        postalCode: order.shippingPostalCode,
        countryCode: order.shippingCountry,
      },
      cjItems.map((item) => ({ vid: item.product.cjVariantId as string, quantity: item.quantity }))
    );

    // Pays from the CJ account balance - this is what actually triggers the shipment.
    await payCjOrder(cjOrderId);

    await prisma.order.update({
      where: { id: orderId },
      data: { cjOrderId, fulfillmentStatus: 'SUBMITTED' },
    });
  } catch (error) {
    await prisma.order.update({
      where: { id: orderId },
      data: { fulfillmentStatus: 'FAILED' },
    });
    throw error;
  }
}

export async function fulfillOrderWithCj(orderId: number) {
  const settings = await prisma.dropshipSettings.findFirst();
  if (!settings?.autoFulfill) return;

  try {
    await fulfillOrder(orderId);
  } catch (error) {
    console.error(`CJ auto-fulfillment failed for order ${orderId}:`, error);
  }
}

export async function retryCjFulfillment(orderId: number) {
  await requireAdmin();
  try {
    await fulfillOrder(orderId);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    console.error(`CJ fulfillment retry failed for order ${orderId}:`, error);
    return { error: error?.message || 'Failed to submit order to CJ Dropshipping' };
  }
}

export async function refreshCjTracking(orderId: number) {
  await requireAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order?.cjOrderId) {
    return { error: 'Order has no CJ Dropshipping order id' };
  }

  try {
    const tracking = await getCjOrderTracking(order.cjOrderId);
    await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: tracking.trackingNumber ?? order.trackingNumber,
        trackingCarrier: tracking.trackingCarrier ?? order.trackingCarrier,
        fulfillmentStatus: tracking.trackingNumber ? 'SHIPPED' : order.fulfillmentStatus,
        shippedAt: tracking.trackingNumber && !order.shippedAt ? new Date() : order.shippedAt,
      },
    });
    revalidatePath('/admin/orders');
    return { success: true, tracking };
  } catch (error: any) {
    console.error(`CJ tracking refresh failed for order ${orderId}:`, error);
    return { error: error?.message || 'Failed to fetch tracking from CJ Dropshipping' };
  }
}
