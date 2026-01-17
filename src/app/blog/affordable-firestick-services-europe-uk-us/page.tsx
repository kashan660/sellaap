import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Shield, Star, Clock, Globe, Euro, DollarSign, PoundSterling, Zap, Users, TrendingDown, Award } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Affordable Firestick Services in Europe, UK & US | Save 70% with Sellaap",
    description: "Stop overpaying for Firestick setup! Sellaap offers professional Firestick services at 70% less cost across Europe, UK, and US. Premium setup, instant delivery, 5-star rated.",
    keywords: "cheap firestick setup europe, affordable firestick services uk, budget firestick us, firestick installation cost, sellaap firestick, professional firestick setup, firestick 4k max setup, streaming device setup",
    openGraph: {
      title: "Affordable Firestick Services in Europe, UK & US | Save 70% with Sellaap",
      description: "Professional Firestick setup services at unbeatable prices. Save up to 70% compared to local providers across Europe, UK, and US.",
      type: "article",
      publishedTime: "2024-01-17T00:00:00Z",
      modifiedTime: "2024-01-17T00:00:00Z",
      authors: ["Sellaap Team"],
      siteName: "Sellaap",
      locale: "en_US",
      images: ["/og-affordable-firestick-europe-uk-us.jpg"]
    },
    twitter: {
      card: "summary_large_image",
      title: "Affordable Firestick Services in Europe, UK & US | Save 70% with Sellaap",
      description: "Professional Firestick setup services at unbeatable prices. Save up to 70% compared to local providers.",
      images: ["/og-affordable-firestick-europe-uk-us.jpg"]
    },
    alternates: {
      canonical: "https://sellaap.vercel.app/blog/affordable-firestick-services-europe-uk-us",
      languages: {
        "en-GB": "https://sellaap.vercel.app/uk/blog/affordable-firestick-services-uk",
        "en-US": "https://sellaap.vercel.app/us/blog/affordable-firestick-services-us",
        "en-EU": "https://sellaap.vercel.app/europe/blog/affordable-firestick-services-europe"
      }
    }
  };
}

// FAQ structured data
const faqData = [
  {
    question: "Why are Sellaap's Firestick services so affordable compared to local providers?",
    answer: "Sellaap operates with optimized digital delivery and remote setup services, eliminating physical store overhead costs. We leverage efficient processes and bulk licensing to offer premium services at 70% less than traditional providers."
  },
  {
    question: "Are affordable Firestick services reliable and professional?",
    answer: "Absolutely! Sellaap provides 5-star rated professional setup services with instant delivery, lifetime support, and comprehensive app configuration. Our affordability comes from efficiency, not compromised quality."
  },
  {
    question: "How much can I save with Sellaap in Europe, UK, and US?",
    answer: "Customers save 60-80% compared to local providers: Europe (€59 vs €200-350), UK (£49 vs £180-300), US ($69 vs $250-400). Same professional quality at fraction of the cost."
  },
  {
    question: "What makes Sellaap the best choice for Firestick setup?",
    answer: "Sellaap combines affordability with premium service: instant delivery, 24/7 support, lifetime updates, 1000+ apps, VPN setup, and 5-star customer satisfaction. Professional setup without premium prices."
  },
  {
    question: "Is Sellaap available in my country?",
    answer: "Yes! Sellaap serves all European countries, UK, Ireland, USA, Canada, Australia, and New Zealand. Our digital delivery works globally with region-specific optimizations."
  }
];

// Customer testimonials
const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "London, UK",
    rating: 5,
    text: "Saved £200 compared to local shops! Professional setup, all UK channels working perfectly. Sellaap is a game-changer for affordable streaming.",
    savings: "£200"
  },
  {
    name: "Marco Rossi",
    location: "Milan, Italy",
    rating: 5,
    text: "Incredible value! €59 vs €250 local prices. Got Netflix, Disney+, and all Italian channels. Setup was instant and flawless.",
    savings: "€191"
  },
  {
    name: "Jennifer Chen",
    location: "New York, USA",
    rating: 5,
    text: "Best $69 I ever spent! Local providers wanted $300+. All US streaming apps, sports channels, and VPN included. Highly recommend!",
    savings: "$231"
  }
];

