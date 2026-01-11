import { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import { Price } from "@/components/Price";

export const metadata: Metadata = {
  title: "Products - Sellaap",
  description: "Browse our collection of premium Firestick setups and digital goods.",
};

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
            <div key={product.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              <div className="aspect-video w-full bg-muted relative">
                 <Image 
                    src={product.image || product.fallbackImage} 
                    alt={product.name}
                    fill
                    unoptimized={!!product.image?.startsWith('http')} // Optimization is fine for local, but unoptimized usually safer for mixed content if not configured
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 />
              </div>
              <div className="mt-4 flex justify-between px-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                </div>
                <p className="text-lg font-medium text-primary">
                  <Price amount={product.price} baseCurrency={product.currency} />
                </p>
              </div>
              <div className="px-4 pb-4 mt-2">
                 <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
              <div className="mt-auto p-4 pt-0 relative z-10">
                  <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer">
                     <ShoppingCart size={16} />
                     Add to Cart
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
