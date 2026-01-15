import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateLocationMeta, generateMarketFAQs, generateHreflangTags } from '@/lib/seo-utils';
import { seoKeywords, blogTopics } from '@/data/seo-keywords';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, Globe, Shield, Clock, Star, CheckCircle } from 'lucide-react';

// Valid locations for SEO
const validLocations = ['uk', 'us', 'canada', 'europe', 'australia'] as const;
type Location = typeof validLocations[number];

interface Props {
  params: {
    location: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = params.location as Location;
  
  if (!validLocations.includes(location)) {
    return {
      title: 'Page Not Found - Sellaap',
      description: 'The page you are looking for does not exist.'
    };
  }
  
  const meta = generateLocationMeta(location);
  const hreflangTags = generateHreflangTags('/', validLocations);
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://sellaap.vercel.app/${location}`,
      languages: Object.fromEntries(
        hreflangTags.map(tag => [tag.hrefLang, tag.href])
      )
    },
    openGraph: {
      ...meta.openGraph,
      url: `https://sellaap.vercel.app/${location}`,
      images: ['/og-image-location.jpg']
    },
    twitter: meta.twitter
  };
}

// Server component for location-specific pages
export default async function LocationPage({ params }: Props) {
  const location = params.location as Location;
  
  if (!validLocations.includes(location)) {
    notFound();
  }
  
  // Fetch products and posts for this location
  const [products, recentPosts] = await Promise.all([
    prisma.product.findMany({
      take: 6,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.findMany({
      take: 3,
      orderBy: { date: 'desc' }
    })
  ]);
  
  const locationData = seoKeywords[location];
  const faqs = generateMarketFAQs(location);
  const blogPosts = blogTopics[location].slice(0, 4);
  
  // Location-specific content
  const locationContent = {
    uk: {
      flag: '🇬🇧',
      title: 'Professional Firestick Setup Service UK',
      subtitle: 'Transform your TV experience with expert Firestick 4K Max setup across the United Kingdom',
      locations: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds', 'Edinburgh'],
      features: ['BBC iPlayer', 'ITV Hub', 'All 4', 'My5', 'Netflix', 'Disney+', 'Amazon Prime']
    },
    us: {
      flag: '🇺🇸',
      title: 'Expert Firestick Setup Service USA',
      subtitle: 'Upgrade your streaming with professional Firestick 4K Max setup across America',
      locations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
      features: ['Netflix', 'Hulu', 'Disney+', 'HBO Max', 'Amazon Prime', 'Apple TV+', 'Paramount+']
    },
    canada: {
      flag: '🇨🇦',
      title: 'Premium Firestick Setup Service Canada',
      subtitle: 'Experience Canadian streaming at its best with professional Firestick setup',
      locations: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec'],
      features: ['Crave', 'CBC Gem', 'CTV', 'TSN', 'Netflix', 'Disney+', 'Amazon Prime']
    },
    europe: {
      flag: '🇪🇺',
      title: 'Multilingual Firestick Setup Service Europe',
      subtitle: 'Enjoy European streaming with professional Firestick setup across the continent',
      locations: ['Berlin', 'Paris', 'Madrid', 'Rome', 'Amsterdam', 'Brussels', 'Vienna', 'Stockholm'],
      features: ['Eurosport', 'Netflix', 'Disney+', 'Local Channels', 'Multilingual Support']
    },
    australia: {
      flag: '🇦🇺',
      title: 'Professional Firestick Setup Service Australia',
      subtitle: 'Get the ultimate Australian streaming experience with expert Firestick setup',
      locations: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra'],
      features: ['Stan', 'ABC iview', 'SBS On Demand', '10 Play', 'Netflix', 'Disney+', 'Amazon Prime']
    }
  };
  
  const content = locationContent[location];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{content.flag}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {content.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href={`/${location}/products`}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                View Products
              </Link>
              <Link 
                href={`/${location}/contact`}
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-semibold"
              >
                Get Setup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What's Included in Your Setup</h2>
            <p className="text-lg text-muted-foreground">Professional setup with lifetime support</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1000+ Channels</h3>
              <p className="text-muted-foreground">Access to {content.features.length}+ premium streaming services</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifetime Support</h3>
              <p className="text-muted-foreground">24/7 technical support for all your streaming needs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Same-Day Setup</h3>
              <p className="text-muted-foreground">Professional installation within 24 hours</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Service</h3>
              <p className="text-muted-foreground">Rated 4.8/5 by 127+ satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Available in Major Cities</h2>
            <p className="text-lg text-muted-foreground">Professional setup service across {location.toUpperCase()}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.locations.map((city) => (
              <div key={city} className="bg-card p-4 rounded-lg text-center hover:shadow-lg transition-shadow">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <p className="font-medium">{city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Popular Streaming Services</h2>
            <p className="text-lg text-muted-foreground">All your favorite platforms, professionally configured</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {content.features.map((service) => (
              <div key={service} className="bg-background p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <p className="text-sm font-medium">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      {products.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-4">Popular Products</h2>
                <p className="text-lg text-muted-foreground">Top-rated Firestick setups for {location.toUpperCase()}</p>
              </div>
              <Link 
                href={`/${location}/products`}
                className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-4xl">📺</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <Link 
                        href={`/${location}/products/${product.slug}`}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-4">Latest Guides</h2>
                <p className="text-lg text-muted-foreground">Expert tips and tutorials for {location.toUpperCase()}</p>
              </div>
              <Link 
                href={`/${location}/blog`}
                className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
              >
                All Posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.id} className="bg-background rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-4xl">📝</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <Link 
                        href={`/${location}/blog/${post.slug}`}
                        className="text-primary hover:text-primary/80 font-semibold"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about our {location.toUpperCase()} service</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your TV Experience?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers across {location.toUpperCase()} who have upgraded their streaming with our professional Firestick setup service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href={`/${location}/contact`}
              className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Get Started Today
            </Link>
            <Link 
              href={`/${location}/products`}
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}