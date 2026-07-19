import { Hero } from "@/components/Hero";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Truck, ShieldCheck, Flame, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { CategoryProductRow } from "@/components/CategoryProductRow";
import { ProductShowcaseCarousel } from "@/components/ProductShowcaseCarousel";
import { getCachedSiteSettings } from "@/lib/cache";
import { getFeaturedProducts, getBestsellerProducts, getDiscountedProducts } from "@/lib/actions/products";

export const dynamic = 'force-dynamic';

const NICHE_SLUGS = ['pet-supplies', 'beauty', 'electronics', 'home-equipment', 'vehicle-accessories'];

// Structured data for homepage
function generateHomepageStructuredData(socialLinks: string[] = []) {
  const sameAs = socialLinks.length > 0 ? socialLinks : ["https://sellaap.com"];
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sellaap",
    "alternateName": "Sellaap Online Store",
    "url": "https://sellaap.com",
    "description": "Shop Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories with fast, reliable shipping across the USA.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sellaap.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": sameAs,
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "9.99",
      "highPrice": "199.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "Sellaap",
      "description": "Online store for Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories, shipping across the USA.",
      "url": "https://sellaap.com",
      "logo": "https://sellaap.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-SELLAAP",
        "contactType": "customer service",
        "email": "service@sellaap.com",
        "availableLanguage": ["English"],
        "areaServed": ["US"]
      },
      "sameAs": sameAs
    }
  };
}

