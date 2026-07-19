import { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateOffer, AffiliatePromoBanner } from '@/components/AffiliateOffer';
import { CheckCircle2, DollarSign, TrendingUp, Users, Zap, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Affiliate Program - Sellaap',
  description: 'Join our affiliate program on Impact and earn commissions on digital products, software, and streaming services. No deposit required, instant tracking, recurring commissions.',
  keywords: [
    'affiliate program',
    'impact affiliate',
    'commission',
    'digital products affiliate',
    'software affiliate',
    'firestick affiliate',
    'streaming service affiliate',
    'no deposit affiliate',
  ],
  openGraph: {
    title: 'Affiliate Program - Sellaap',
    description: 'Join our affiliate program and earn recurring commissions on digital products and services',
    type: 'website',
  },
};

export default function AffiliatePage() {
  const impactOffers = [
    {
      title: 'VPN & Security Software',
      description: 'Promote high-commission VPN services perfect for Firestick users seeking privacy and geo-unblocking.',
      platform: 'impact' as const,
      affiliateLink: 'https://impact.com', // Users will add their Impact links
      commission: '15-30%',
      badge: 'High Commission',
      ctaText: 'Find VPN Offers',
    },
    {
      title: 'IPTV & Streaming Services',
      description: 'Premium streaming subscriptions with recurring affiliate payouts.',
      platform: 'impact' as const,
      affiliateLink: 'https://impact.com',
      commission: 'Up to 40%',
      badge: 'Recurring',
      ctaText: 'Browse Offers',
    },
    {
      title: 'Digital Product Bundles',
      description: 'Software tools and digital goods with attractive commission structures.',
      platform: 'impact' as const,
      affiliateLink: 'https://impact.com',
      commission: '20-50%',
      badge: 'Instant Payout',
      ctaText: 'Explore Products',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Tracking',
      description: 'Real-time conversion tracking and attribution for every sale'
    },
    {
      icon: DollarSign,
      title: 'High Commissions',
      description: 'Competitive rates on software, subscriptions, and digital products'
    },
    {
      icon: TrendingUp,
      title: 'Recurring Revenue',
      description: 'Earn ongoing commissions on subscription-based products'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Partner success team to help maximize your earnings'
    },
    {
      icon: CheckCircle2,
      title: 'No Deposit',
      description: 'Start promoting with zero upfront investment or fees'
    },
    {
      icon: BookOpen,
      title: 'Marketing Materials',
      description: 'Pre-made banners, landing pages, and content ready to use'
    },
  ];

  return (
    <div className="bg-gradient-to-b from-background to-background/50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Affiliate Partnership Program
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-6">
            Earn recurring commissions promoting digital products, software, and streaming services. Join Impact and start earning today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://impact.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold inline-flex items-center gap-2 justify-center"
            >
              Join Impact Program
              <span className="text-lg">→</span>
            </a>
            <button className="border border-primary/30 text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-card/50 rounded-lg my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Partner With Sellaap</h2>
          <p className="text-foreground/70">We offer everything you need to succeed as an affiliate</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors">
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Offers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Top Affiliate Offers</h2>
          <p className="text-foreground/70">Popular products with high conversion rates</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {impactOffers.map((offer, index) => (
            <AffiliateOffer key={index} {...offer} />
          ))}
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Commission Structure</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { category: 'VPN & Security', rate: '15-30%', recurring: 'Monthly' },
            { category: 'Streaming Services', rate: '20-40%', recurring: 'Yes' },
            { category: 'Software Tools', rate: '25-50%', recurring: 'No' },
            { category: 'Digital Products', rate: '20-35%', recurring: 'No' },
          ].map((tier, idx) => (
            <div key={idx} className="bg-card border border-primary/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-2">{tier.category}</h3>
              <p className="text-3xl font-bold text-primary mb-2">{tier.rate}</p>
              <p className="text-sm text-foreground/70">Recurring: {tier.recurring}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>

        <div className="space-y-6">
          {[
            {
              step: '1',
              title: 'Sign Up',
              description: 'Join the Impact affiliate program for free. No deposit or setup fees required.'
            },
            {
              step: '2',
              title: 'Get Your Links',
              description: 'Browse our catalog and grab affiliate links for products you want to promote.'
            },
            {
              step: '3',
              title: 'Promote',
              description: 'Share links on your blog, social media, website, or email. Use our marketing materials.'
            },
            {
              step: '4',
              title: 'Earn',
              description: 'Get paid instantly when customers make a purchase through your links.'
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                {item.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Earning?</h2>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of affiliates earning recurring commissions with Sellaap and Impact. Completely free to join, no minimum sales required.
          </p>
          <a
            href="https://impact.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground px-12 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
          >
            Join Impact Affiliate Program →
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {[
            {
              q: 'Is there a cost to join?',
              a: 'No, our affiliate program is completely free. No signup fees, no deposit required.'
            },
            {
              q: 'When do I get paid?',
              a: 'Commissions are paid monthly, typically 30 days after the sale is confirmed. Impact offers fast, reliable payments.'
            },
            {
              q: 'What commission rates do you offer?',
              a: 'Commission rates vary by product: VPN 15-30%, Streaming 20-40%, Software 25-50%, Digital Products 20-35%.'
            },
            {
              q: 'Can I use ads and paid traffic?',
              a: 'Yes, affiliate marketing on paid channels is allowed. Check individual product terms for any restrictions.'
            },
            {
              q: 'Do you provide marketing materials?',
              a: 'Yes, we provide banners, landing pages, product descriptions, and more to help you succeed.'
            },
            {
              q: 'How do I track conversions?',
              a: 'Impact provides real-time tracking dashboard showing all clicks, conversions, and earnings.'
            },
          ].map((faq, idx) => (
            <details key={idx} className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors group">
              <summary className="font-semibold text-foreground flex justify-between items-center">
                {faq.q}
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-foreground/70 mt-4 pt-4 border-t border-border">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center border-t border-border mt-12">
        <h3 className="text-2xl font-bold text-foreground mb-4">Questions? Contact Us</h3>
        <p className="text-foreground/70 mb-6">Our affiliate team is here to help you succeed.</p>
        <Link href="/contact" className="inline-block text-primary hover:text-primary/80 font-semibold">
          Get in Touch →
        </Link>
      </section>
    </div>
  );
}
