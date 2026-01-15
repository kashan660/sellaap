import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sellaap.vercel.app';
  
  // Get all products
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' }
  });
  
  // Get all posts
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' }
  });
  
  // Get all categories
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' }
  });
  
  // Get all page SEO entries
  const pageSeo = await prisma.pageSeo.findMany({
    select: { path: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' }
  });
  
  // Define markets for international SEO
  const markets = ['uk', 'us', 'canada', 'europe', 'australia'];
  
  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // Location-specific landing pages
  const locationPages: MetadataRoute.Sitemap = markets.map(market => ({
    url: `${baseUrl}/${market}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  
  // Location-specific products
  const locationProducts: MetadataRoute.Sitemap = markets.flatMap(market => 
    products.map(product => ({
      url: `${baseUrl}/${market}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );
  
  // Location-specific blog posts
  const locationPosts: MetadataRoute.Sitemap = markets.flatMap(market => 
    posts.map(post => ({
      url: `${baseUrl}/${market}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );
  
  // Location-specific categories
  const locationCategories: MetadataRoute.Sitemap = markets.flatMap(market => 
    categories.map(category => ({
      url: `${baseUrl}/${market}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );
  
  // Location-specific pages
  const locationPagesSeo: MetadataRoute.Sitemap = markets.flatMap(market => 
    pageSeo.map(page => ({
      url: `${baseUrl}/${market}${page.path}`,
      lastModified: page.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  );
  
  // Blog categories and tags (if they exist)
  const blogTaxonomy: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog/category/firestick-setup`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/category/streaming-guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/category/product-reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/tag/firestick-4k-max`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/tag/setup-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/tag/streaming-apps`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
  
  // International versions of blog taxonomy
  const internationalBlogTaxonomy: MetadataRoute.Sitemap = markets.flatMap(market => 
    blogTaxonomy.map(page => ({
      url: page.url.replace(baseUrl, `${baseUrl}/${market}`),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency as any,
      priority: page.priority,
    }))
  );
  
  // Combine all sitemap entries
  return [
    ...staticPages,
    ...locationPages,
    ...locationProducts,
    ...locationPosts,
    ...locationCategories,
    ...locationPagesSeo,
    ...blogTaxonomy,
    ...internationalBlogTaxonomy,
  ];
}