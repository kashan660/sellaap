import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sellaap - your online store for Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories, shipped fast across the USA.',
  keywords: [
    'about Sellaap',
    'online store',
    'pet supplies store',
    'beauty store',
    'electronics store',
  ],
  openGraph: {
    title: 'About Us',
    description: 'Learn about Sellaap - your online store for Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories.',
    type: 'website',
    siteName: 'Sellaap',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us',
    description: 'Learn about Sellaap - your online store for Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories.'
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Sellaap</h1>
          <p className="text-lg text-muted-foreground">
            Your one-stop online store for everyday essentials
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section className="bg-muted/50 rounded-lg p-6">
            <p className="text-lg leading-relaxed mb-0">
              Sellaap is an online store built around five categories we believe every household needs:
              Pet Supplies, Beauty, Electronics, Home Equipment, and Vehicle Accessories. We source
              quality products and ship them fast across the USA, so you can find what you need in one
              place instead of five different stores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p>
              We started Sellaap to make everyday shopping simpler. Whether you&apos;re restocking pet food,
              building a skincare routine, upgrading your tech accessories, organizing your home, or
              gearing up your car, we want Sellaap to be the store you come back to - reliable, affordable,
              and easy to shop.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Pet Supplies</h3>
                <p className="text-sm text-muted-foreground">Everything for your dogs, cats, and other pets.</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Beauty</h3>
                <p className="text-sm text-muted-foreground">Skincare, makeup, and personal care essentials.</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Electronics</h3>
                <p className="text-sm text-muted-foreground">Gadgets, accessories, and smart devices.</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Home Equipment</h3>
                <p className="text-sm text-muted-foreground">Tools and equipment to help around the house.</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 md:col-span-2">
                <h3 className="font-semibold text-foreground mb-2">Vehicle Accessories</h3>
                <p className="text-sm text-muted-foreground">Accessories and gear for cars, bikes, and more.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Why Shop With Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fast, reliable shipping across the USA</li>
              <li>Secure checkout with trusted payment methods</li>
              <li>A wide, growing selection across five everyday categories</li>
              <li>Responsive customer support for any order questions</li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Get in Touch</h2>
            <p className="mb-0">
              Have a question about an order or a product? Visit our{' '}
              <a href="/contact" className="text-primary hover:underline">Contact page</a> or email us at{' '}
              <a href="mailto:support@sellaap.com" className="text-primary hover:underline">support@sellaap.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