// Regional pricing data
const regionalPricing = [
  {
    region: "Europe",
    flag: "🇪🇺",
    currency: "€",
    localMin: 200,
    localMax: 350,
    sellaapPrice: 59,
    savings: 70,
    icon: Euro,
    gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    border: "border-blue-200 dark:border-blue-800"
  },
  {
    region: "United Kingdom",
    flag: "🇬🇧",
    currency: "£",
    localMin: 180,
    localMax: 300,
    sellaapPrice: 49,
    savings: 75,
    icon: PoundSterling,
    gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
    border: "border-red-200 dark:border-red-800"
  },
  {
    region: "United States",
    flag: "🇺🇸",
    currency: "$",
    localMin: 250,
    localMax: 400,
    sellaapPrice: 69,
    savings: 72,
    icon: DollarSign,
    gradient: "from-blue-50 to-red-50 dark:from-blue-900/20 dark:to-red-900/20",
    border: "border-blue-200 dark:border-blue-800"
  }
];

async function getDigitalProducts() {
  return await prisma.product.findMany({
    where: {
      category: {
        name: {
          in: ["Digital Products", "Software", "Streaming"]
        }
      }
    },
    take: 6,
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function AffordableFirestickBlog() {
  const digitalProducts = await getDigitalProducts();

  // Article structured data
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Affordable Firestick Services in Europe, UK & US | Save 70% with Sellaap",
    "description": "Stop overpaying for Firestick setup! Sellaap offers professional Firestick services at 70% less cost across Europe, UK, and US.",
    "author": {
      "@type": "Organization",
      "name": "Sellaap",
      "url": "https://sellaap.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sellaap",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sellaap.vercel.app/logo.png"
      }
    },
    "datePublished": "2024-01-17T00:00:00Z",
    "dateModified": "2024-01-17T00:00:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://sellaap.vercel.app/blog/affordable-firestick-services-europe-uk-us"
    },
    "image": "https://sellaap.vercel.app/og-affordable-firestick-europe-uk-us.jpg",
    "articleSection": "Technology",
    "articleBody": "Professional Firestick setup services at unbeatable prices across Europe, UK, and US with Sellaap."
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleData, {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }])
        }}
      />

      <article className="min-h-screen bg-background">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-4 mb-8 text-6xl">
              <span>🇪🇺</span>
              <span>🇬🇧</span>
              <span>🇺🇸</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Stop Overpaying for Firestick Setup
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
                  Sellaap offers professional Firestick services at <span className="font-bold text-green-600">70% less cost</span> across Europe, UK, and US. 
                  Premium setup, instant delivery, 5-star rated. Why pay more when you can get the same quality for less?
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  <Link 
                    href="/products"
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg"
                  >
                    Get Affordable Setup Now
                  </Link>
                  <Link 
                    href="/contact"
                    className="border-2 border-primary text-primary px-8 py-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors font-semibold text-lg"
                  >
                    Compare Prices
                  </Link>
                </div>
              </div>
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/firestick-setup-comparison.jpg"
                  alt="Firestick Setup Price Comparison - Sellaap vs Local Providers"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="text-2xl font-bold">Save 70% Today</div>
                    <div className="text-sm opacity-90">Professional setup at unbeatable prices</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>100% Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>5-Star Rated Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span>Save 70% Today</span>
              </div>
            </div>
          </div>
        </header>

        {/* Price Comparison Section */}
        <section className="py-20 bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">See How Much You'll Save</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Compare Sellaap's affordable prices with expensive local providers across Europe, UK, and US
              </p>
            </div>
            
            <div className="mb-16 relative h-64 md:h-80 rounded-2xl overflow-hidden">
              <Image
                src="/price-comparison-chart-firestick.jpg"
                alt="Firestick Price Comparison Chart - Europe UK US Savings"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-center text-white bg-black/50 px-6 py-4 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold mb-2">Save Up to 75%</div>
                  <div className="text-lg">Compared to Local Providers</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {regionalPricing.map((region) => {
                const IconComponent = region.icon;
                return (
                  <div key={region.region} className={`bg-gradient-to-br ${region.gradient} rounded-2xl p-8 border ${region.border}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl">{region.flag}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{region.region}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IconComponent className="w-5 h-5" />
                          <span>Local Currency</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Local Providers:</span>
                        <span className="text-2xl font-bold text-red-600 line-through">
                          {region.currency}{region.localMin}-{region.currency}{region.localMax}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Sellaap Price:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {region.currency}{region.sellaapPrice}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-semibold">Your Savings:</span>
                        <span className="text-2xl font-bold text-green-600">
                          Save {region.savings}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          Save up to {region.currency}{region.localMax - region.sellaapPrice}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Compared to local providers
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg"
              >
                <Zap className="w-5 h-5" />
                Get These Prices Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Real Customers, Real Savings</h2>
              <p className="text-xl text-muted-foreground">See how much our customers saved with Sellaap</p>
            </div>
            
            <div className="mb-16 relative h-48 md:h-64 rounded-2xl overflow-hidden">
              <Image
                src="/happy-customers-firestick-savings.jpg"
                alt="Happy Sellaap Customers Showing Their Firestick Savings"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-2xl font-bold">10,000+ Customers Saved Millions</div>
                  <div className="text-sm opacity-90">Join the smart savers today</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-card p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{testimonial.savings}</div>
                      <div className="text-xs text-muted-foreground">SAVED</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Sellaap */}
        <section className="py-20 bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Smart Buyers Choose Sellaap</h2>
              <p className="text-xl text-muted-foreground">Professional quality at affordable prices</p>
            </div>
            
            <div className="mb-16 relative h-56 md:h-72 rounded-2xl overflow-hidden">
              <Image
                src="/professional-firestick-setup.jpg"
                alt="Professional Firestick Setup Service - Sellaap Quality"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                <div className="text-center text-white bg-black/50 px-8 py-6 rounded-xl">
                  <div className="text-3xl md:text-4xl font-bold mb-2">Professional Quality</div>
                  <div className="text-lg">Same Service, 70% Less Cost</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">70% Lower Prices</h3>
                <p className="text-muted-foreground">Same professional service at fraction of the cost</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
                <p className="text-muted-foreground">Get your setup within minutes, not days</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">100% Secure</h3>
                <p className="text-muted-foreground">Safe payments and guaranteed satisfaction</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">5-Star Service</h3>
                <p className="text-muted-foreground">Rated excellent by thousands of customers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Included */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What's Included in Our Affordable Service</h2>
              <p className="text-xl text-muted-foreground">Everything you need for the perfect streaming experience</p>
            </div>
            
            <div className="mb-16 relative h-48 md:h-64 rounded-2xl overflow-hidden">
              <Image
                src="/firestick-apps-streaming.jpg"
                alt="Firestick Streaming Apps - Netflix Disney+ Prime Video"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-2xl font-bold">1000+ Streaming Apps</div>
                  <div className="text-sm opacity-90">All your favorite content in one place</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">1000+ Streaming Apps</h3>
                </div>
                <p className="text-muted-foreground">Netflix, Disney+, Prime Video, Hulu, BBC iPlayer, and all regional channels</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">VPN Setup Included</h3>
                </div>
                <p className="text-muted-foreground">Access international content safely with professional VPN configuration</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">24/7 Lifetime Support</h3>
                </div>
                <p className="text-muted-foreground">Round-the-clock assistance for any issues or questions</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">Performance Optimization</h3>
                </div>
                <p className="text-muted-foreground">Speed up your Firestick with advanced optimization settings</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">Parental Controls</h3>
                </div>
                <p className="text-muted-foreground">Set up safe viewing with comprehensive parental controls</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold">Free Updates</h3>
                </div>
                <p className="text-muted-foreground">Lifetime access to app updates and new features</p>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Products Cross-sell */}
        {digitalProducts.length > 0 && (
          <section className="py-20 bg-card">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Complete Your Setup with Digital Products</h2>
                <p className="text-xl text-muted-foreground">Enhance your streaming experience with our affordable digital products</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {digitalProducts.map((product) => (
                  <div key={product.id} className="bg-background p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {product.category.name}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {product.price === 0 ? 'Free' : `€${product.price}`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{product.description}</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  href="/digital-products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Browse All Digital Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Everything you need to know about our affordable Firestick services</p>
            </div>
            
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Save 70% on Firestick Setup?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of smart customers who chose Sellaap for affordable, professional Firestick services. 
              Stop overpaying and start streaming today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/products"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
              >
                Get Started Now - Save 70%
              </Link>
              <Link 
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-colors font-semibold text-lg"
              >
                Chat with Expert
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Instant Setup Delivery</span>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}