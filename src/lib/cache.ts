import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

/**
 * Cache configuration interface
 */
export interface CacheConfig {
  tags: string[];
  revalidate: number;
}

/**
 * Default cache configurations
 */
export const CACHE_CONFIG = {
  products: {
    tags: ['products'],
    revalidate: 3600 // 1 hour
  },
  product: {
    tags: ['product'],
    revalidate: 3600
  },
  categories: {
    tags: ['categories'],
    revalidate: 86400 // 24 hours
  },
  pages: {
    tags: ['pages'],
    revalidate: 3600
  },
  posts: {
    tags: ['posts'],
    revalidate: 3600
  },
  menus: {
    tags: ['menus'],
    revalidate: 86400
  },
  redirects: {
    tags: ['redirects'],
    revalidate: 3600
  },
  settings: {
    tags: ['settings'],
    revalidate: 3600
  }
};

/**
 * Cached data fetchers
 */

// Products
export const getCachedProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      include: {
        category: true,
        regionalAvailability: true
      },
      orderBy: { id: 'asc' }
    });
  },
  ['products-all'],
  CACHE_CONFIG.products
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        regionalAvailability: true
      }
    });
  },
  ['product-by-slug'],
  CACHE_CONFIG.product
);

export const getCachedFeaturedProducts = unstable_cache(
  async (limit = 3) => {
    // Logic to get featured products
    // For now, we'll fetch all and filter, but in a real app we'd query specifically
    const products = await prisma.product.findMany({
      include: {
        category: true,
        regionalAvailability: true
      },
      orderBy: { id: 'asc' }
    });
    
    // Featured logic (e.g. specific IDs or marked as featured)
    const featuredIds = [1, 4, 5];
    return products.filter((p: any) => featuredIds.includes(p.id)).slice(0, limit);
  },
  ['products-featured'],
  { ...CACHE_CONFIG.products, revalidate: 1800 } // 30 mins
);

// Categories
export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  },
  ['categories-all'],
  CACHE_CONFIG.categories
);

// Pages
export const getCachedPageBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.page.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        featuredImage: true,
        images: true,
        parent: true,
        children: { orderBy: { order: 'asc' } }
      }
    });
  },
  ['page-by-slug'],
  CACHE_CONFIG.pages
);

// Posts
export const getCachedPostBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
        images: true
      }
    });
  },
  ['post-by-slug'],
  CACHE_CONFIG.posts
);

export const getCachedRecentPosts = unstable_cache(
  async (limit = 5) => {
    return prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } }
      },
      orderBy: { date: 'desc' },
      take: limit
    });
  },
  ['posts-recent'],
  CACHE_CONFIG.posts
);

// Menus
export const getCachedMenus = unstable_cache(
  async () => {
    return prisma.menu.findMany({
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' },
              include: {
                children: { orderBy: { order: 'asc' } }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  },
  ['menus-all'],
  CACHE_CONFIG.menus
);

// Redirects
export const getCachedRedirects = unstable_cache(
  async () => {
    return prisma.redirect.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },
  ['redirects-all'],
  CACHE_CONFIG.redirects
);

// Settings
export const getCachedPaymentSettings = unstable_cache(
  async () => {
    return prisma.paymentSettings.findFirst();
  },
  ['payment-settings'],
  CACHE_CONFIG.settings
);
