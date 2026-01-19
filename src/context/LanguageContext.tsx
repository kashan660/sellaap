'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Dashboard',
    'nav.signout': 'Sign Out',
    'nav.cart': 'Cart',
    'nav.allProducts': 'All Products',
    'currency.loading': 'Loading...',
    'currency.error': 'Error loading currency',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.signin': 'Iniciar Sesión',
    'nav.profile': 'Perfil',
    'nav.admin': 'Panel de Administrador',
    'nav.signout': 'Cerrar Sesión',
    'nav.cart': 'Carrito',
    'nav.allProducts': 'Todos los Productos',
    'currency.loading': 'Cargando...',
    'currency.error': 'Error al cargar moneda',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.signin': 'Se Connecter',
    'nav.profile': 'Profil',
    'nav.admin': 'Tableau de Bord Admin',
    'nav.signout': 'Déconnexion',
    'nav.cart': 'Panier',
    'nav.allProducts': 'Tous les Produits',
    'currency.loading': 'Chargement...',
    'currency.error': 'Erreur de chargement de la devise',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.signin': 'Anmelden',
    'nav.profile': 'Profil',
    'nav.admin': 'Admin Dashboard',
    'nav.signout': 'Abmelden',
    'nav.cart': 'Warenkorb',
    'nav.allProducts': 'Alle Produkte',
    'currency.loading': 'Laden...',
    'currency.error': 'Fehler beim Laden der Währung',
  },
  it: {
    'nav.home': 'Home',
    'nav.products': 'Prodotti',
    'nav.blog': 'Blog',
    'nav.contact': 'Contatto',
    'nav.signin': 'Accedi',
    'nav.profile': 'Profilo',
    'nav.admin': 'Pannello Admin',
    'nav.signout': 'Disconnetti',
    'nav.cart': 'Carrello',
    'nav.allProducts': 'Tutti i Prodotti',
    'currency.loading': 'Caricamento...',
    'currency.error': 'Errore nel caricamento della valuta',
  },
  pt: {
    'nav.home': 'Início',
    'nav.products': 'Produtos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',
    'nav.signin': 'Entrar',
    'nav.profile': 'Perfil',
    'nav.admin': 'Painel Admin',
    'nav.signout': 'Sair',
    'nav.cart': 'Carrinho',
    'nav.allProducts': 'Todos os Produtos',
    'currency.loading': 'Carregando...',
    'currency.error': 'Erro ao carregar moeda',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    // Auto-detect language based on browser settings or URL
    const browserLang = navigator.language.split('-')[0];
    const urlLang = window.location.pathname.split('/')[1];
    
    // Check if URL contains a language code
    if (urlLang && translations[urlLang]) {
      setLanguage(urlLang);
    } else if (translations[browserLang]) {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}