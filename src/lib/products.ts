
import { appConfig } from '@/config/app-config';
import { prisma } from '@/lib/prisma';
import { Product, Category } from '@prisma/client';

export type ProductWithCategory = Product & { category: Category | null };

/**
 * Fetches products from the database including category information and regional availability.
 * If a product has a specific image set in the DB, it is used.
 * Otherwise, it falls back to the fallbackImage.
 */
export async function getProducts(region?: string): Promise<ProductWithCategory[]> {
  const products = await prisma.product.findMany({
    include: {
        category: true,
        regionalAvailability: true
    },
    orderBy: {
        id: 'asc'
    }
  });
  
  // Filter products by region if specified
  let filteredProducts = products;
  if (region) {
    filteredProducts = products.filter(product => 
      product.regionalAvailability.some(ra => ra.region === region && ra.available)
    );
  }
  
  // Map to ensure image property is populated (logic similar to before, but now DB driven)
  return filteredProducts.map(product => ({
    ...product,
    image: product.image || product.fallbackImage
  }));

  // Static mock data
  // return [
  //   {
  //     id: 1,
  //     slug: "firestick-setup-uk",
  //     name: "Firestick Setup UK",
  //     description: "Complete setup for UK Firestick users.",
  //     price: 29.99,
  //     currency: "GBP",
  //     categoryId: 1,
  //     category: { id: 1, slug: "setup", name: "Setup", description: "Setup services", createdAt: new Date(), updatedAt: new Date() },
  //     features: "[]",
  //     fallbackImage: "https://placehold.co/600x400",
  //     image: "https://placehold.co/600x400",
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   }
  // ];
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
  
  return products.map(product => ({
    ...product,
    image: product.image || product.fallbackImage
  }));
}
