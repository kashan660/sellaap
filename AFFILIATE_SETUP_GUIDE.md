# Affiliate Program Environment Configuration

This document outlines all environment variables needed for affiliate program integration.

## Impact Affiliate Program

```env
# Impact Client ID - Get from your Impact dashboard
NEXT_PUBLIC_IMPACT_CLIENT_ID=your_impact_client_id_here

# Impact API Key - For server-side conversion tracking
IMPACT_API_KEY=your_impact_api_key_here

# Optional: Custom Impact tracking URL
NEXT_PUBLIC_IMPACT_TRACKING_URL=https://your-affiliate-tracking.impact.com
```

## Amazon Associates

```env
# Amazon Associate ID (e.g., sellaap-20 for .com, sellaap-21 for .co.uk)
NEXT_PUBLIC_AMAZON_ASSOCIATE_ID=your_associate_id_here

# Amazon region code
NEXT_PUBLIC_AMAZON_REGION=uk
# Options: us, uk, eu, ca, au
```

## Envato Affiliate

```env
# Envato Affiliate ID
NEXT_PUBLIC_ENVATO_AFFILIATE_ID=your_envato_affiliate_id_here

# Envato partner token for API (if using)
ENVATO_API_TOKEN=your_envato_api_token_here
```

## Gumroad Affiliate

```env
# Gumroad Affiliate ID
NEXT_PUBLIC_GUMROAD_AFFILIATE_ID=your_gumroad_affiliate_id_here
```

## ClickBank

```env
# ClickBank Affiliate NickName
NEXT_PUBLIC_CLICKBANK_NICKNAME=your_nickname_here

# ClickBank API Key for tracking
CLICKBANK_API_KEY=your_clickbank_api_key_here
```

## General Tracking

```env
# Enable/disable affiliate tracking globally
NEXT_PUBLIC_AFFILIATE_TRACKING_ENABLED=true

# Default commission tier (for display purposes)
DEFAULT_COMMISSION_TIER=standard

# Affiliate cookie expiry in days
AFFILIATE_COOKIE_EXPIRY=30

# Affiliate tracking debug mode
NEXT_PUBLIC_AFFILIATE_DEBUG=false
```

---

## Setup Instructions

### 1. Get Your Affiliate IDs

- **Impact**: Visit https://impact.com and sign up, get your Client ID
- **Amazon Associates**: Join at https://affiliate-program.amazon.com
- **Envato**: Visit https://affiliate.envato.com
- **Gumroad**: Set up at https://gumroad.com/affiliates
- **ClickBank**: Register at https://www.clickbank.com

### 2. Add to .env.local (Development)

Copy the relevant variables above to your `.env.local` file and fill in your IDs.

### 3. Add to Vercel (Production)

1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add each variable with appropriate scope (Production, Preview, Development)
4. Redeploy

### 4. Test Affiliate Links

Use the affiliate page at `/affiliate` to test your links:
- Visit http://localhost:3000/affiliate in development
- Verify all links resolve correctly
- Test conversion tracking with `/api/affiliate/conversions`

---

## Tracking Implementation

### In Product Pages

```tsx
import { AffiliateOffer, AffiliatePromoBanner } from '@/components/AffiliateOffer';

export default function ProductPage() {
  return (
    <>
      <AffiliatePromoBanner />
      <AffiliateOffer
        title="Related VPN Service"
        description="Secure your Firestick connection"
        platform="impact"
        affiliateLink="https://your-impact-link.com"
        commission="25%"
      />
    </>
  );
}
```

### Track Conversions

```tsx
import { trackAffiliateConversion } from '@/lib/affiliate';

// When user completes purchase
trackAffiliateConversion({
  programName: 'impact',
  orderId: order.id,
  amount: order.total,
  currency: 'USD',
  items: order.items,
  customerEmail: user.email,
});
```

### Add Tracking Script

```tsx
import { ImpactAffiliateScript } from '@/components/AffiliateScripts';

export default function Layout() {
  return (
    <>
      <ImpactAffiliateScript />
      {/* Your content */}
    </>
  );
}
```

---

## Verification & Testing

### 1. Verify Impact Meta Tag

Check that this is in your HTML head:
```html
<meta name="impact-site-verification" content="8efd3686-bcb2-41ad-8cdf-d1fb90b01e5f">
```

### 2. Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/affiliate/conversions \
  -H "Content-Type: application/json" \
  -d '{
    "programName": "impact",
    "orderId": "test-123",
    "amount": 49.99,
    "currency": "USD",
    "items": [{"productId": "1", "productName": "Test", "category": "software", "price": 49.99, "quantity": 1}]
  }'
```

### 3. Check Impact Dashboard

After setup:
1. Log in to your Impact dashboard
2. Verify site verification is successful
3. Check that conversions are tracked in real-time

---

## Commission Rates Reference

| Program | Category | Rate | Recurring |
|---------|----------|------|-----------|
| Impact | VPN/Security | 15-30% | Yes |
| Impact | Streaming Services | 20-40% | Yes |
| Impact | Software | 25-50% | No |
| Amazon | General | 3-10% | No |
| Envato | Digital Assets | 30% | No |
| Gumroad | Digital Products | Varies | No |
| ClickBank | Digital Products | 10-75% | No |

---

## Best Practices

1. **Disclosure**: Always disclose affiliate links to comply with FTC guidelines
2. **Relevance**: Only promote products relevant to your audience
3. **Quality**: Focus on high-value offers with good conversion rates
4. **Testing**: Use UTM parameters to track which campaigns perform best
5. **Privacy**: Respect user privacy - use cookies responsibly
6. **Mobile-First**: Ensure affiliate links work well on mobile devices

---

## Support

For issues or questions:
- Impact Support: https://support.impact.com
- Amazon Associates: https://associatescentral.amazon.com
- Envato Help: https://envato.com/help
- Gumroad: https://gumroad.com/support
- ClickBank: https://support.clickbank.com
