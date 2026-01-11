import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Sellaap</h3>
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
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail size={16} />
                <span>support@sellaap.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone size={16} />
                <span>+44 7454 288184</span>
              </div>
              <a 
                href="https://wa.me/447454288184" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#25D366] hover:text-[#128C7E] transition-colors"
              >
                <MessageCircle size={16} />
                <span className="font-medium">Chat on WhatsApp</span>
              </a>
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
