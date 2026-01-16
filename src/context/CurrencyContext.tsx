
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
        // 1. Get User's Location/Currency with better error handling
        // using a short timeout to avoid blocking
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const locationRes = await fetch('https://ipapi.co/json/', { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
        });
        clearTimeout(timeoutId);

        if (locationRes.ok) {
            const locationData = await locationRes.json();
            userCurrency = locationData.currency || 'USD';
        } else {
          // Fallback based on common markets
          const marketCurrencies = {
            'uk': 'GBP',
            'us': 'USD', 
            'canada': 'CAD',
            'europe': 'EUR',
            'australia': 'AUD'
          };
          
          // Try to detect from URL or default to USD
          const path = window.location.pathname;
          const market = Object.keys(marketCurrencies).find(m => path.includes(`/${m}`));
          userCurrency = market ? marketCurrencies[market] : 'USD';
        }
      } catch (error) {
        // Silently fail to USD with market detection fallback
        console.debug("Currency auto-detection skipped (defaulting to USD):", error);
        
        // Fallback based on URL path for international markets
        const marketCurrencies = {
          'uk': 'GBP',
          'us': 'USD', 
          'canada': 'CAD',
          'europe': 'EUR',
          'australia': 'AUD'
        };
        
        try {
          const path = window.location.pathname;
          const market = Object.keys(marketCurrencies).find(m => path.includes(`/${m}`));
          userCurrency = market ? marketCurrencies[market] : 'USD';
        } catch {
          userCurrency = 'USD';
        }
      }

      setCurrency(userCurrency);

      try {
        // 2. Get Exchange Rates with fallback
        const ratesRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        });
        
        if (ratesRes.ok) {
            const ratesData = await ratesRes.json();
            if (ratesData && ratesData.rates) {
              setRates(ratesData.rates);
            }
        } else {
          // Fallback to hardcoded rates if API fails
          console.warn("Exchange rate API failed, using fallback rates");
          setRates({
            'USD': 1,
            'GBP': 0.79,
            'EUR': 0.92,
            'CAD': 1.36,
            'AUD': 1.52
          });
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates, using fallback:", error);
        // Fallback rates for common currencies
        setRates({
          'USD': 1,
          'GBP': 0.79,
          'EUR': 0.92,
          'CAD': 1.36,
          'AUD': 1.52
        });
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
