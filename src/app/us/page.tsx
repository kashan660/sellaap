import { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/products";
import Image from "next/image";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sellaap US - Premium Firestick Setup Services",
    description: "Professional Firestick setup services in the US. Get your Firestick configured for US streaming services.",
    keywords: "firestick setup US, US streaming, firestick configuration, US firestick",
  };
}

export default async function USPage() {
  const products = await getProducts();

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Sellaap US
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Premium Firestick setup services for US customers. Get your Firestick configured for US streaming services.
          </p>
        </div>

        <div className="mt-12 grid gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                <Image 
                  src={product.image || product.fallbackImage} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="mt-4 flex justify-between px-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    <Link href={`/products/${product.slug}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.category?.name || 'Product'}</p>
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

        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">US Streaming Services</h2>
            <p className="text-muted-foreground mb-6">
              Our Firestick setups are optimized for US streaming platforms including Netflix, Hulu, Disney+, Amazon Prime, and more.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Browse All Products
              </Link>
              <Link href="/contact" className="bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}