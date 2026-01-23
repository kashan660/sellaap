
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/actions/products';

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group block bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <Image
                  src={product.image || product.fallbackImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        {product.category && (
                        <p className="text-sm text-muted-foreground">{product.category.name}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-primary">
                            {product.currency} {product.price}
                        </p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
