// src/lib/regional-availability.ts
// Fallback implementation for regional availability without database changes

export interface RegionalAvailability {
  region: string;
  available: boolean;
  currency: string;
  price?: number;
}

export const DEFAULT_REGIONS: RegionalAvailability[] = [
  { region: 'uk', available: true, currency: 'GBP' },
  { region: 'us', available: true, currency: 'USD' },
  { region: 'canada', available: true, currency: 'CAD' },
  { region: 'europe', available: true, currency: 'EUR' },
  { region: 'australia', available: true, currency: 'AUD' }
];

export function getDefaultRegionalAvailability(): RegionalAvailability[] {
  return DEFAULT_REGIONS;
}

export function getRegionalCurrency(region: string): string {
  const regionMap: { [key: string]: string } = {
    'uk': 'GBP',
    'us': 'USD',
    'canada': 'CAD',
    'europe': 'EUR',
    'australia': 'AUD'
  };
  return regionMap[region.toLowerCase()] || 'USD';
}

export function formatRegionalPrice(price: number, currency: string, region: string): string {
  const symbols: { [key: string]: string } = {
    'GBP': '£',
    'USD': '$',
    'CAD': 'C$',
    'EUR': '€',
    'AUD': 'A$'
  };
  
  const symbol = symbols[currency] || '$';
  return `${symbol}${price.toFixed(2)}`;
}