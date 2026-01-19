'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';
import { Price } from './Price';
import { ProductWithCategory } from '@/lib/products';

interface ProductCardProps {
  product: ProductWithCategory;
  showCategory?: boolean;
  showPrice?: boolean;
  imagePriority?: boolean;
  badgeText?: string;
  className?: string;
}

/**
 * Reusable Product Card Component with built-in Add to Cart functionality
 * Automatically includes AddToCartButton for any product passed to it
 */
export function ProductCard({ 
  product, 
  showCategory = true, 
  showPrice = true, 
  imagePriority = false,
  badgeText,
  className = ''
}: ProductCardProps) {
  return (
    <div className={`group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 ${className}`}>
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        <Image 
          src={product.image || product.fallbackImage || '/placeholder.png'} 
          alt={product.name}
          fill
          unoptimized={!!(product.image?.startsWith('http') || product.fallbackImage?.startsWith('http'))}
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={imagePriority}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Badge */}
        {badgeText && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {badgeText}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between px-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            <Link href={`/products/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          {showCategory && (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.category?.name || 'Product'}
            </p>
          )}
        </div>
        {showPrice && (
          <p className="text-lg font-medium text-primary">
            <Price amount={product.price} baseCurrency={product.currency} />
          </p>
        )}
      </div>
      
      <div className="px-4 pb-4 mt-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </div>
      
      {/* Add to Cart Button - Automatically included for all products */}
      <div className="mt-auto p-4 pt-0 relative z-10">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}