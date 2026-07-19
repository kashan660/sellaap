'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getAffiliateProductLink, getReferralParams } from '@/lib/affiliate';

interface AffiliateOfferProps {
  title: string;
  description: string;
  platform: 'amazon' | 'envato' | 'gumroad' | 'clickbank' | 'impact';
  affiliateLink: string;
  price?: string;
  commission?: string;
  badge?: string;
  ctaText?: string;
}

export function AffiliateOffer({
  title,
  description,
  platform,
  affiliateLink,
  price,
  commission,
  badge,
  ctaText = 'View Offer'
}: AffiliateOfferProps) {
  const link = getAffiliateProductLink(title, platform, affiliateLink);
  const utmParams = new URLSearchParams(getReferralParams('', platform));
  const finalLink = `${link}${link.includes('?') ? '&' : '?'}${utmParams.toString()}`;

  const platformStyles = {
    amazon: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
    envato: 'border-green-200 bg-green-50 hover:bg-green-100',
    gumroad: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    clickbank: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    impact: 'border-red-200 bg-red-50 hover:bg-red-100',
  };

  const badgeColors = {
    amazon: 'bg-orange-100 text-orange-800',
    envato: 'bg-green-100 text-green-800',
    gumroad: 'bg-blue-100 text-blue-800',
    clickbank: 'bg-purple-100 text-purple-800',
    impact: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`border-2 rounded-lg p-6 transition-all ${platformStyles[platform]}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {badge && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeColors[platform]}`}>
            {badge}
          </span>
        )}
      </div>

      <p className="text-sm text-foreground/80 mb-4">{description}</p>

      <div className="flex justify-between items-center mb-4">
        {price && (
          <div>
            <p className="text-xs text-foreground/60">Starting at</p>
            <p className="text-xl font-bold text-primary">{price}</p>
          </div>
        )}
        {commission && (
          <div className="text-right">
            <p className="text-xs text-foreground/60">Commission</p>
            <p className="text-xl font-bold text-green-600">{commission}</p>
          </div>
        )}
      </div>

      <Link
        href={finalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        {ctaText}
        <ExternalLink size={16} />
      </Link>

      <p className="text-xs text-foreground/50 mt-3">
        Opens in new window • Affiliate link
      </p>
    </div>
  );
}

interface AffiliateOfferGridProps {
  offers: AffiliateOfferProps[];
}

export function AffiliateOfferGrid({ offers }: AffiliateOfferGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer, index) => (
        <AffiliateOffer key={index} {...offer} />
      ))}
    </div>
  );
}

/**
 * Inline affiliate call-to-action banner
 */
export function AffiliatePromoBanner({
  title = "Recommended Partner Offers",
  subtitle = "Support our site while getting great deals",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-foreground/70">{subtitle}</p>
      <p className="text-xs text-foreground/50 mt-3">
        We may earn commissions from affiliate links at no extra cost to you
      </p>
    </div>
  );
}
