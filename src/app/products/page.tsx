import { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { getDefaultRegionalAvailability } from "@/lib/regional-availability";

export async function generateMetadata(): Promise<Metadata> {
  let pageSeo = null;
  try {
      if ((prisma as any).pageSeo) {
        pageSeo = await prisma.pageSeo.findUnique({ where: { path: '/products' } });
      }
  } catch (e) {}

  if (pageSeo) {
      return {
          title: pageSeo.title,
          description: pageSeo.description,
          keywords: pageSeo.keywords?.split(','),
          openGraph: pageSeo.ogImage ? { images: [pageSeo.ogImage] } : undefined
      };
  }

  return {
    title: "Products - Sellaap",
    description: "Browse our collection of premium Firestick setups and digital goods.",
  };
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Our Products</h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Choose from our range of premium setups and digital goods.
          </p>
        </div>

        <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              imagePriority={product.id <= 3}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
