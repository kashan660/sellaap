import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, Shield, Star } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Complete Firestick Setup Guide for UK Users 2024 | Sellaap",
    description: "Professional Firestick 4K Max setup guide for UK users. Step-by-step instructions for BBC iPlayer, ITV Hub, Netflix setup. Expert tips and troubleshooting.",
    keywords: "firestick setup uk, firestick 4k max setup guide uk, bbc iplayer firestick, itv hub firestick, uk firestick channels, firestick installation uk",
    openGraph: {
      title: "Complete Firestick Setup Guide for UK Users 2024",
      description: "Professional step-by-step Firestick setup guide for UK users. Get BBC iPlayer, ITV Hub, Netflix and 1000+ channels.",
      type: "article",
      publishedTime: "2024-01-16T00:00:00Z",
      modifiedTime: "2024-01-16T00:00:00Z",
      authors: ["Sellaap Team"],
      siteName: "Sellaap",
      locale: "en_GB",
      images: ["/og-firestick-setup-uk.jpg"]
    },
    twitter: {
      card: "summary_large_image",
      title: "Complete Firestick Setup Guide for UK Users 2024",
      description: "Professional step-by-step Firestick setup guide for UK users. Get BBC iPlayer, ITV Hub, Netflix and 1000+ channels.",
      images: ["/og-firestick-setup-uk.jpg"]
    },
    alternates: {
      canonical: "https://sellaap.vercel.app/blog/firestick-setup-uk-complete-guide",
      languages: {
        "en-US": "https://sellaap.vercel.app/us/blog/firestick-setup-us-complete-guide",
        "en-CA": "https://sellaap.vercel.app/canada/blog/firestick-setup-canada-complete-guide",
        "en-AU": "https://sellaap.vercel.app/australia/blog/firestick-setup-australia-complete-guide"
      }
    }
  };
}

// FAQ structured data
const faqData = [
  {
    question: "Is Firestick setup legal in the UK?",
    answer: "Yes, Firestick setup is completely legal in the UK. We provide professional configuration services for legitimate streaming apps like BBC iPlayer, ITV Hub, Netflix, and other official services."
  },
  {
    question: "How long does Firestick setup take?",
    answer: "Professional Firestick setup typically takes 30-45 minutes. This includes app installation, account configuration, optimization settings, and testing all services."
  },
  {
    question: "Can I watch UK TV channels abroad with Firestick?",
    answer: "Yes, with proper VPN configuration, you can access UK TV channels like BBC iPlayer, ITV Hub, and All 4 from anywhere in the world. We include VPN setup in our service."
  },
  {
    question: "What apps are included in UK Firestick setup?",
    answer: "We install and configure BBC iPlayer, ITV Hub, All 4, My5, Netflix, Disney+, Amazon Prime Video, Apple TV+, and 1000+ other streaming apps."
  },
  {
    question: "Do you offer same-day Firestick setup in London?",
    answer: "Yes, we offer same-day professional Firestick setup service in London and surrounding areas. Contact us for availability and booking."
  }
];

