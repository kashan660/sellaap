/**
 * Affiliate tracking and management utilities
 * Supports Impact, ClickBank, Amazon Associates, Gumroad, Envato
 */

export interface AffiliateConfig {
  impact?: {
    enabled: boolean;
    clientId?: string;
    trackingUrl?: string;
  };
  clickbank?: {
    enabled: boolean;
    affiliateId?: string;
  };
  amazon?: {
    enabled: boolean;
    associateId?: string;
    region?: string; // us, uk, eu, ca, au
  };
  gumroad?: {
    enabled: boolean;
    affiliateId?: string;
  };
  envato?: {
    enabled: boolean;
    affiliateId?: string;
  };
}

export const defaultAffiliateConfig: AffiliateConfig = {
  impact: {
    enabled: true,
  },
  clickbank: {
    enabled: true,
  },
  amazon: {
    enabled: true,
    region: 'uk',
  },
  gumroad: {
    enabled: true,
  },
  envato: {
    enabled: true,
  },
};

/**
 * Get affiliate link for Impact
 * Impact uses dynamic tracking, so we store referral data server-side
 */
export function getImpactTrackingCode(): string {
  return process.env.NEXT_PUBLIC_IMPACT_CLIENT_ID || '';
}

/**
 * Track conversion for affiliate programs
 * Call this on successful purchase/action
 */
export function trackAffiliateConversion(data: {
  programName: string;
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{
    productId: string;
    productName: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  customerEmail?: string;
  customData?: Record<string, any>;
}) {
  // Impact conversion tracking
  if (typeof window !== 'undefined' && (window as any).__impact) {
    (window as any).__impact.conversion.trackConversion({
      impactTransactionId: data.orderId,
      total: data.amount,
      currency: data.currency,
      items: data.items,
    });
  }

  // Track to server for logging
  fetch('/api/affiliate/conversions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(err => console.warn('Failed to log affiliate conversion:', err));
}

/**
 * Get affiliate product link for different platforms
 */
export function getAffiliateProductLink(
  productName: string,
  platform: 'amazon' | 'envato' | 'gumroad' | 'clickbank' | 'impact',
  customLink?: string
): string {
  if (!customLink) return '#'; // Placeholder

  const params = new URLSearchParams();

  switch (platform) {
    case 'amazon':
      params.append('tag', process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID || '');
      return `${customLink}?${params.toString()}`;

    case 'envato':
      params.append('ref', process.env.NEXT_PUBLIC_ENVATO_AFFILIATE_ID || '');
      return `${customLink}?${params.toString()}`;

    case 'gumroad':
      params.append('aff', process.env.NEXT_PUBLIC_GUMROAD_AFFILIATE_ID || '');
      return `${customLink}?${params.toString()}`;

    case 'clickbank':
      // ClickBank uses path-based or query parameter
      return customLink;

    case 'impact':
      params.append('impact_source', 'sellaap.com');
      return `${customLink}?${params.toString()}`;

    default:
      return customLink;
  }
}

/**
 * Format price for affiliate tracking
 */
export function formatAffiliatePrice(price: number, currency: string): string {
  return `${currency} ${price.toFixed(2)}`;
}

/**
 * Get referral UTM parameters
 */
export function getReferralParams(affiliateId?: string, platform?: string): Record<string, string> {
  return {
    utm_source: platform ? `affiliate_${platform}` : 'affiliate',
    utm_medium: 'referral',
    utm_campaign: affiliateId || 'general',
    utm_content: 'product_link',
  };
}

/**
 * Store affiliate referral cookie for conversion attribution
 */
export function setAffiliateReferral(affiliateId: string, platform: string, expiryDays = 30) {
  if (typeof window === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;

  document.cookie = `affiliate_id=${encodeURIComponent(affiliateId)};${expires};path=/`;
  document.cookie = `affiliate_platform=${encodeURIComponent(platform)};${expires};path=/`;
}

/**
 * Get affiliate referral from cookie
 */
export function getAffiliateReferral(): { affiliateId: string; platform: string } | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  let affiliateId = '';
  let platform = '';

  cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    if (name.trim() === 'affiliate_id') affiliateId = decodeURIComponent(value);
    if (name.trim() === 'affiliate_platform') platform = decodeURIComponent(value);
  });

  return affiliateId && platform ? { affiliateId, platform } : null;
}
