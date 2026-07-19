import { seoKeywords, contentTemplates } from '@/data/seo-keywords';

export type Market = 'uk' | 'us' | 'canada' | 'europe' | 'australia';

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://sellaap.com';
}

// Generate SEO-friendly meta tags for products
export function generateProductMeta(product: any, location: Market = 'uk') {
  const description = product.description
    ? product.description.slice(0, 155)
    : `Shop ${product.name} at Sellaap with fast US shipping and secure checkout.`;

  return {
    title: product.name,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.category?.name?.toLowerCase(),
      'online store USA',
      'fast US shipping',
    ].filter(Boolean).join(', '),
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      images: product.image ? [product.image] : [product.fallbackImage],
      siteName: 'Sellaap',
      locale: getLocale(location),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: product.image ? [product.image] : [product.fallbackImage],
    }
  };
}

// Generate structured data for products
export function generateProductStructuredData(product: any, location: Market = 'uk') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Sellaap'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: getCurrency(location),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Sellaap'
      }
    }
  };
}

// Generate Organization structured data, site-wide
export function generateOrganizationStructuredData(socialLinks: string[] = []) {
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sellaap',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  };
}

// Generate BreadcrumbList structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Generate structured data (alias for generateProductStructuredData)
export function generateStructuredData(product: any, location: Market = 'uk') {
  return generateProductStructuredData(product, location);
}

// Generate blog post meta tags
export function generateBlogMeta(post: any, location: Market = 'uk') {
  const locationKeywords = seoKeywords[location];
  
  return {
    title: `${post.title} - ${post.metaTitle || 'Firestick Setup Guide'} | Sellaap ${location.toUpperCase()}`,
    description: post.metaDescription || post.excerpt || `${post.title} - Complete guide for ${locationKeywords.primary[0]}`,
    keywords: [
      ...locationKeywords.primary.slice(0, 2),
      ...locationKeywords.longTail.slice(0, 3),
      'firestick-guide',
      'streaming-tutorial',
      'setup-instructions'
    ].join(', '),
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      author: 'Sellaap Team',
      siteName: 'Sellaap',
      locale: getLocale(location),
      images: post.imageUrl ? [post.imageUrl] : ['/og-image.jpg']
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : ['/og-image.jpg']
    }
  };
}

// Generate category meta tags
export function generateCategoryMeta(category: any, location: Market = 'uk') {
  const description = category.description || `Browse our ${category.name} collection at Sellaap, with fast US shipping and secure checkout.`;

  return {
    title: category.name,
    description,
    keywords: [category.name.toLowerCase(), 'online store USA', 'fast US shipping'].join(', '),
    openGraph: {
      title: category.name,
      description,
      type: 'website',
      siteName: 'Sellaap',
      locale: getLocale(location)
    }
  };
}

// Generate location-specific landing page meta
export function generateLocationMeta(location: Market) {
  const locationKeywords = seoKeywords[location];
  
  return {
    title: `Firestick Setup Service ${location.toUpperCase()} - Professional Installation | Sellaap`,
    description: contentTemplates.metaDescriptions[location],
    keywords: [
      ...locationKeywords.primary,
      ...locationKeywords.locationSpecific.slice(0, 5),
      ...locationKeywords.buyerIntent.slice(0, 3),
      'firestick-setup-service',
      'professional-installation'
    ].join(', '),
    openGraph: {
      title: `Firestick Setup Service ${location.toUpperCase()} - Sellaap`,
      description: contentTemplates.metaDescriptions[location],
      type: 'website',
      siteName: 'Sellaap',
      locale: getLocale(location)
    },
    twitter: {
      card: 'summary_large_image',
      title: `Firestick Setup Service ${location.toUpperCase()} - Sellaap`,
      description: contentTemplates.metaDescriptions[location]
    }
  };
}

// Helper functions
function getLocale(location: Market): string {
  const localeMap = {
    uk: 'en_GB',
    us: 'en_US',
    canada: 'en_CA',
    europe: 'en_EU',
    australia: 'en_AU'
  };
  return localeMap[location];
}

function getCurrency(location: Market): string {
  const currencyMap = {
    uk: 'GBP',
    us: 'USD',
    canada: 'CAD',
    europe: 'EUR',
    australia: 'AUD'
  };
  return currencyMap[location];
}

