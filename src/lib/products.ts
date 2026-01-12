
import { appConfig } from '@/config/app-config';
import { prisma } from '@/lib/prisma';
import { Product, Category } from '@prisma/client';

export type ProductWithCategory = Product & { category: Category | null };

/**
 * Fetches products from the database including category information.
 * If a product has a specific image set in the DB, it is used.
 * Otherwise, it falls back to the fallbackImage.
 */
export async function getProducts(): Promise<ProductWithCategory[]> {
  const products = await prisma.product.findMany({
    include: {
        category: true
    },
    orderBy: {
        id: 'asc'
    }
  });
  
  // Map to ensure image property is populated (logic similar to before, but now DB driven)
  return products.map(product => ({
    ...product,
    image: product.image || product.fallbackImage
  }));
}

/**
 * Helper to get featured products (e.g. first 3)
 */
export async function getFeaturedProducts(limit = 3): Promise<ProductWithCategory[]> {
    const products = await getProducts();
    // For now, filter specific IDs or just take the first N
    // In the original Home page, it showed ID 1, 4, 5.
    const featuredIds = [1, 4, 5];
    return products.filter(p => featuredIds.includes(p.id));
}
