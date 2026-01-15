
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Price } from '@/components/Price';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ShoppingCart } from 'lucide-react';
import { Metadata } from 'next';
import { generateProductMeta, generateStructuredData, generateFAQStructuredData } from '@/lib/seo-utils';

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

  return generateProductMeta(product, 'uk'); // Default to UK, can be made dynamic
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

  const structuredData = generateStructuredData(product);
  const faqData = [
    {
      question: `How long does ${product.name} setup take?`,
      answer: `Setup typically takes 30-45 minutes. Our expert technicians will configure everything for optimal performance.`
    },
    {
      question: `Is ${product.name} compatible with my TV?`,
      answer: `Yes, ${product.name} works with any TV that has an HDMI port. We provide full compatibility support.`
    },
    {
      question: `What channels can I access with ${product.name}?`,
      answer: `You'll get access to thousands of channels including premium content, sports, movies, and international channels.`
    },
    {
      question: `Do you offer support for ${product.name}?`,
      answer: `Yes, we provide 24/7 support for all our products. Contact us anytime for assistance.`
    }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, generateFAQStructuredData(faqData)])
        }}
      />
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

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
