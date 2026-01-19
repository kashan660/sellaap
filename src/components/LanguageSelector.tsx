'use client';

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative group flex items-center">
      <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <Globe size={14} />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
      </button>
      <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all max-h-60 overflow-y-auto z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`block w-full text-left px-3 py-2 text-sm hover:bg-muted ${language === lang.code ? 'text-primary font-bold bg-muted' : 'text-foreground'} flex items-center gap-2`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && <span className="ml-auto text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}