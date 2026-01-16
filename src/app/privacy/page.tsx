import { Metadata } from 'next';
import { generateLocationMeta } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: "Privacy Policy | Sellaap - Your Data Protection & Privacy Rights",
  description: "Sellaap.com Privacy Policy - Learn how we protect your personal information, data collection practices, cookie usage, and your privacy rights across UK, US, Canada, Europe & Australia.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "personal information security",
    "cookie policy",
    "user privacy rights",
    "data collection practices",
    "online privacy",
    "firestick privacy",
    "streaming service privacy"
  ],
  openGraph: {
    title: "Privacy Policy | Sellaap - Your Data Protection & Privacy Rights",
    description: "Learn how Sellaap protects your personal information and respects your privacy rights across all international markets.",
    type: 'website',
    siteName: 'Sellaap',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy | Sellaap - Your Data Protection & Privacy Rights",
    description: "Learn how Sellaap protects your personal information and respects your privacy rights."
  }
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Sellaap.com - Your Privacy Matters to Us
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 1, 2026
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <p className="text-lg leading-relaxed mb-0">
                At Sellaap.com, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services. We are committed to protecting your personal data and respecting your privacy rights across all international markets we serve.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We may collect the following information to provide you with the best possible service:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Name and email address</li>
                    <li>• Contact details and phone number</li>
                    <li>• Billing and shipping information</li>
                    <li>• Account preferences and settings</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Technical Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• IP address and geolocation</li>
                    <li>• Browser type and device information</li>
                    <li>• Operating system and screen resolution</li>
                    <li>• Website usage patterns and analytics</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Transaction Details</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Purchase history and order details</li>
                    <li>• Payment method information</li>
                    <li>• Shipping and delivery information</li>
                    <li>• Customer service interactions</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Cookies and tracking technologies</li>
                    <li>• Website navigation patterns</li>
                    <li>• Search queries and preferences</li>
                    <li>• Marketing communication preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">
                We use your data to provide exceptional service and improve your experience:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Provide Marketplace Services</h3>
                    <p className="text-sm text-muted-foreground">Process orders, manage accounts, and deliver Firestick setup services across UK, US, Canada, Europe, and Australia.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Process Transactions Securely</h3>
                    <p className="text-sm text-muted-foreground">Handle payments, refunds, and financial transactions with industry-standard encryption and security protocols.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Communicate Effectively</h3>
                    <p className="text-sm text-muted-foreground">Send order updates, service notifications, and customer support responses tailored to your location and preferences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Enhance User Experience</h3>
                    <p className="text-sm text-muted-foreground">Personalize content, remember preferences, and optimize website performance for your specific region and device.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ensure Security & Compliance</h3>
                    <p className="text-sm text-muted-foreground">Prevent fraud, detect suspicious activity, and comply with international data protection regulations including GDPR, CCPA, and regional privacy laws.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Legal Basis for Processing (GDPR Compliance)
              </h2>
              <p className="mb-4">
                For users in the European Union and other regions with similar regulations, we process your personal data based on the following legal grounds:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Contractual Necessity</h3>
                  <p className="text-sm">Processing required to fulfill our service agreements and deliver Firestick setup services.</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Legitimate Interests</h3>
                  <p className="text-sm">Processing necessary for our business operations, fraud prevention, and service improvement.</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Legal Obligations</h3>
                  <p className="text-sm">Processing required to comply with tax laws, accounting regulations, and court orders.</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Consent</h3>
                  <p className="text-sm">Processing based on your explicit consent for marketing communications and optional features.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. International Data Transfers
              </h2>
              <p className="mb-4">
                As a global service operating across multiple jurisdictions, we may transfer your data internationally while maintaining appropriate safeguards:
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">🇬🇧</span>
                  <span className="text-sm"><strong>United Kingdom:</strong> Adequacy decision and standard contractual clauses for data protection.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">🇺🇸</span>
                  <span className="text-sm"><strong>United States:</strong> CCPA compliance and enhanced privacy protections for California residents.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">🇨🇦</span>
                  <span className="text-sm"><strong>Canada:</strong> PIPEDA compliance and Canadian privacy law adherence.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">🇪🇺</span>
                  <span className="text-sm"><strong>European Union:</strong> GDPR compliance with data localization and transfer mechanisms.</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold">🇦🇺</span>
                  <span className="text-sm"><strong>Australia:</strong> Privacy Act compliance and Australian privacy principles.</span>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Data Retention & Security
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Retention Periods</h3>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Account Data:</strong> Retained while account is active</li>
                    <li>• <strong>Transaction Records:</strong> 7 years for tax compliance</li>
                    <li>• <strong>Communication History:</strong> 2 years for customer service</li>
                    <li>• <strong>Analytics Data:</strong> 26 months for business insights</li>
                    <li>• <strong>Backup Data:</strong> 30 days for disaster recovery</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Security Measures</h3>
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Encryption:</strong> AES-256 for data at rest, TLS 1.3 for data in transit</li>
                    <li>• <strong>Access Controls:</strong> Multi-factor authentication and role-based access</li>
                    <li>• <strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
                    <li>• <strong>Compliance:</strong> Regular security audits and penetration testing</li>
                    <li>• <strong>Backup:</strong> Encrypted backups with geographic redundancy</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Cookies & Tracking Technologies
              </h2>
              <p className="mb-4">
                Sellaap.com uses cookies and similar technologies to enhance your experience:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                  <p className="text-sm">Required for basic website functionality, security, and account access. Cannot be disabled.</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Performance Cookies</h3>
                  <p className="text-sm">Help us understand how you use our site and improve performance across all regions.</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                  <p className="text-sm">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                You can manage cookie preferences through your browser settings or our cookie consent manager. Disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Your Privacy Rights
              </h2>
              <p className="mb-4">
                Depending on your location, you have specific rights regarding your personal data:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">🇪🇺 EU/UK Rights (GDPR)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Right to access your personal data</li>
                    <li>• Right to rectification of inaccurate data</li>
                    <li>• Right to erasure (right to be forgotten)</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                    <li>• Right to withdraw consent</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">🇺🇸 California Rights (CCPA)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Right to know what personal information is collected</li>
                    <li>• Right to know whether personal information is sold</li>
                    <li>• Right to say no to the sale of personal information</li>
                    <li>• Right to access your personal information</li>
                    <li>• Right to equal service and price</li>
                    <li>• Right to delete personal information</li>
                  </ul>
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-foreground mb-2">How to Exercise Your Rights</h3>
                <p className="text-sm mb-2">
                  Contact us using the information below to exercise any of these rights. We will respond within the timeframe required by applicable law (typically 30 days for GDPR, 45 days for CCPA).
                </p>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Email:</strong> privacy@sellaap.com</li>
                  <li>• <strong>Phone:</strong> +1-800-SELLAAP</li>
                  <li>• <strong>Mail:</strong> Privacy Office, Sellaap.com, 123 Tech Street, San Francisco, CA 94105</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Third-Party Services & Links
              </h2>
              <p className="mb-4">
                Our platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites. We recommend reviewing the privacy policies of any third-party services you access through our platform.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Payment Processors</h3>
                <p className="text-sm mb-2">We work with PCI-compliant payment processors who handle your financial information according to industry standards.</p>
                <h3 className="font-semibold text-foreground mb-2">Analytics Providers</h3>
                <p className="text-sm mb-2">We use analytics services to understand user behavior and improve our platform while respecting privacy preferences.</p>
                <h3 className="font-semibold text-foreground mb-2">Marketing Partners</h3>
                <p className="text-sm">Our marketing partners must comply with applicable privacy laws and our strict data handling requirements.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Children's Privacy
              </h2>
              <p className="mb-4">
                Sellaap.com is not intended for children under 13 years of age (or 16 in the EU). We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately for prompt deletion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Changes to This Policy
              </h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or service offerings. We will notify you of significant changes through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm mb-4">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our website</li>
                <li>Updated "Last Updated" date at the top of this policy</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Continued use of Sellaap.com after policy changes means acceptance of the updated terms. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Privacy Office</h3>
                    <p className="text-sm space-y-1">
                      <span className="block">📧 Email: privacy@sellaap.com</span>
                      <span className="block">📞 Phone: +1-800-SELLAAP</span>
                      <span className="block">🏢 Address: Privacy Office, Sellaap.com</span>
                      <span className="block">123 Tech Street, San Francisco, CA 94105</span>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Regional Contacts</h3>
                    <p className="text-sm space-y-1">
                      <span className="block">🇬🇧 UK: privacy-uk@sellaap.com</span>
                      <span className="block">🇪🇺 EU: privacy-eu@sellaap.com</span>
                      <span className="block">🇨🇦 Canada: privacy-ca@sellaap.com</span>
                      <span className="block">🇦🇺 Australia: privacy-au@sellaap.com</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  For urgent privacy concerns or data breaches, please mark your communication as "URGENT" in the subject line. We prioritize privacy-related communications and respond promptly.
                </p>
              </div>
            </section>

            <section className="text-center">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy is available in multiple languages upon request. We are committed to transparency and will provide additional information about our data practices as needed.
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <span className="text-xs bg-muted px-2 py-1 rounded">GDPR Compliant</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">CCPA Compliant</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">PIPEDA Compliant</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">Privacy Act Compliant</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}