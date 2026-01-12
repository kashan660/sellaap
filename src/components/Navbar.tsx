"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { CurrencySelector } from "./CurrencySelector";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsCartOpen, cartCount } = useCart();
  const { data: session } = useSession();

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
            
            <CurrencySelector />

            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                  <User size={18} />
                  <span>{session.user?.name || 'Account'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted">Profile</Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-muted">Admin Dashboard</Link>
                  )}
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-destructive">Sign Out</button>
                </div>
              </div>
            ) : (
               <Link href="/auth/signin" className="text-foreground/80 hover:text-primary transition-colors">Sign In</Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 relative cursor-pointer"
            >
              <ShoppingCart size={18} />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <CurrencySelector />
            <button onClick={() => setIsCartOpen(true)} className="text-foreground/80 hover:text-primary relative cursor-pointer">
              <ShoppingCart size={24} />
               {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground cursor-pointer">
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
             {session ? (
              <>
                 <Link href="/profile" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Profile</Link>
                 {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                 )}
                 <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 text-destructive hover:text-destructive/80 cursor-pointer">Sign Out</button>
              </>
            ) : (
               <Link href="/auth/signin" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
