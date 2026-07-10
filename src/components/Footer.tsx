import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MessageCircle } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { TikTokIcon, TelegramIcon } from "./icons/SocialIcons";

interface FooterProps {
  whatsappNumber?: string | null;
  twitterHandle?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  tiktokUrl?: string | null;
  telegramUrl?: string | null;
}

export function Footer({
  whatsappNumber,
  twitterHandle,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  tiktokUrl,
  telegramUrl,
}: FooterProps) {
  const hasSocialLinks = facebookUrl || twitterHandle || instagramUrl || youtubeUrl || tiktokUrl || telegramUrl;

  return (
    <footer className="bg-muted py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <BrandLogo className="h-8 w-auto" />
            </div>
            <p className="text-muted-foreground">
              Your one-stop shop for premium digital goods. Specializing in Firesticks setup for UK, USA, and Europe.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">Products</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/affiliate" className="text-muted-foreground hover:text-primary font-medium">Affiliate Program</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-muted-foreground hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            {hasSocialLinks && (
              <div className="flex space-x-4 mb-4">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
                )}
                {twitterHandle && (
                  <a href={`https://twitter.com/${twitterHandle.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
                )}
                {youtubeUrl && (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Youtube size={20} /></a>
                )}
                {tiktokUrl && (
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><TikTokIcon size={20} /></a>
                )}
                {telegramUrl && (
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><TelegramIcon size={20} /></a>
                )}
              </div>
            )}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail size={16} />
                <span>support@sellaap.com</span>
              </div>
              {whatsappNumber && (
                <>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone size={16} />
                    <span>+{whatsappNumber}</span>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-[#25D366] hover:text-[#128C7E] transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span className="font-medium">Chat on WhatsApp</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sellaap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