export default async function FirestickSetupUKGuide() {
  // Get related products
  const products = await prisma.product.findMany({
    take: 3,
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  // Article structured data
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete Firestick Setup Guide for UK Users 2024",
    "description": "Professional step-by-step Firestick setup guide for UK users including BBC iPlayer, ITV Hub, and Netflix configuration.",
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
    "datePublished": "2024-01-16T00:00:00Z",
    "dateModified": "2024-01-16T00:00:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://sellaap.vercel.app/blog/firestick-setup-uk-complete-guide"
    },
    "image": "https://sellaap.vercel.app/og-firestick-setup-uk.jpg",
    "articleSection": "Technology",
    "articleBody": "Complete guide to setting up Firestick 4K Max for UK users with professional tips and troubleshooting."
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
        <header className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-6xl mb-6">🇬🇧</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Firestick Setup Guide for UK Users
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Professional step-by-step guide to setting up your Firestick 4K Max in the UK. 
              Get BBC iPlayer, ITV Hub, Netflix, and 1000+ channels with expert configuration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/uk/contact"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Get Professional Setup
              </Link>
              <Link 
                href="/uk/products"
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-semibold"
              >
                Browse Firestick Products
              </Link>
            </div>
          </div>
        </header>

        {/* Introduction */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Setting up a Firestick in the UK requires careful configuration to access all your favorite 
                British streaming services. This comprehensive guide will walk you through the entire process, 
                from basic setup to advanced optimization for UK-specific content.
              </p>
            </div>
          </div>
        </section>

        {/* What You'll Need */}
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">What You'll Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Essential Items:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Amazon Firestick 4K Max (recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>UK Amazon account</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Stable Wi-Fi connection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>HDMI port on your TV</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Optional (Recommended):</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>VPN service for international content</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Micro-USB extension cable</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Ethernet adapter for stable connection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Setup */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Step-by-Step Setup Process</h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Physical Setup</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your Firestick to your TV's HDMI port and plug the power adapter into a wall outlet. 
                    Use the included HDMI extender if needed for better Wi-Fi reception.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <strong>Pro Tip:</strong> For optimal performance, use the official Amazon power adapter rather than your TV's USB port.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Initial Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    Turn on your TV and select the correct HDMI input. Follow the on-screen instructions to connect to Wi-Fi 
                    and sign in with your UK Amazon account.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Select your language (English - United Kingdom)</li>
                    <li>Connect to your Wi-Fi network</li>
                    <li>Sign in with your Amazon.co.uk account</li>
                    <li>Enable location services for UK content</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Install UK Streaming Apps</h3>
                  <p className="text-muted-foreground mb-4">
                    Navigate to the Amazon Appstore and install these essential UK streaming apps:
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">📺 BBC iPlayer</h4>
                      <p className="text-sm text-muted-foreground">UK's most popular streaming service</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">📺 ITV Hub</h4>
                      <p className="text-sm text-muted-foreground">ITV channels and exclusive content</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">📺 All 4</h4>
                      <p className="text-sm text-muted-foreground">Channel 4's streaming platform</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">📺 My5</h4>
                      <p className="text-sm text-muted-foreground">Channel 5's on-demand service</p>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <strong>Additional Apps:</strong> Netflix, Disney+, Amazon Prime Video, Apple TV+, Paramount+
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Account Setup & Verification</h3>
                  <p className="text-muted-foreground mb-4">
                    Sign in to each app with your UK accounts. For BBC iPlayer, you'll need a valid UK TV License.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <strong className="text-yellow-800">Important:</strong> BBC iPlayer requires a UK TV License. 
                    Make sure you have a valid license before accessing BBC content.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Optimization Tips */}
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">UK-Specific Optimization Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-green-500 mr-2" />
                  Privacy & Security
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Enable parental controls for family viewing</li>
                  <li>• Set up VPN for international content access</li>
                  <li>• Configure privacy settings in each app</li>
                  <li>• Use strong passwords for all accounts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  Performance Optimization
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Clear cache regularly for smooth performance</li>
                  <li>• Update apps frequently for latest features</li>
                  <li>• Use Ethernet adapter for stable connection</li>
                  <li>• Position Firestick for optimal Wi-Fi reception</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Common Issues & Solutions */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Common UK Firestick Issues & Solutions</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">BBC iPlayer Not Working</h3>
                <p className="text-muted-foreground mb-3">
                  Ensure you have a valid UK TV License and your Amazon account is registered to a UK address.
                </p>
                <div className="bg-muted p-3 rounded">
                  <strong>Solution:</strong> Clear BBC iPlayer app cache, restart Firestick, and re-authenticate with your UK account.
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">ITV Hub Buffering Issues</h3>
                <p className="text-muted-foreground mb-3">
                  ITV Hub may buffer during peak hours or with slower internet connections.
                </p>
                <div className="bg-muted p-3 rounded">
                  <strong>Solution:</strong> Check your internet speed (minimum 5 Mbps recommended), use Ethernet connection if possible, and lower video quality during peak times.
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Apps Not Available in UK</h3>
                <p className="text-muted-foreground mb-3">
                  Some apps may not appear in your Amazon Appstore due to regional restrictions.
                </p>
                <div className="bg-muted p-3 rounded">
                  <strong>Solution:</strong> Ensure your Amazon account is registered to a UK address, or use a VPN service to access UK-specific content.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-background p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {products.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Recommended Firestick Products</h2>
                  <p className="text-lg text-muted-foreground">Top-rated Firestick setups for UK users</p>
                </div>
                <Link 
                  href="/uk/products"
                  className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
                >
                  View All Products <ArrowRight className="w-4 h-4" />
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
                          href={`/uk/products/${product.slug}`}
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

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Set Up Your Firestick?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get professional Firestick setup service in the UK. Same-day installation with lifetime support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/uk/contact"
                className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Book Professional Setup
              </Link>
              <Link 
                href="/uk/products"
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold"
              >
                Browse Firestick Products
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}