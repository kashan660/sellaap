import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Get country from Vercel headers
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  
  // Simple mapping of country to currency
  const countryToCurrency: Record<string, string> = {
    'GB': 'GBP',
    'UK': 'GBP',
    'US': 'USD',
    'CA': 'CAD',
    'AU': 'AUD',
    'DE': 'EUR',
    'FR': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'NL': 'EUR',
    'BE': 'EUR',
    'IE': 'EUR',
    // Add more as needed
  };

  // Default to EUR for other European countries if needed, or just USD
  // For now, let's keep it simple. 
  // If the country is in the EU list, use EUR.
  const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
  
  let currency = countryToCurrency[country];
  
  if (!currency && euCountries.includes(country)) {
    currency = 'EUR';
  }
  
  return NextResponse.json({ 
    country, 
    currency: currency || 'USD' 
  });
}
