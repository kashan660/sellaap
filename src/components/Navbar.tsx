"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { CurrencySelector } from "./CurrencySelector";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{id: number, name: string, slug: string}>>([]);
  const { setIsCartOpen, cartCount } = useCart();
  const { data: session } = useSession();
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch categories for dropdown
    fetch('/api/categories')
      .then(res => {
        console.log('API response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Categories fetched:', data.categories);
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.log('No categories found or invalid format');
          // Fallback to hardcoded categories if API fails
          setCategories([
            { id: 1, name: 'Blender 3D Models', slug: 'blender-3d-models' },
            { id: 2, name: 'Digital Products', slug: 'digital-products' },
            { id: 3, name: 'Software', slug: 'software' },
            { id: 4, name: 'Templates', slug: 'templates' }
          ]);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { id: 1, name: 'Blender 3D Models', slug: 'blender-3d-models' },
          { id: 2, name: 'Digital Products', slug: 'digital-products' },
          { id: 3, name: 'Software', slug: 'software' },
          { id: 4, name: 'Templates', slug: 'templates' }
        ]);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isCategoriesDropdownOpen && !target.closest('.products-dropdown') && !target.closest('button')) {
        setIsCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoriesDropdownOpen]);

  console.log('Current state - categories:', categories.length, 'dropdown open:', isCategoriesDropdownOpen);

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
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">{t('nav.home')}</Link>
            <div className="relative products-dropdown">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Desktop Products dropdown clicked, toggling from:', isCategoriesDropdownOpen, 'to:', !isCategoriesDropdownOpen);
                  setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
                }}
                className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors focus:outline-none"
              >
                {t('nav.products')}
                <ChevronDown size={16} className={`transition-transform ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border rounded-md shadow-lg py-1 z-50" style={{ display: 'block' }}>
                  <Link 
                    href="/products" 
                    className="block px-4 py-2 text-sm hover:bg-muted font-medium"
                    onClick={() => setIsCategoriesDropdownOpen(false)}
                  >
                    {t('nav.allProducts')}
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  {categories.length > 0 ? (
                     categories.map((category) => (
                       <Link 
                         key={category.id}
                         href={`/products/${category.slug}`}
                         className="block px-4 py-2 text-sm hover:bg-muted"
                         onClick={(e) => {
                           console.log('Desktop category link clicked:', category.name, 'slug:', category.slug, 'URL:', `/products/${category.slug}`);
                           setIsCategoriesDropdownOpen(false);
                         }}
                       >
                         {category.name}
                       </Link>
                     ))
                   ) : (
                     <div className="px-4 py-2 text-sm text-muted-foreground">No categories found</div>
                   )}
                </div>
              )}
            </div>
            <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors">{t('nav.blog')}</Link>
            <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">{t('nav.contact')}</Link>
            
            <LanguageSelector />
            <CurrencySelector />

            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                  <User size={18} />
                  <span>{session.user?.name || t('nav.profile')}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted">{t('nav.profile')}</Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-muted">{t('nav.admin')}</Link>
                  )}
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-destructive">{t('nav.signout')}</button>
                </div>
              </div>
            ) : (
               <Link href="/auth/signin" className="text-foreground/80 hover:text-primary transition-colors">{t('nav.signin')}</Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 relative cursor-pointer"
            >
              <ShoppingCart size={18} />
              <span className="hidden lg:inline">{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSelector />
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
              <Link href="/" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>{t('nav.home')}</Link>
              <div className="space-y-1">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Mobile Products dropdown clicked, toggling from:', isCategoriesDropdownOpen, 'to:', !isCategoriesDropdownOpen);
                    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-foreground/80 hover:text-primary focus:outline-none"
                >
                  <span>{t('nav.products')}</span>
                  <ChevronDown size={16} className={`transition-transform ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoriesDropdownOpen && (
                  <div className="pl-4 space-y-1">
                    <Link 
                      href="/products" 
                      className="block px-3 py-2 text-sm text-foreground/70 hover:text-primary"
                      onClick={() => {setIsCategoriesDropdownOpen(false); setIsOpen(false);}}
                    >
                      {t('nav.allProducts')}
                    </Link>
                    {categories.length > 0 ? (
                       categories.map((category) => (
                         <Link 
                           key={category.id}
                           href={`/products/${category.slug}`}
                           className="block px-3 py-2 text-sm text-foreground/70 hover:text-primary"
                           onClick={(e) => {
                             console.log('Mobile category link clicked:', category.name, 'slug:', category.slug, 'URL:', `/products/${category.slug}`);
                             setIsCategoriesDropdownOpen(false);
                             setIsOpen(false);
                           }}
                         >
                           {category.name}
                         </Link>
                       ))
                     ) : (
                       <div className="px-3 py-2 text-sm text-muted-foreground">No categories found</div>
                     )}
                  </div>
                )}
              </div>
              <Link href="/blog" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>{t('nav.blog')}</Link>
               {session ? (
                <>
                   <Link href="/profile" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>{t('nav.profile')}</Link>
                   {session.user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>{t('nav.admin')}</Link>
                   )}
                   <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 text-destructive hover:text-destructive/80 cursor-pointer">{t('nav.signout')}</button>
                </>
              ) : (
                 <Link href="/auth/signin" className="block px-3 py-2 text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>{t('nav.signin')}</Link>
              )}
            </div>
          </div>
      )}
    </nav>
  );
}
