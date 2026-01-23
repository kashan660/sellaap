import { Metadata } from "next";
import Link from "next/link";
import { getDigitalProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let pageSeo = null;
  try {
      if ((prisma as any).pageSeo) {
        pageSeo = await prisma.pageSeo.findUnique({ where: { path: '/digital-products' } });
      }
  } catch (e) {}

  if (pageSeo) {
      return {
          title: pageSeo.title,
          description: pageSeo.description,
          keywords: pageSeo.keywords?.split(','),
          openGraph: pageSeo.ogImage ? { images: [pageSeo.ogImage] } : undefined
      }
  }

  return {
    title: "Digital Products - Sellaap",
    description: "Browse our collection of premium digital products, software, and digital goods with instant delivery.",
    keywords: ["digital products", "software", "digital goods", "instant delivery", "premium downloads"]
  };
}

export default async function DigitalProductsPage() {
  const products = await getDigitalProducts();

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Digital Products</h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Premium digital products with instant delivery. Download immediately after purchase.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center mt-16">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-2xl font-semibold mb-4">No Digital Products Available</h2>
            <p className="text-muted-foreground mb-8">Check back soon for our latest digital offerings!</p>
            <Link 
              href="/products"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product: any) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                badgeText="Instant Delivery"
                imagePriority={product.id <= 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
