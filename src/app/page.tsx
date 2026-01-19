import { Hero } from "@/components/Hero";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, ShoppingCart } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

// Structured data for homepage
function generateHomepageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sellaap",
    "alternateName": "Sellaap Digital Goods Marketplace",
    "url": "https://sellaap.com",
    "description": "Premium Firestick setup services and digital goods marketplace with instant delivery across UK, USA, Europe, Canada, and Australia.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sellaap.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/sellaap",
      "https://facebook.com/sellaap",
      "https://instagram.com/sellaap"
    ],
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "9.99",
      "highPrice": "199.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Country", 
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "Canada"
      },
      {
        "@type": "Country",
        "name": "Australia"
      },
      {
        "@type": "Continent",
        "name": "Europe"
      }
    ],
    "mainEntity": {
      "@type": "Organization",
      "name": "Sellaap",
      "description": "Premium digital goods marketplace specializing in Firestick setup services and digital entertainment solutions.",
      "url": "https://sellaap.com",
      "logo": "https://sellaap.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-SELLAAP",
        "contactType": "customer service",
        "email": "service@sellaap.com",
        "availableLanguage": ["English"],
        "areaServed": ["GB", "US", "CA", "AU", "EU"]
      },
      "sameAs": [
        "https://sellaap.com",
        "https://twitter.com/sellaap",
        "https://facebook.com/sellaap"
      ]
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
    title: "Sellaap - Premium Digital Goods Marketplace | Firestick Setup & Digital Products",
    description: "Discover premium digital goods, Firestick setup services, and instant digital product delivery. Shop with confidence using PayPal, Payoneer, and secure payment methods. Global coverage for UK, USA, Europe, Canada, and Australia.",
    keywords: [
      "digital goods marketplace", "Firestick setup services", "premium digital products", 
      "instant digital delivery", "UK Firestick setup", "USA digital goods", "European marketplace",
      "PayPal digital products", "Payoneer payments", "secure digital downloads", "streaming setup",
      "digital entertainment", "online marketplace", "digital services", "Firestick configuration"
    ],
    alternates: {
      canonical: "https://sellaap.com",
    },
    openGraph: {
      title: "Sellaap - Premium Digital Goods Marketplace",
      description: "Premium Firestick setup services and digital goods with instant delivery. Secure payments via PayPal, Payoneer. Global coverage for UK, USA, Europe.",
      url: "https://sellaap.com",
      siteName: "Sellaap",
      images: [
        {
          url: "https://sellaap.com/og-homepage.jpg",
          width: 1200,
          height: 630,
          alt: "Sellaap - Premium Digital Goods Marketplace",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Sellaap - Premium Digital Goods Marketplace",
      description: "Premium Firestick setup services and digital goods with instant delivery. Secure payments via PayPal, Payoneer.",
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
  const featuredProducts = await getFeaturedProducts();
  const latestPosts = await prisma.post.findMany({
    take: 3,
    orderBy: { date: 'desc' }
  });

  // Mock data for static test
  // const featuredProducts = [
  //   {
  //       id: 1,
  //       slug: "test-product",
  //       name: "Test Product",
  //       description: "This is a static test product",
  //       price: 9.99,
  //       currency: "USD",
  //       fallbackImage: "https://placehold.co/600x400",
  //       image: "https://placehold.co/600x400"
  //   }
  // ];

  // const latestPosts = [
  //   {
  //       id: 1,
  //       slug: "test-post",
  //       title: "Test Post",
  //       excerpt: "This is a static test post",
  //       date: new Date(),
  //       category: "Test"
  //   }
  // ];

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomepageStructuredData())
        }}
      />
      
      <Hero />
      
      {/* Mobile Navigation Helper */}
      <nav className="lg:hidden bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="text-sm font-medium text-muted-foreground">Quick Navigation</div>
            <div className="flex gap-2">
              <Link href="#features" className="text-xs px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                Features
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
      
      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-muted/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-5xl">Why Choose Sellaap for Digital Goods?</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">Premium Firestick setup services and digital products with instant delivery across UK, USA, Europe, Canada, and Australia.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
             {[
                { 
                  title: "Premium Firestick Setup Services", 
                  description: "Professional Firestick configuration with premium streaming apps, VPN setup, and optimization for 4K streaming. Available for UK, USA, European, Canadian, and Australian customers."
                },
                { 
                  title: "24/7 Technical Support", 
                  description: "Expert assistance for Firestick troubleshooting, app installation, and streaming optimization. Get help anytime with our dedicated support team across all time zones."
                },
                { 
                  title: "Instant Digital Delivery", 
                  description: "Receive your Firestick setup instructions, digital goods, and premium apps immediately after secure payment via PayPal, Payoneer, or direct vendor transfer."
                }
             ].map((feature, index) => (
                <div key={index} className="bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-border hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                   <div className="mb-3 sm:mb-4 lg:mb-6">
                      <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
                   </div>
                   <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                   <p className="text-muted-foreground leading-relaxed text-sm lg:text-base group-hover:text-foreground/90 transition-colors duration-300">{feature.description}</p>
                   <div className="mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-primary font-medium">Learn more →</span>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-12 sm:py-16 lg:py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground lg:text-5xl">Premium Firestick Setup Services & Digital Products</h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">Discover our most popular Firestick configuration packages, premium streaming apps, and digital entertainment solutions with instant delivery across UK, USA, Europe, Canada, and Australia.</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                 <article key={product.id} className="group relative bg-card rounded-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                       <Image 
                          src={product.image || product.fallbackImage} 
                          alt={`${product.name} - Premium Firestick setup service and digital product`}
                          fill
                          unoptimized={!!(product.image?.startsWith('http') || product.fallbackImage.startsWith('http'))}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Sale
                       </div>
                    </div>
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow">
                       <header className="mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                             <Link href={`/products/${product.slug}`} className="hover:underline">
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                             </Link>
                          </h3>
                       </header>
                       <p className="text-muted-foreground text-sm lg:text-base mb-4 sm:mb-6 flex-grow leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">{product.description}</p>
                       <footer className="flex justify-between items-center mt-auto relative z-10 pt-3 sm:pt-4 border-t border-border/50">
                          <div className="flex flex-col">
                             <span className="text-xl sm:text-2xl font-bold text-primary">
                               <Price amount={product.price} baseCurrency={product.currency} />
                             </span>
                             <span className="text-xs text-muted-foreground">Instant delivery</span>
                          </div>
                          <AddToCartButton product={product} />
                       </footer>
                    </div>
                 </article>
              ))}
           </div>
           <div className="text-center mt-8 sm:mt-12 lg:mt-16">
              <Link href="/products" className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-base sm:text-lg lg:text-xl group">
                 View All Firestick Setup Services <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-muted/30 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground lg:text-5xl">Firestick Setup Guides & Digital Entertainment Tips</h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">Expert advice on Firestick optimization, streaming setup, digital entertainment trends, and marketplace insights for UK, USA, European, Canadian, and Australian users.</p>
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
                       {post.excerpt}
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
                 View All Firestick Guides <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Ready to Transform Your Streaming Experience?
           </h2>
           <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers across the UK, USA, Europe, Canada, and Australia who trust Sellaap for premium Firestick setup services and digital entertainment solutions.
           </p>
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                 href="/products"
                 className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold text-purple-600 bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                 Get Started Today
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
