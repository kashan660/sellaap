
import { appConfig } from '@/config/app-config';
import { prisma } from '@/lib/prisma';
import { Product, Category, ProductRegion } from '@prisma/client';
import { getCachedProducts, getCachedFeaturedProducts } from '@/lib/cache';

export type ProductWithCategory = Product & { category: Category | null; regionalAvailability: ProductRegion[] };

/**
 * Fetches products from the database including category information and regional availability.
 * If a product has a specific image set in the DB, it is used.
 * Otherwise, it falls back to the fallbackImage.
 * Uses cached data for performance.
 */
export async function getProducts(region?: string): Promise<ProductWithCategory[]> {
  const products = await getCachedProducts() as ProductWithCategory[];
  
  // Filter products by region if specified
  let filteredProducts = products;
  if (region) {
    filteredProducts = products.filter((product: ProductWithCategory) => 
      product.regionalAvailability.some((ra: ProductRegion) => ra.region === region && ra.available)
    );
  }
  
  // Map to ensure image property is populated
  return filteredProducts.map((product: ProductWithCategory) => ({
    ...product,
    image: product.image || product.fallbackImage
  }));
}

/**
 * Helper to get featured products (e.g. first 3)
 * Uses cached data for performance.
 */
export async function getFeaturedProducts(limit = 3): Promise<ProductWithCategory[]> {
    const products = await getCachedFeaturedProducts(limit) as ProductWithCategory[];
    return products;
}

/**
 * Fetches digital products (products in the 'digital' category)
 */
export async function getDigitalProducts(): Promise<ProductWithCategory[]> {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: 'digital'
      }
    },
    include: {
        category: true
    },
    orderBy: {
        id: 'asc'
    }
  });
  
  return products.map((product: ProductWithCategory) => ({
    ...product,
    image: product.image || product.fallbackImage
  }));
}