export async function generateMetadata(): Promise<Metadata> {
  let pageSeo = null;
  try {
    if ((prisma as any).pageSeo) {
        pageSeo = await prisma.pageSeo.findUnique({ where: { path: '/' } });
    }
  } catch (e) {
      console.warn('Failed to fetch Home Page SEO');
  }

  if (pageSeo) {
      return {
          title: pageSeo.title,
          description: pageSeo.description,
          keywords: pageSeo.keywords?.split(','),
          openGraph: pageSeo.ogImage ? { images: [pageSeo.ogImage] } : undefined
      }
  }

  // Default SEO-optimized metadata for homepage
  return {
    title: "Sellaap - Pet Supplies, Beauty, Electronics, Home & Vehicle Accessories",
    description: "Shop top-quality Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories at Sellaap. Fast US shipping and secure checkout on every order.",
    keywords: [
      "pet supplies online", "beauty products", "electronics accessories", "home equipment",
      "vehicle accessories", "online store USA", "fast US shipping", "secure checkout",
      "affordable pet supplies", "beauty essentials", "gadgets and electronics"
    ],
    alternates: {
      canonical: "https://sellaap.com",
    },
    openGraph: {
      title: "Sellaap - Pet Supplies, Beauty, Electronics, Home & Vehicle Accessories",
      description: "Shop top-quality products across Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories. Fast US shipping, secure checkout.",
      url: "https://sellaap.com",
      siteName: "Sellaap",
      images: [
        {
          url: "https://sellaap.com/og-homepage.jpg",
          width: 1200,
          height: 630,
          alt: "Sellaap Online Store",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Sellaap - Pet Supplies, Beauty, Electronics, Home & Vehicle Accessories",
      description: "Shop top-quality products across Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories with fast US shipping.",
      images: ["https://sellaap.com/twitter-homepage.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home() {
  let latestPosts: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    date: Date;
  }> = [];

  try {
    latestPosts = await prisma.post.findMany({
      take: 3,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        date: true,
      },
    });
  } catch (error) {
    console.warn('Failed to fetch latest posts for homepage:', error);
  }

  let siteSettings = null;
  try {
    siteSettings = await getCachedSiteSettings();
  } catch (error) {
    console.warn('Failed to fetch site settings for homepage structured data:', error);
  }

  let niches: Array<{ id: number; slug: string; name: string; image: string | null }> = [];
  let nicheProductRows: Array<{ id: number; slug: string; name: string; products: any[] }> = [];
  try {
    const found = await prisma.category.findMany({
      where: { slug: { in: NICHE_SLUGS } },
      select: { id: true, slug: true, name: true, image: true, children: { select: { id: true } } },
    });
    const ordered = NICHE_SLUGS.map((slug) => found.find((c) => c.slug === slug)).filter(
      (c): c is NonNullable<typeof found[number]> => Boolean(c)
    );
    niches = ordered.map(({ id, slug, name, image }) => ({ id, slug, name, image }));

    nicheProductRows = await Promise.all(
      ordered.map(async (niche) => {
        const categoryIds = [niche.id, ...niche.children.map((c) => c.id)];
        const products = await prisma.product.findMany({
          where: { categoryId: { in: categoryIds } },
          orderBy: { createdAt: 'desc' },
          take: 8,
          select: { id: true, slug: true, name: true, price: true, currency: true, image: true, fallbackImage: true },
        });
        return { id: niche.id, slug: niche.slug, name: niche.name, products };
      })
    );
  } catch (error) {
    console.warn('Failed to fetch niche categories for homepage:', error);
  }

  let featuredProducts: any[] = [];
  try {
    featuredProducts = await getFeaturedProducts();
  } catch (error) {
    console.warn('Failed to fetch featured products for homepage:', error);
  }

  let bestsellerProducts: any[] = [];
  let discountedProducts: any[] = [];
  try {
    [bestsellerProducts, discountedProducts] = await Promise.all([
      getBestsellerProducts(),
      getDiscountedProducts(),
    ]);
  } catch (error) {
    console.warn('Failed to fetch bestseller/discounted products for homepage:', error);
  }

  const socialLinks = [
    siteSettings?.facebookUrl,
    siteSettings?.twitterHandle ? `https://twitter.com/${siteSettings.twitterHandle.replace(/^@/, '')}` : undefined,
    siteSettings?.instagramUrl,
    siteSettings?.youtubeUrl,
    siteSettings?.tiktokUrl,
    siteSettings?.telegramUrl,
  ].filter((url): url is string => Boolean(url));

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomepageStructuredData(socialLinks))
        }}
      />

      <Hero />

      {/* Mobile Navigation Helper */}
      <nav className="lg:hidden bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="text-sm font-medium text-muted-foreground">Quick Navigation</div>
            <div className="flex gap-2">
              <Link href="#categories" className="text-xs px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                Categories
              </Link>
              <Link href="#products" className="text-xs px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                Products
              </Link>
              <Link href="#blog" className="text-xs px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Featured Products Carousel */}
      <FeaturedCarousel products={featuredProducts} />

      {/* Hot Products */}
      <ProductShowcaseCarousel
        title="Hot Products"
        icon={<Flame className="text-primary h-6 w-6" />}
        badge="🔥 Hot"
        products={bestsellerProducts}
      />

      {/* Categories Showcase */}
      {niches.length > 0 && (
        <section id="categories" className="py-12 sm:py-16 lg:py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-5xl">Shop by Category</h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore our top categories, carefully sourced and shipped fast across the USA.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {niches.map((niche) => (
                <Link
                  key={niche.id}
                  href={`/products/${niche.slug}`}
                  className="group block bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square w-full bg-muted overflow-hidden">
                    {niche.image && (
                      <Image
                        src={niche.image}
                        alt={niche.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <span className="font-semibold text-sm">{niche.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Product Shelves */}
      {nicheProductRows.map((row) => (
        <CategoryProductRow
          key={row.id}
          categoryName={row.name}
          categorySlug={row.slug}
          products={row.products}
        />
      ))}

      {/* Discounted Products */}
      <ProductShowcaseCarousel
        title="Discounted Products"
        icon={<Tag className="text-primary h-6 w-6" />}
        products={discountedProducts}
      />

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-muted/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-5xl">Why Shop With Sellaap?</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">A trusted online store for Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
             {[
                {
                  icon: CheckCircle,
                  title: "Wide Selection, Top Categories",
                  description: "From pet supplies to beauty, electronics, home equipment, and vehicle accessories - quality products across every category you need."
                },
                {
                  icon: Truck,
                  title: "Fast & Reliable US Shipping",
                  description: "Orders are shipped quickly across the USA, with tracking provided so you always know where your order is."
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Checkout & Support",
                  description: "Shop with confidence using secure payment methods, and reach our support team anytime you have a question about your order."
                }
             ].map((feature, index) => (
                <div key={index} className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                   <div className="mb-3 sm:mb-4 lg:mb-6">
                      <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
                   </div>
                   <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                   <p className="text-muted-foreground leading-relaxed text-sm lg:text-base group-hover:text-foreground/90 transition-colors duration-300">{feature.description}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-muted/30 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground lg:text-5xl">From the Blog</h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">Buying guides, product tips, and the latest from the Sellaap team.</p>
           </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
             {latestPosts.map((post) => (
                 <article key={post.id} className="bg-card rounded-lg border border-border p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 group">
                    <header className="mb-3 sm:mb-4 lg:mb-6">
                       <time className="text-xs font-medium text-muted-foreground block mb-2 sm:mb-3">
                         {new Date(post.date).toLocaleDateString('en-US', {
                           month: 'short',
                           day: 'numeric',
                           year: 'numeric'
                         })}
                       </time>
                       <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          <Link href={`/blog/${post.slug}`} className="hover:underline">
                             {post.title}
                          </Link>
                       </h3>
                    </header>
                    <p className="text-muted-foreground line-clamp-3 lg:line-clamp-4 leading-relaxed text-sm lg:text-base">
                       {post.excerpt || "Read our latest buying guides and product tips."}
                    </p>
                    <footer className="mt-3 sm:mt-4 lg:mt-6 pt-3 sm:pt-4 border-t border-border/50">
                       <Link href={`/blog/${post.slug}`} className="text-primary hover:text-primary/80 font-medium text-sm lg:text-base group-hover:underline inline-flex items-center">
                          Read More <ArrowRight className="inline-block ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </footer>
                 </article>
              ))}
           </div>
           <div className="text-center mt-8 sm:mt-12 lg:mt-16">
              <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-base sm:text-lg lg:text-xl group">
                 View All Posts <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Ready to Start Shopping?
           </h2>
           <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers across the USA who trust Sellaap for Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories.
           </p>
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                 href="/products"
                 className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold text-purple-600 bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                 Shop Now
              </Link>
              <Link
                 href="/contact"
                 className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold text-white bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20 w-full sm:w-auto"
              >
                 Contact Support
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
