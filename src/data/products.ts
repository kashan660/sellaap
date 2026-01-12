
export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category?: string;
  fallbackImage: string; // Remote URL to use if local image is not found
  image?: string; // Resolved image path (populated at runtime)
}

export const rawProducts: Product[] = [
  {
    id: 1,
    slug: "firestick-uk",
    name: "Firestick 4K Max Setup Bundle (UK)",
    description: "Complete setup for UK channels, sports, and movies. Includes premium support.",
    price: 49.99,
    currency: "USD",
    category: "Firestick Setup",
    fallbackImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    slug: "firestick-usa",
    name: "Firestick 4K Max Setup Bundle (USA)",
    description: "Complete setup for USA channels, sports, and movies. Includes premium support.",
    price: 49.99,
    currency: "USD",
    category: "Firestick Setup",
    fallbackImage: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    slug: "firestick-europe",
    name: "Firestick 4K Max Setup Bundle (Europe)",
    description: "Complete setup for European channels (FR, DE, ES, IT). Includes premium support.",
    price: 59.99,
    currency: "USD",
    category: "Firestick Setup",
    fallbackImage: "https://images.unsplash.com/photo-1522869635100-1f4d061dd70f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    slug: "iptv-subscription",
    name: "Premium IPTV 12 Months",
    description: "Access to 10,000+ channels and VOD. Stable and buffer-free.",
    price: 79.99,
    currency: "USD",
    category: "Subscription",
    fallbackImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    slug: "vpn-service",
    name: "VPN Service - 1 Year",
    description: "Secure your connection and bypass geo-restrictions with our recommended VPN.",
    price: 39.99,
    currency: "USD",
    category: "Software",
    fallbackImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    slug: "firestick-remote",
    name: "Firestick Remote Replacement",
    description: "Original Firestick voice remote control.",
    price: 29.99,
    currency: "USD",
    category: "Accessories",
    fallbackImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80",
  },
];
