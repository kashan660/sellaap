import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Sellaap.com - Get Support & Assistance',
  description: 'Contact Sellaap.com for support, business inquiries, or assistance. Reach us via email at service@sellaap.com or support@sellaap.com for all your digital marketplace needs.',
  keywords: [
    'contact us',
    'Sellaap contact',
    'customer support',
    'business email',
    'service email',
    'support contact',
    'digital marketplace support',
    'help desk',
    'contact form',
    'customer service',
    'technical support',
    'business inquiries',
    'sellaap support',
    'marketplace help'
  ],
  openGraph: {
    title: 'Contact Us | Sellaap.com - Get Support & Assistance',
    description: 'Contact Sellaap.com for support, business inquiries, or assistance with our digital marketplace platform.',
    type: 'website',
    siteName: 'Sellaap.com',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Sellaap.com - Get Support & Assistance',
    description: 'Reach out to Sellaap.com for support and assistance with our digital marketplace platform.'
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Reach out to us for support, business inquiries, or any questions about our digital marketplace platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg border p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Email Support</h2>
              <p className="text-muted-foreground">Get quick assistance via email</p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Customer Support</h3>
                <p className="text-sm text-muted-foreground mb-2">For general inquiries and support</p>
                <a 
                  href="mailto:support@sellaap.com" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  support@sellaap.com
                </a>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Business Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-2">For partnerships and business matters</p>
                <a 
                  href="mailto:service@sellaap.com" 
                  className="text-blue-600 hover:underline font-medium"
                >
                  service@sellaap.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Response Time</h2>
              <p className="text-muted-foreground">We aim to respond quickly</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">General Support</span>
                <span className="font-medium text-green-600">Within 24 hours</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Business Inquiries</span>
                <span className="font-medium text-green-600">Within 48 hours</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Technical Issues</span>
                <span className="font-medium text-green-600">Within 12 hours</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Weekend Support</span>
                <span className="font-medium text-orange-600">Next business day</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Common Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Payment Issues</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Having trouble with PayPal, Payoneer, or direct vendor payments?
              </p>
              <p className="text-sm text-blue-600">
                Contact: <a href="mailto:support@sellaap.com" className="hover:underline">support@sellaap.com</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Problems</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Can't access your account or need help with registration?
              </p>
              <p className="text-sm text-blue-600">
                Contact: <a href="mailto:support@sellaap.com" className="hover:underline">support@sellaap.com</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Seller Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Need help listing products or managing your seller account?
              </p>
              <p className="text-sm text-blue-600">
                Contact: <a href="mailto:service@sellaap.com" className="hover:underline">service@sellaap.com</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Business Partnerships</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Interested in partnering with Sellaap.com or have business proposals?
              </p>
              <p className="text-sm text-blue-600">
                Contact: <a href="mailto:service@sellaap.com" className="hover:underline">service@sellaap.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
          <h3 className="font-semibold text-green-800 mb-3">Payment Security Notice</h3>
          <p className="text-sm text-green-700 mb-2">
            All payment methods on Sellaap.com are safe and secure:
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ PayPal - Industry-leading security and buyer protection</li>
            <li>✅ Payoneer - Secure global payment platform</li>
            <li>✅ Direct Vendor Payments - Encrypted and verified vendor systems</li>
          </ul>
          <p className="text-sm text-green-700 mt-3">
            We never store complete payment card details and use industry-standard encryption for all transactions.
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Need More Help?</h3>
          <p className="text-muted-foreground mb-6">
            Don't hesitate to reach out. We're committed to providing excellent support for all our users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@sellaap.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📧 Contact Support
            </a>
            <a 
              href="mailto:service@sellaap.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              💼 Business Inquiries
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Business Email: <a href="mailto:service@sellaap.com" className="text-blue-600 hover:underline">service@sellaap.com</a>
          </p>
          <p className="mt-2">
            Support Email: <a href="mailto:support@sellaap.com" className="text-blue-600 hover:underline">support@sellaap.com</a>
          </p>
          <p className="mt-2">
            Website: <a href="https://sellaap.com" className="text-blue-600 hover:underline">https://sellaap.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}