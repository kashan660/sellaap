"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Sellaap Logo" 
              width={140} 
              height={40} 
              className="h-10 w-auto"
              priority
              unoptimized
            />
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="text-foreground/80 hover:text-primary transition-colors">Products</Link>
            <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors">Blog</Link>
            <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</Link>
            <a 
              href="https://wa.me/447454288184" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-[#25D366] transition-colors font-medium flex items-center gap-1"
            >
              <span className="text-xs text-muted-foreground block">Call us:</span>
              +44 7454 288184
            </a>
            <Link href="/products" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
              <ShoppingCart size={18} />
              Shop Now
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <Link href="/products" className="text-foreground/80 hover:text-primary">
              <ShoppingCart size={24} />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b">
            <Link href="/" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/products" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Products</Link>
            <Link href="/blog" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Blog</Link>
            <Link href="/contact" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
