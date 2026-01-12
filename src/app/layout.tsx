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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sellaap - Premium Digital Goods & Firestick Setup",
  description: "Your trusted source for digital goods and Firestick setup in UK, USA, and Europe. Best prices for IPTV packages and Firestick deals.",
  keywords: "cheap iptv packages, firestick cheap price, best price firestick, Firestick setup, digital goods, IPTV setup, UK Firestick, USA Firestick, Europe Firestick, digital products, streaming devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <WhatsAppButton />
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
