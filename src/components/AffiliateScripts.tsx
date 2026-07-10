/**
 * Impact Affiliate Tracking Script
 * Add this to your Next.js layout or product pages
 */

'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __impact?: { conversion?: { start: () => void } };
    amzn_assoc_placement?: string;
  }
}

export function ImpactAffiliateScript() {
  useEffect(() => {
    // Load Impact tracking script
    if (!window.__impact) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.impact.com/impact-conversion.js';
      script.async = true;
      document.head.appendChild(script);

      // Initialize Impact conversion tracking
      script.onload = () => {
        if (window.__impact && window.__impact.conversion) {
          window.__impact.conversion.start();
        }
      };
    }
  }, []);

  return null; // No UI to render
}

/**
 * Amazon Associates tracking
 */
export function AmazonAffiliateScript() {
  useEffect(() => {
    // Amazon Associates script would go here
    // Typically handled through Amazon's native tracking
    const trackAmazon = () => {
      if (window.amzn_assoc_placement) {
        // Amazon Associates widget code
      }
    };

    // Load on ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackAmazon);
    } else {
      trackAmazon();
    }

    return () => document.removeEventListener('DOMContentLoaded', trackAmazon);
  }, []);

  return null;
}

/**
 * Generic affiliate pixel tracking
 */
export function AffiliatePixelTracker({
  program,
  orderId,
  amount,
}: {
  program: string;
  orderId?: string;
  amount?: number;
}) {
  useEffect(() => {
    // Track to server
    if (orderId && amount) {
      fetch('/api/affiliate/conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName: program,
          orderId,
          amount,
          currency: 'USD',
          items: [],
          customData: { source: 'pixel_tracker' },
        }),
      }).catch(err => console.error('Pixel tracking failed:', err));
    }
  }, [program, orderId, amount]);

  return null;
}
