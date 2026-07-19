import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RowProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string | null;
  fallbackImage: string;
}

export function CategoryProductRow({
  categoryName,
  categorySlug,
  products,
}: {
  categoryName: string;
  categorySlug: string;
  products: RowProduct[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{categoryName}</h3>
          <Link
            href={`/products/${categorySlug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group shrink-0 w-40 sm:w-auto bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square w-full bg-muted overflow-hidden">
                <Image
                  src={product.image || product.fallbackImage}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 40vw, 20vw"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>
                <p className="text-primary font-bold text-sm">{product.currency} {product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
