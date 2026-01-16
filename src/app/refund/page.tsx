import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Sellaap.com - Digital Marketplace Platform',
  description: 'Sellaap.com refund policy for digital products and marketplace transactions. Learn about refund eligibility, seller responsibilities, and dispute resolution process.',
  keywords: [
    'refund policy',
    'Sellaap refund',
    'digital product refunds',
    'marketplace refund policy',
    'digital downloads refund',
    'API refund policy',
    'software license refund',
    'subscription refund',
    'seller refund policy',
    'platform refund process',
    'chargeback policy',
    'dispute resolution',
    'digital marketplace refunds'
  ],
  openGraph: {
    title: 'Refund Policy | Sellaap.com - Digital Marketplace Platform',
    description: 'Learn about Sellaap.com\'s refund policy for digital products, marketplace transactions, and dispute resolution process.',
    type: 'website',
    siteName: 'Sellaap.com',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund Policy | Sellaap.com - Digital Marketplace Platform',
    description: 'Understand Sellaap.com\'s refund policy for digital products and marketplace transactions.'
  }
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            💰 Refund Policy – Sellaap.com
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Last updated: January 17, 2026
          </p>
          <p className="text-muted-foreground">
            Sellaap.com is a digital marketplace platform that connects buyers and independent sellers. Refunds depend on the nature of the product and seller policies.
          </p>
        </div>

        <div className="space-y-8">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Digital Products
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Due to the nature of digital products (downloads, APIs, licenses, software, subscriptions), all sales are final once access is granted.
              </p>
            </div>
            <p className="mb-4">
              Refunds will only be considered if:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The product was not delivered</li>
              <li>The product is completely unusable and the seller cannot fix it</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Seller Responsibility
            </h2>
            <p className="mb-4">
              Each seller is responsible for their own product quality and descriptions. Refund decisions may be made by the seller according to their policy.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Always review seller policies and product descriptions carefully before making a purchase.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Platform Role
            </h2>
            <p className="mb-4">
              Sellaap.com acts only as an intermediary and does not own or directly sell listed products. We may assist in dispute resolution but are not liable for seller decisions.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-800 mb-2">Payment Security</h3>
              <p className="text-sm text-green-700">
                All payment methods are secured with industry-standard encryption. We support PayPal, Payoneer, and direct vendor payments - all methods are safe and protected.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Chargebacks & Fraud
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Fraudulent chargebacks may result in account suspension. We reserve the right to deny refunds in cases of abuse.
              </p>
            </div>
            <p className="mb-4">
              We take payment security seriously and investigate all chargeback claims thoroughly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Contact for Refund Issues
            </h2>
            <p className="mb-4">
              Please contact the seller first. If unresolved, contact our support team:
            </p>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Sellaap Support</h3>
              <p className="text-sm space-y-1">
                <span className="block">📧 Email: <a href="mailto:support@sellaap.com" className="text-blue-600 hover:underline">support@sellaap.com</a></span>
                <span className="block">📧 Business: <a href="mailto:service@sellaap.com" className="text-blue-600 hover:underline">service@sellaap.com</a></span>
                <span className="block">🌐 Website: <a href="https://sellaap.com" className="text-blue-600 hover:underline">https://sellaap.com</a></span>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Payment Methods
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">💳</div>
                <h3 className="font-semibold text-foreground mb-2">PayPal</h3>
                <p className="text-sm text-muted-foreground">Secure and trusted worldwide payment processing</p>
              </div>
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🏦</div>
                <h3 className="font-semibold text-foreground mb-2">Payoneer</h3>
                <p className="text-sm text-muted-foreground">Global payment platform for businesses and freelancers</p>
              </div>
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🤝</div>
                <h3 className="font-semibold text-foreground mb-2">Direct Vendor</h3>
                <p className="text-sm text-muted-foreground">Safe direct payments to verified vendors</p>
              </div>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
              <p className="text-sm text-green-800">
                <strong>All payment methods are safe and secure.</strong> We use industry-standard encryption and never store complete payment details on our servers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}