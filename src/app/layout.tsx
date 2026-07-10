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

  const title = seoSettings?.siteTitle || "Sellaap - Premium Digital Goods & Firestick Setup";
  const description = seoSettings?.siteDescription || "Your trusted source for digital goods and Firestick setup in UK, USA, and Europe. Best prices for IPTV packages and Firestick deals.";
  const keywords = seoSettings?.defaultKeywords ? seoSettings.defaultKeywords.split(',') : [
    "cheap iptv packages", 
    "firestick cheap price", 
    "best price firestick", 
    "Firestick setup", 
    "digital goods", 
    "IPTV setup", 
    "UK Firestick", 
    "USA Firestick", 
    "Europe Firestick", 
    "digital products", 
    "streaming devices"
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
        <meta name="impact-site-verification" {...{ value: "380f7184-0687-4d01-82e9-ee4e63a86ec7" }} />
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
