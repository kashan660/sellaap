import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { generateProductMeta, generateProductStructuredData, generateCategoryMeta, generateBreadcrumbStructuredData, getSiteUrl } from "@/lib/seo-utils";
import Script from "next/script";
import { getDefaultRegionalAvailability } from "@/lib/regional-availability";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true },
    });
    
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    
    return [
      ...products.map((product: any) => ({ slug: product.slug })),
      ...categories.map((category: any) => ({ slug: category.slug }))
    ];
  } catch (error) {
    console.error('Failed to generate static product/category slugs:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Await the params object for Next.js 16.1.1
  const { slug } = await params;
  
  // First try to find a product
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (product) {
    // Generate SEO-optimized metadata (UK copy used as default site-wide tone)
    const ukMeta = generateProductMeta(product, 'uk');

    return {
      ...ukMeta,
      alternates: {
        // Self-referencing canonical: this page only exists at /products/{slug},
        // there are no separate /uk|us|.../products/{slug} routes to alternate to.
        canonical: `${getSiteUrl()}/products/${slug}`,
      },
    };
  }

  // If not a product, try to find a category
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (category) {
    // Generate SEO-optimized metadata for categories
    const ukCategoryMeta = generateCategoryMeta(category, 'uk');

    return {
      ...ukCategoryMeta,
      alternates: {
        canonical: `${getSiteUrl()}/products/${slug}`,
      },
    };
  }

  return {
    title: "Not Found",
    description: "The requested page could not be found."
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params object for Next.js 16.1.1
  const { slug } = await params;
  
  // First try to find a product
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
    }
  });

  // Get regional availability separately to avoid Prisma include issues
  const regionalAvailability = product ? await prisma.productRegion.findMany({
    where: { productId: product.id }
  }) : [];

  const galleryImages = product
    ? product.images.length > 0
      ? product.images.map((img) => img.url)
      : [product.image || product.fallbackImage]
    : [];

  const relatedProducts = product?.categoryId
    ? await prisma.product.findMany({
        where: { categoryId: product.categoryId, id: { not: product.id } },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })
    : [];

  if (product) {
    // Generate structured data for the product
    const structuredData = generateProductStructuredData(product, 'uk');
    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: 'Home', url: getSiteUrl() },
      { name: 'Products', url: `${getSiteUrl()}/products` },
      { name: product.name, url: `${getSiteUrl()}/products/${slug}` },
    ]);

    // Render product page
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Add structured data for SEO */}
        <Script
          id="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <Script
          id="product-breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProductGallery images={galleryImages} name={product.name} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            {product.category && (
              <Link href={`/products?category=${product.category.slug}`} className="text-primary hover:underline mb-4 inline-block">
                {product.category.name}
              </Link>
            )}
            <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
            <div className="text-3xl font-bold text-primary mb-6">
              ${product.price}
            </div>
            
            {/* Regional Availability */}
            {regionalAvailability && regionalAvailability.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Available In</h3>
                <div className="flex flex-wrap gap-2">
                  {regionalAvailability.map((region: any) => (
                    <span
                      key={region.region}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        region.available
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {region.region.toUpperCase()}
                      {region.available ? ' ✓' : ' ✗'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <AddToCartButton product={product} />

            <div className="bg-muted rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="space-y-2">
                <p><strong>Price:</strong> {product.currency} {product.price}</p>
                <p><strong>Availability:</strong> In Stock</p>
                {product.sku && (
                  <p><strong>SKU:</strong> {product.sku}</p>
                )}
                {product.category && (
                  <p><strong>Category:</strong> {product.category.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="group block bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                    {(related.image || related.fallbackImage) && (
                      <Image
                        src={related.image || related.fallbackImage}
                        alt={related.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{related.name}</h3>
                    <p className="text-primary font-bold mt-1">{related.currency} {related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // If not a product, try to find a category
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (category) {
    // Render category page
    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      include: { category: true, regionalAvailability: true },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <h2 className="text-xl text-muted-foreground mb-6">{category.description}</h2>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imagePriority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products found in this category.</p>
            <Link href="/products" className="text-primary hover:underline">
              Browse all products
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Neither product nor category found
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
      <p>The requested page could not be found.</p>
      <Link href="/products" className="text-primary hover:underline mt-4 inline-block">
        Back to Products
      </Link>
    </div>
  );
}
