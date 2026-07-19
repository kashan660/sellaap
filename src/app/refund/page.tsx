import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy',
  description: 'Sellaap.com return and refund policy - learn about our return window, refund process, and how to report damaged or incorrect orders.',
  keywords: [
    'return policy',
    'refund policy',
    'Sellaap returns',
    'product returns',
    'damaged item refund',
    'order refund',
  ],
  openGraph: {
    title: 'Return & Refund Policy',
    description: 'Learn about Sellaap.com\'s return window, refund process, and how to report damaged or incorrect orders.',
    type: 'website',
    siteName: 'Sellaap',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Return & Refund Policy',
    description: 'Learn about Sellaap.com\'s return window, refund process, and how to report damaged or incorrect orders.'
  }
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Return & Refund Policy
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Last updated: July 2026
          </p>
          <p className="text-muted-foreground">
            Sellaap.com sells Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories,
            shipped across the USA. We want you to be happy with every order - here&apos;s how returns and refunds work.
          </p>
        </div>

        <div className="space-y-8">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Return Window
            </h2>
            <p className="mb-4">
              You may request a return within <strong>30 days</strong> of the delivery date. To be eligible for a
              return, items must be unused, in their original packaging, and in the same condition you received them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Damaged, Defective, or Incorrect Items
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Please contact us within 7 days of delivery</strong> if your order arrives damaged,
                defective, or different from what you ordered, so we can resolve it quickly.
              </p>
            </div>
            <p className="mb-4">
              Please include your order number and photos of the item (and packaging, if damaged) when you contact
              us - this helps us process your request faster.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. How to Start a Return
            </h2>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Contact our support team with your order number and reason for return.</li>
              <li>We&apos;ll confirm your return eligibility and provide return instructions.</li>
              <li>Once we receive and inspect the returned item, we&apos;ll notify you of the approval status.</li>
              <li>Approved refunds are issued to your original payment method within 5-10 business days.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Return Shipping
            </h2>
            <p className="mb-4">
              For damaged, defective, or incorrect items, we cover return shipping costs. For other returns
              (e.g. change of mind), return shipping is the customer&apos;s responsibility unless stated otherwise
              at checkout.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Non-Returnable Items
            </h2>
            <p className="mb-4">
              For hygiene reasons, certain items (such as opened beauty and personal care products) may not be
              eligible for return unless defective. Any exceptions will be noted on the product page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Order Cancellations
            </h2>
            <p className="mb-4">
              If you need to cancel an order, contact us as soon as possible. We can typically cancel orders that
              have not yet been submitted for shipping; once an order has shipped, our standard return process applies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Contact Us
            </h2>
            <p className="mb-4">
              For any return, refund, or order issue, reach out and we&apos;ll help sort it out:
            </p>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Sellaap Support</h3>
              <p className="text-sm space-y-1">
                <span className="block">Email: <a href="mailto:support@sellaap.com" className="text-blue-600 hover:underline">support@sellaap.com</a></span>
                <span className="block">Website: <a href="https://sellaap.com" className="text-blue-600 hover:underline">https://sellaap.com</a></span>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Secure Payments
            </h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm text-green-800">
                All payments are processed securely. We never store your complete payment details on our servers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
