'use client';

import { useCurrency } from "@/context/CurrencyContext";
import { Globe } from "lucide-react";

export function CurrencySelector() {
  const { currency, setCurrency, rates } = useCurrency();
  
  // Get available currencies from rates
  const currencies = Object.keys(rates).sort();

  // If rates are not loaded yet, just show current or common ones
  const displayCurrencies = currencies.length > 0 ? currencies : ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  return (
    <div className="relative group flex items-center">
        <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <Globe size={14} />
            {currency}
        </button>
        <div className="absolute right-0 top-full mt-2 w-24 bg-card border rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all max-h-60 overflow-y-auto z-50">
            {displayCurrencies.map((c) => (
                <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${currency === c ? 'text-primary font-bold' : 'text-foreground'}`}
                >
                    {c}
                </button>
            ))}
        </div>
    </div>
  );
}
