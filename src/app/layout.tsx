import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthProvider } from "@/components/providers/SessionProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { prisma } from "@/lib/prisma";
import { getCachedSiteSettings } from "@/lib/cache";
import { ImpactAffiliateScript } from "@/components/AffiliateScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let seoSettings = null;
  try {
    // Check if seoSettings model exists on prisma instance (safe guard for when prisma generate hasn't run)
    if ((prisma as any).seoSettings) {
      seoSettings = await prisma.seoSettings.findFirst();
    }
  } catch (error) {
    console.warn("Failed to fetch SEO settings (using defaults):", error);
  }

  const title = seoSettings?.siteTitle || "Sellaap - Pet Supplies, Beauty, Electronics, Home & Vehicle Accessories";
  const description = seoSettings?.siteDescription || "Shop top-quality Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories at Sellaap, with fast US shipping and secure checkout.";
  const keywords = seoSettings?.defaultKeywords ? seoSettings.defaultKeywords.split(',') : [
    "pet supplies",
    "beauty products",
    "electronics accessories",
    "home equipment",
    "vehicle accessories",
    "online store USA",
    "fast US shipping",
    "secure checkout"
  ];

  return {
    title: {
      default: title,
      template: `%s | ${title.split(' - ')[0] || 'Sellaap'}`,
    },
    description: description,
    keywords: keywords,
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://sellaap.com'),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXTAUTH_URL,
      title: title,
      description: description,
      siteName: 'Sellaap',
      images: seoSettings?.ogImage ? [{ url: seoSettings.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: seoSettings?.ogImage ? [seoSettings.ogImage] : [],
      creator: seoSettings?.twitterHandle || undefined,
    },
    verification: {
      google: seoSettings?.googleVerification,
      other: {
        'msvalidate.01': seoSettings?.bingVerification || '',
      }
    },
    icons: {
      icon: '/favicon.svg?v=3',
      apple: '/apple-icon.svg?v=3',
      shortcut: '/favicon.svg?v=3',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let siteSettings = null;
  try {
    siteSettings = await getCachedSiteSettings();
  } catch (error) {
    console.warn("Failed to fetch site settings (using defaults):", error);
  }

  return (
    <html lang="en">
      <head>
        <meta name="impact-site-verification" {...{ value: "720c622f-6aac-4450-827d-674c2dffec26" }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ImpactAffiliateScript />
        <AuthProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartProvider>
                <Navbar />
                <CartDrawer />
                <main className="flex-grow pt-16">
                  {children}
                </main>
                <WhatsAppButton phoneNumber={siteSettings?.whatsappNumber} />
                <Footer
                  whatsappNumber={siteSettings?.whatsappNumber}
                  twitterHandle={siteSettings?.twitterHandle}
                  facebookUrl={siteSettings?.facebookUrl}
                  instagramUrl={siteSettings?.instagramUrl}
                  youtubeUrl={siteSettings?.youtubeUrl}
                  tiktokUrl={siteSettings?.tiktokUrl}
                  telegramUrl={siteSettings?.telegramUrl}
                />
              </CartProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
