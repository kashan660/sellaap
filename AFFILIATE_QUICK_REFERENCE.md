# Affiliate Program - Quick Reference Guide

## 🎯 What's Been Done

Your site now has **complete affiliate program infrastructure** ready for Impact, Amazon, Envato, Gumroad, and ClickBank.

---

## 📁 Files Created

| File | Purpose | Location |
|------|---------|----------|
| `src/lib/affiliate.ts` | Core affiliate utilities | Library |
| `src/app/api/affiliate/conversions/route.ts` | Conversion tracking API | API Route |
| `src/components/AffiliateOffer.tsx` | Reusable offer component | Component |
| `src/components/AffiliateScripts.tsx` | Tracking scripts | Component |
| `src/app/affiliate/page.tsx` | Public affiliate landing page | Page |
| `AFFILIATE_SETUP_GUIDE.md` | Configuration guide | Root |
| `AFFILIATE_INTEGRATION_COMPLETE.md` | Implementation checklist | Root |

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Affiliate IDs
```
Go to:
- https://impact.com → Sign up → Get Client ID
- https://affiliate-program.amazon.com → Get Associate ID
- https://affiliate.envato.com → Get Affiliate ID
```

### Step 2: Add to Vercel
```
Vercel Dashboard → Settings → Environment Variables

Add:
NEXT_PUBLIC_IMPACT_CLIENT_ID=your_id
IMPACT_API_KEY=your_key
NEXT_PUBLIC_AMAZON_ASSOCIATE_ID=your_id
```

### Step 3: Verify Impact
```
1. Go to Impact Dashboard
2. Add domain: sellaap.com
3. Check "Site Verification" passes
4. Look for meta tag: 8efd3686-bcb2-41ad-8cdf-d1fb90b01e5f
```

---

## 💻 Code Usage Examples

### Display Affiliate Offer on Product Page

```tsx
import { AffiliateOffer } from '@/components/AffiliateOffer';

export default function ProductPage() {
  return (
    <AffiliateOffer
      title="VPN Service"
      description="Secure your Firestick with a trusted VPN"
      platform="impact"
      affiliateLink="https://your-link.com"
      price="$4.99/month"
      commission="25%"
      badge="Recommended"
      ctaText="Get VPN"
    />
  );
}
```

### Track Conversion After Purchase

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

### Get Affiliate Product Link

```tsx
import { getAffiliateProductLink } from '@/lib/affiliate';

const link = getAffiliateProductLink(
  'VPN Service',
  'impact',
  'https://example.com/vpn'
);

// Returns: https://example.com/vpn?impact_source=sellaap.com
```

### Add Multiple Offers in Grid

```tsx
import { AffiliateOfferGrid } from '@/components/AffiliateOffer';

const offers = [
  { title: 'VPN', platform: 'impact', affiliateLink: '...', commission: '25%' },
  { title: 'IPTV', platform: 'impact', affiliateLink: '...', commission: '30%' },
  { title: 'Software', platform: 'clickbank', affiliateLink: '...', commission: '50%' },
];

export default function Page() {
  return <AffiliateOfferGrid offers={offers} />;
}
```

---

## 🔗 Available Routes

| Route | Purpose |
|-------|---------|
| `/affiliate` | Public affiliate program page |
| `/api/affiliate/conversions` | POST conversion tracking |

---

## 🔑 Environment Variables

### Required
```env
NEXT_PUBLIC_IMPACT_CLIENT_ID=your_impact_id
IMPACT_API_KEY=your_impact_key
```

### Optional
```env
NEXT_PUBLIC_AMAZON_ASSOCIATE_ID=your_amazon_id
NEXT_PUBLIC_ENVATO_AFFILIATE_ID=your_envato_id
NEXT_PUBLIC_GUMROAD_AFFILIATE_ID=your_gumroad_id
NEXT_PUBLIC_CLICKBANK_NICKNAME=your_nickname
```

---

## 📊 API Endpoints

### POST /api/affiliate/conversions

Track a conversion event:

```bash
curl -X POST https://sellaap.com/api/affiliate/conversions \
  -H "Content-Type: application/json" \
  -d '{
    "programName": "impact",
    "orderId": "order-123",
    "amount": 49.99,
    "currency": "USD",
    "items": [
      {
        "productId": "1",
        "productName": "VPN Service",
        "category": "software",
        "price": 49.99,
        "quantity": 1
      }
    ],
    "customerEmail": "user@example.com"
  }'
```

