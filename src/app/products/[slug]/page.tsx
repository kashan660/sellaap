import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { generateProductMeta, generateProductStructuredData, generateCategoryMeta, generateCanonicalUrl } from "@/lib/seo-utils";
import Script from "next/script";
import { getDefaultRegionalAvailability } from "@/lib/regional-availability";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
  
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  
  return [
    ...products.map((product) => ({ slug: product.slug })),
    ...categories.map((category) => ({ slug: category.slug }))
  ];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Await the params object for Next.js 16.1.1
  const { slug } = await params;
  
  // First try to find a product
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (product) {
    // Generate SEO-optimized metadata for multiple markets
    const ukMeta = generateProductMeta(product, 'uk');
    const usMeta = generateProductMeta(product, 'us');
    const canadaMeta = generateProductMeta(product, 'canada');
    const europeMeta = generateProductMeta(product, 'europe');
    const australiaMeta = generateProductMeta(product, 'australia');
    
    // Return enhanced metadata with international support
    return {
      ...ukMeta, // Use UK as primary market
      alternates: {
        canonical: generateCanonicalUrl(`/products/${slug}`, 'uk'),
        languages: {
          'en-US': generateCanonicalUrl(`/products/${slug}`, 'us'),
          'en-CA': generateCanonicalUrl(`/products/${slug}`, 'canada'),
          'en-EU': generateCanonicalUrl(`/products/${slug}`, 'europe'),
          'en-AU': generateCanonicalUrl(`/products/${slug}`, 'australia'),
        }
      },
      other: {
        'og:locale:alternate': ['en_US', 'en_CA', 'en_EU', 'en_AU']
      }
    };
  }

  // If not a product, try to find a category
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (category) {
    // Generate SEO-optimized metadata for categories
    const ukCategoryMeta = generateCategoryMeta(category, 'uk');
    
    // Return enhanced category metadata with international support
    return {
      ...ukCategoryMeta,
      alternates: {
        canonical: generateCanonicalUrl(`/products/${slug}`, 'uk'),
        languages: {
          'en-US': generateCanonicalUrl(`/products/${slug}`, 'us'),
          'en-CA': generateCanonicalUrl(`/products/${slug}`, 'canada'),
          'en-EU': generateCanonicalUrl(`/products/${slug}`, 'europe'),
          'en-AU': generateCanonicalUrl(`/products/${slug}`, 'australia'),
        }
      },
      other: {
        'og:locale:alternate': ['en_US', 'en_CA', 'en_EU', 'en_AU']
      }
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
      category: true
    }
  });
  
  // Get regional availability separately to avoid Prisma include issues
  const regionalAvailability = product ? await prisma.productRegion.findMany({
    where: { productId: product.id }
  }) : [];

  if (product) {
    // Generate structured data for the product
    const structuredData = generateProductStructuredData(product, 'uk');
    
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  {regionalAvailability.map((region) => (
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
          </div>
          <div>
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <div className="space-y-2">
                <p><strong>Price:</strong> {product.currency} {product.price}</p>
                <p><strong>Availability:</strong> In Stock</p>
                {product.category && (
                  <p><strong>Category:</strong> {product.category.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <Link 
                    href={`/products/${product.slug}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
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