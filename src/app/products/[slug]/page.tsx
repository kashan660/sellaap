
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Price } from '@/components/Price';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ShoppingCart } from 'lucide-react';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.metaTitle || `${product.name} - Sellaap`,
    description: product.metaDescription || product.description,
    keywords: product.metaKeywords ? product.metaKeywords.split(',') : [],
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description,
      images: product.image ? [product.image] : (product.fallbackImage ? [product.fallbackImage] : []),
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  let features: string[] = [];
  try {
    if (product.features) {
      features = JSON.parse(product.features);
      if (!Array.isArray(features)) {
          // fallback if it's just a string or not an array
          features = [product.features];
      }
    }
  } catch (e) {
      // If not JSON, treat as single feature or split by newlines?
      // Let's treat as single string wrapped in array if not empty
      if (product.features) {
          features = [product.features];
      }
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-muted shadow-2xl ring-1 ring-black/5">
              <Image
                src={product.image || product.fallbackImage}
                alt={product.name}
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                priority
                unoptimized={!!(product.image?.startsWith('http') || product.fallbackImage.startsWith('http'))}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="mb-4">
                 {product.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {product.category.name}
                    </span>
                )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{product.name}</h1>
            
            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-bold text-primary">
                 <Price amount={product.price} baseCurrency={product.currency} />
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-muted-foreground space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            {features.length > 0 && (
                <div className="mt-8 border-t border-border pt-8">
                    <h3 className="text-sm font-medium text-foreground mb-4">Key Features</h3>
                    <ul role="list" className="space-y-3">
                        {features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-3"/>
                                <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-10 flex">
               <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