Response:
```json
{ "success": true, "message": "Conversion tracked" }
```

---

## 🎨 Component Props

### AffiliateOffer

```tsx
interface AffiliateOfferProps {
  title: string;                    // Offer title
  description: string;              // Description
  platform: 'amazon' | 'impact' | 'envato' | 'gumroad' | 'clickbank';
  affiliateLink: string;            // Your affiliate link
  price?: string;                   // Optional: "$4.99/month"
  commission?: string;              // Optional: "25%"
  badge?: string;                   // Optional: "Recommended"
  ctaText?: string;                 // Optional: "Get Offer" (default: "View Offer")
}
```

### AffiliatePromoBanner

```tsx
<AffiliatePromoBanner
  title="Recommended Partner Offers"
  subtitle="Support our site while getting great deals"
/>
```

---

## 🛠️ Utility Functions

### getAffiliateProductLink()
```tsx
getAffiliateProductLink(productName, platform, customLink)
// Returns affiliate link with proper tracking parameters
```

### trackAffiliateConversion()
```tsx
trackAffiliateConversion(data)
// Tracks conversion to Impact API and server
```

### getReferralParams()
```tsx
getReferralParams(affiliateId, platform)
// Returns UTM parameters for tracking
```

### setAffiliateReferral()
```tsx
setAffiliateReferral(affiliateId, platform, expiryDays)
// Stores affiliate info in cookie
```

### getAffiliateReferral()
```tsx
getAffiliateReferral()
// Retrieves affiliate info from cookie
```

---

## 📍 Where to Add Offers

### High Priority Pages
1. `/products` - Product listing page
2. `/products/[slug]` - Individual product pages
3. `/blog/[slug]` - Blog posts about streaming/VPN
4. `/` - Homepage hero section

### Medium Priority
5. `/digital-products` - Digital products page
6. Firestick setup pages
7. Tutorial/guide pages

---

## 🎯 Recommended Offer Placement

| Category | Program | Placement |
|----------|---------|-----------|
| VPN | Impact | Firestick setup pages |
| IPTV | Impact | Streaming service pages |
| Software | ClickBank | Software category |
| 3D Models | Envato | Blender models page |
| Accessories | Amazon | Hardware pages |
| Digital Assets | Gumroad | Templates page |

---

## ✅ Testing Checklist

- [ ] Visit `/affiliate` page - loads without errors
- [ ] Impact meta tag visible in page source
- [ ] POST to `/api/affiliate/conversions` - returns success
- [ ] Affiliate offers display correctly on test page
- [ ] Links open in new window with correct parameters
- [ ] Mobile responsive
- [ ] All environment variables set in Vercel

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Links not working | Check affiliate IDs in env vars |
| Conversions not tracked | Check API endpoint is accessible |
| Meta tag not visible | Restart build in Vercel |
| Mobile layout broken | Check Tailwind CSS in component |
| Impact not verifying | Wait 48 hours, check meta tag placement |

---

## 📚 Documentation Files

1. **AFFILIATE_SETUP_GUIDE.md** - Complete setup & configuration
2. **AFFILIATE_INTEGRATION_COMPLETE.md** - Implementation checklist
3. **This file** - Quick reference

---

## 🎓 Next Steps

1. Sign up for Impact: https://impact.com
2. Get your Client ID
3. Add to `.env.local` or Vercel
4. Visit `/affiliate` to verify
5. Add offers to product pages
6. Test conversion tracking
7. Monitor Impact dashboard

---

## 📞 Support Links

- Impact Support: https://support.impact.com
- Amazon Help: https://associatescentral.amazon.com/help
- Envato Support: https://support.envato.com
- Gumroad Help: https://gumroad.com/support
- ClickBank Support: https://support.clickbank.com

---

## 💡 Pro Tips

✨ **Tip 1**: Use `/affiliate` page as your affiliate recruitment landing page  
✨ **Tip 2**: Add affiliate links to blog posts for better SEO  
✨ **Tip 3**: Use UTM parameters to track campaign performance  
✨ **Tip 4**: A/B test different CTA text and button colors  
✨ **Tip 5**: Monitor Impact dashboard weekly to optimize offers  

---

**You're all set!** Start earning affiliate commissions! 🚀
