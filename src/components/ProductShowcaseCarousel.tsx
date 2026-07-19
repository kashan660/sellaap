'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShowcaseProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  compareAtPrice?: number | null;
  image: string | null;
  fallbackImage: string;
}

const CARDS_PER_PAGE = 4;

export function ProductShowcaseCarousel({
  title,
  icon,
  badge,
  products,
}: {
  title: string;
  icon: ReactNode;
  badge?: string;
  products: ShowcaseProduct[];
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const pageCount = Math.ceil(products.length / CARDS_PER_PAGE);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setPage((next + pageCount) % pageCount);
  }, [pageCount]);

  useEffect(() => {
    if (pageCount <= 1 || isPaused) return;
    const timer = setInterval(() => goTo(page + 1, 1), 6000);
    return () => clearInterval(timer);
  }, [page, isPaused, pageCount, goTo]);

  if (products.length === 0) return null;

  const visible = products.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h3>
          </div>
          {pageCount > 1 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => goTo(page - 1, -1)}
                aria-label={`Previous ${title}`}
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goTo(page + 1, 1)}
                aria-label={`Next ${title}`}
                className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            >
              {visible.map((product) => {
                const discountPercent =
                  product.compareAtPrice && product.compareAtPrice > product.price
                    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
                    : null;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow relative"
                  >
                    {(badge || discountPercent) && (
                      <span className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {discountPercent ? `${discountPercent}% OFF` : badge}
                      </span>
                    )}
                    <div className="relative aspect-square w-full bg-muted overflow-hidden">
                      <Image
                        src={product.image || product.fallbackImage}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-primary font-bold text-sm">{product.currency} {product.price}</p>
                        {discountPercent && (
                          <p className="text-muted-foreground text-xs line-through">{product.currency} {product.compareAtPrice}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {pageCount > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > page ? 1 : -1)}
                aria-label={`Go to ${title} page ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === page ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
