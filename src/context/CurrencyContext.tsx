
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type CurrencyContextType = {
  currency: string;
  rates: Record<string, number>;
  isLoading: boolean;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  rates: { USD: 1 },
  isLoading: true,
  setCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCurrency = async () => {
      let userCurrency = 'USD';

      try {
        // 1. Get User's Location/Currency
        // using a short timeout to avoid blocking
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const locationRes = await fetch('https://ipapi.co/json/', { 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (locationRes.ok) {
            const locationData = await locationRes.json();
            userCurrency = locationData.currency || 'USD';
        }
      } catch (error) {
        // Silently fail to USD
        // We use console.debug instead of console.warn/error to avoid scaring users/developers
        // when ad-blockers (like uBlock Origin) or network issues block the request.
        console.debug("Currency auto-detection skipped (defaulting to USD):", error);
      }

      setCurrency(userCurrency);

      try {
        // 2. Get Exchange Rates
        const ratesRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (ratesRes.ok) {
            const ratesData = await ratesRes.json();
            if (ratesData && ratesData.rates) {
              setRates(ratesData.rates);
            }
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, rates, isLoading, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
