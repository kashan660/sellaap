
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
      try {
        // 1. Get User's Location/Currency
        // ipapi.co returns a JSON with 'currency' field (e.g., 'GBP', 'EUR')
        const locationRes = await fetch('https://ipapi.co/json/');
        const locationData = await locationRes.json();
        const userCurrency = locationData.currency || 'USD';
        
        setCurrency(userCurrency);

        // 2. Get Exchange Rates
        // exchangerate-api.com returns rates relative to a base currency (e.g., USD)
        const ratesRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const ratesData = await ratesRes.json();
        
        if (ratesData && ratesData.rates) {
          setRates(ratesData.rates);
        }
      } catch (error) {
        console.error("Failed to fetch currency data:", error);
        // Fallback to USD if anything fails
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
