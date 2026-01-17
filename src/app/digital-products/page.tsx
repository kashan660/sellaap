import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDigitalProducts } from "@/lib/products";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";
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
            {products.map((product) => (
              <div key={product.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                   <Image 
                      src={product.image || product.fallbackImage} 
                      alt={product.name}
                      fill
                      unoptimized={!!(product.image?.startsWith('http') || product.fallbackImage.startsWith('http'))}
                      className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={product.id <= 3}
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                   <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                     Instant Delivery
                   </div>
                </div>
                <div className="mt-4 flex justify-between px-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      <Link href={`/products/${product.slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{product.category?.name || 'Digital Product'}</p>
                  </div>
                  <p className="text-lg font-medium text-primary">
                    <Price amount={product.price} baseCurrency={product.currency} />
                  </p>
                </div>
                <div className="px-4 pb-4 mt-2">
                   <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-auto p-4 pt-0 relative z-10">
                    <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}