'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string | null;
  fallbackImage: string;
  category: { name: string } | null;
}

export function FeaturedCarousel({ products }: { products: FeaturedProduct[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1 || isPaused) return;
    const timer = setInterval(() => goTo(index + 1, 1), 5000);
    return () => clearInterval(timer);
  }, [index, isPaused, products.length, goTo]);

  if (products.length === 0) return null;

  const product = products[index];

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-6 w-6" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Featured Products</h2>
          </div>
          {products.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => goTo(index - 1, -1)}
                aria-label="Previous featured product"
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo(index + 1, 1)}
                aria-label="Next featured product"
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={product.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-2"
            >
              <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] lg:aspect-auto w-full overflow-hidden bg-muted group">
                <Image
                  src={product.image || product.fallbackImage}
                  alt={product.name}
                  fill
                  unoptimized
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </Link>
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                {product.category && (
                  <span className="inline-block w-fit text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                    {product.category.name}
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{product.name}</h3>
                <p className="text-muted-foreground line-clamp-3 mb-6">{product.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-primary">{product.currency} {product.price}</span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`Go to featured product ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