// Generate hreflang tags for international SEO
export function generateHreflangTags(path: string, markets: Market[] = ['uk', 'us', 'canada', 'europe', 'australia']) {
  const baseUrl = getSiteUrl();
  return markets.map(market => ({
    rel: 'alternate',
    hrefLang: getLocale(market).replace('_', '-'),
    href: `${baseUrl}/${market}${path}`
  }));
}

// Generate canonical URL for international pages
export function generateCanonicalUrl(path: string, market: Market) {
  return `${getSiteUrl()}/${market}${path}`;
}

// Create FAQ content for different markets
export function generateMarketFAQs(location: Market) {
  const faqs = contentTemplates.faqQuestions[location];
  const marketSpecific = {
    uk: [
      { question: faqs[0], answer: "Yes, we fully support BBC iPlayer, ITV Hub, All 4, My5, and all major UK streaming services." },
      { question: faqs[1], answer: "Absolutely! Our setup includes VPN configuration so you can watch UK TV channels from anywhere in the world." },
      { question: faqs[2], answer: "Yes, our service is completely legal in the UK. We provide professional setup and configuration services." },
      { question: faqs[3], answer: "Yes, we offer same-day setup service in London and surrounding areas. Contact us for availability." },
      { question: faqs[4], answer: "We include 1000+ channels including BBC iPlayer, ITV Hub, Netflix, Disney+, Amazon Prime, and many more." }
    ],
    us: [
      { question: faqs[0], answer: "Yes, we fully support Netflix, Hulu, Disney+, HBO Max, Amazon Prime, and all major US streaming services." },
      { question: faqs[1], answer: "Absolutely! We configure your Firestick to access all major US channels and streaming platforms." },
      { question: faqs[2], answer: "Yes, our service is completely legal in the US. We provide professional setup and configuration services." },
      { question: faqs[3], answer: "Yes, we offer setup services in New York, Los Angeles, and major US cities. Contact us for availability." },
      { question: faqs[4], answer: "We include 1000+ channels and streaming services including Netflix, Hulu, Disney+, HBO Max, and many more." }
    ],
    canada: [
      { question: faqs[0], answer: "Yes, we fully support Crave, CBC Gem, CTV, TSN, and all major Canadian streaming services." },
      { question: faqs[1], answer: "Absolutely! Our setup includes configuration so you can watch Canadian TV channels from anywhere." },
      { question: faqs[2], answer: "Yes, our service is completely legal in Canada. We provide professional setup and configuration services." },
      { question: faqs[3], answer: "Yes, we offer setup services in Toronto, Vancouver, and major Canadian cities. Contact us for availability." },
      { question: faqs[4], answer: "We include 1000+ channels including Crave, CBC Gem, Netflix, Disney+, Amazon Prime, and many more." }
    ],
    europe: [
      { question: faqs[0], answer: "Yes, we support 10+ languages and can configure your Firestick for multilingual streaming across Europe." },
      { question: faqs[1], answer: "Absolutely! We configure access to channels and streaming services from different EU countries." },
      { question: faqs[2], answer: "Yes, our service is completely legal in the EU. We provide professional setup and configuration services." },
      { question: faqs[3], answer: "Yes, we offer setup services in major EU cities including Berlin, Paris, Madrid, Rome, and Amsterdam." },
      { question: faqs[4], answer: "We include 1000+ channels including Eurosport, Netflix, Disney+, local European channels, and many more." }
    ],
    australia: [
      { question: faqs[0], answer: "Yes, we fully support Stan, ABC iview, SBS On Demand, 10 Play, and all major Australian streaming services." },
      { question: faqs[1], answer: "Absolutely! Our setup includes configuration so you can watch Australian TV channels from anywhere." },
      { question: faqs[2], answer: "Yes, our service is completely legal in Australia. We provide professional setup and configuration services." },
      { question: faqs[3], answer: "Yes, we offer setup services in Sydney, Melbourne, Brisbane, and major Australian cities. Contact us for availability." },
      { question: faqs[4], answer: "We include 1000+ channels including Stan, ABC iview, Netflix, Disney+, Amazon Prime, and many more." }
    ]
  };
  
  return marketSpecific[location];
}