import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Sellaap.com - Digital Marketplace Platform",
  description: "Read Sellaap.com's Terms of Service. Understand our platform policies, user responsibilities, payment methods including PayPal and Payoneer, and service terms for our digital marketplace.",
  keywords: [
    "terms of service",
    "Sellaap terms",
    "digital marketplace terms",
    "platform terms",
    "user agreement",
    "service terms",
    "marketplace policies",
    "payment terms",
    "PayPal payments",
    "Payoneer payments",
    "vendor payments",
    "safe payments",
    "digital products terms",
    "seller responsibilities",
    "buyer responsibilities"
  ],
  openGraph: {
    title: "Terms of Service | Sellaap.com - Digital Marketplace Platform",
    description: "Understand Sellaap.com's platform policies, user responsibilities, and payment terms for our secure digital marketplace.",
    type: 'website',
    siteName: 'Sellaap.com',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms of Service | Sellaap.com - Digital Marketplace Platform",
    description: "Read our comprehensive terms of service for using Sellaap.com's digital marketplace platform."
  }
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 17, 2026
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            1. Platform Description
          </h2>
          <p className="mb-4">
            Sellaap.com is an online marketplace that allows third-party sellers to list and sell digital products and services. We act as an intermediary platform connecting buyers and independent sellers, providing a secure environment for digital commerce.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">Platform Role</h3>
            <p className="text-sm text-blue-700">
              Sellaap.com does not own the products listed on our platform. We provide the marketplace infrastructure and facilitate transactions between buyers and sellers.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            2. Eligibility
          </h2>
          <p className="mb-4">
            You must be at least 18 years old to use our services. By accessing or using Sellaap.com, you represent and warrant that you meet this eligibility requirement.
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Age Verification</h3>
              <p className="text-sm">
                We may request age verification documentation for certain services or high-value transactions.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Legal Capacity</h3>
              <p className="text-sm">
                You must have the legal capacity to enter into binding contracts in your jurisdiction.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            3. User Accounts
          </h2>
          <p className="mb-4">
            When you create an account with Sellaap.com, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Account Security</h3>
              <p className="text-sm">
                You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Account Accuracy</h3>
              <p className="text-sm">
                Keep your account information up-to-date. Inaccurate information may result in service limitations or account suspension.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Account Suspension</h3>
              <p className="text-sm">
                We may suspend or terminate accounts for violations of these terms, fraudulent activity, or other policy breaches.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            4. Seller Responsibilities
          </h2>
          <p className="mb-4">
            Sellers on Sellaap.com must adhere to the following requirements:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Product Ownership</h3>
              <p className="text-sm">
                Sellers must own or have legitimate rights to sell all listed products. No counterfeit, stolen, or unauthorized items are permitted.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Accurate Descriptions</h3>
              <p className="text-sm">
                Provide complete, accurate, and truthful product descriptions, including features, limitations, and system requirements.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Delivery Promise</h3>
              <p className="text-sm">
                Deliver products as described and within the specified timeframe. Digital products must be accessible and functional as advertised.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Customer Support</h3>
              <p className="text-sm">
                Provide reasonable customer support and handle refund requests according to your stated policies and our platform guidelines.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Legal Compliance</h3>
              <p className="text-sm">
                Comply with all applicable laws, regulations, and industry standards for your products and services.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            5. Buyer Responsibilities
          </h2>
          <p className="mb-4">
            Buyers on Sellaap.com agree to the following obligations:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Due Diligence</h3>
              <p className="text-sm">
                Carefully review product descriptions, requirements, and seller ratings before making purchases.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">License Compliance</h3>
              <p className="text-sm">
                Use purchased products according to their license terms and restrictions. Respect intellectual property rights.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Lawful Use</h3>
              <p className="text-sm">
                Not misuse or redistribute products unlawfully. Products must be used for legitimate purposes only.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Payment Obligations</h3>
              <p className="text-sm">
                Complete payments promptly and honor transaction commitments. Payment disputes should be resolved through proper channels.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            6. Payments & Fees
          </h2>
          <p className="mb-4">
            Sellaap.com offers multiple secure payment methods to facilitate transactions between buyers and sellers:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Payment Methods</h3>
              <ul className="text-sm space-y-1">
                <li>• <strong>PayPal:</strong> Secure online payments with buyer protection</li>
                <li>• <strong>Payoneer:</strong> Global payment processing for international transactions</li>
                <li>• <strong>Direct Vendor Payment:</strong> Secure direct payments to verified sellers</li>
                <li>• <strong>Credit/Debit Cards:</strong> Major card networks supported</li>
              </ul>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-800 mb-2">Payment Security</h3>
              <p className="text-sm text-green-700">
                All payment methods are secured with industry-standard encryption. We never store complete payment card details on our servers.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Platform Fees</h3>
              <p className="text-sm">
                Sellaap.com may charge platform or commission fees for certain services. All fees are clearly disclosed before transaction completion.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Fee Refunds</h3>
              <p className="text-sm">
                Platform fees are generally non-refundable unless stated otherwise or in cases of platform error.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            7. Intellectual Property
          </h2>
          <p className="mb-4">
            All content and materials on Sellaap.com are protected by intellectual property laws:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Platform Content</h3>
              <p className="text-sm">
                All content on Sellaap.com (logo, branding, platform design, and functionality) is owned by Sellaap.com and protected by copyright and trademark laws.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Product Rights</h3>
              <p className="text-sm">
                Product rights remain with their respective sellers. Buyers receive only the rights expressly granted in the product license.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">License Terms</h3>
              <p className="text-sm">
                Each product may have specific license terms. Buyers must comply with all license restrictions and usage limitations.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            8. Prohibited Activities
          </h2>
          <p className="mb-4">
            You may not engage in the following activities on Sellaap.com:
          </p>
          <div className="grid gap-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">Illegal Content</h3>
              <p className="text-sm text-red-700">
                Upload, sell, or distribute illegal, harmful, or copyrighted content without proper authorization.
              </p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">Fraudulent Activities</h3>
              <p className="text-sm text-red-700">
                Attempt fraud, misrepresentation, or system abuse. This includes fake reviews, payment fraud, or identity theft.
              </p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">System Interference</h3>
              <p className="text-sm text-red-700">
                Use the platform for unlawful purposes, hacking attempts, or interference with our services or other users.
              </p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">Spam and Abuse</h3>
              <p className="text-sm text-red-700">
                Send unsolicited messages, spam, or engage in harassment of other users or platform staff.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            9. Limitation of Liability
          </h2>
          <p className="mb-4">
            Sellaap.com is not liable for certain types of losses or damages:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Product Quality</h3>
              <p className="text-sm">
                We are not responsible for seller product quality, functionality, or performance. Disputes should be resolved directly with sellers.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Financial Losses</h3>
              <p className="text-sm">
                We are not liable for financial losses beyond the transaction amount, including lost profits or business interruption.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Service Interruptions</h3>
              <p className="text-sm">
                We are not liable for service interruptions, technical issues, or platform downtime beyond our reasonable control.
              </p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-semibold text-yellow-800 mb-2">Use at Your Own Risk</h3>
              <p className="text-sm text-yellow-700">
                Use of the platform is at your own risk. We provide the service "as is" without warranties of any kind.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            10. Termination
          </h2>
          <p className="mb-4">
            We reserve the right to suspend or terminate accounts under the following circumstances:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Policy Violations</h3>
              <p className="text-sm">
                Accounts may be terminated without notice for violations of these Terms of Service or other platform policies.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Fraudulent Activity</h3>
              <p className="text-sm">
                Accounts involved in fraud, misrepresentation, or illegal activities will be immediately terminated.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">System Abuse</h3>
              <p className="text-sm">
                Accounts that abuse our systems, interfere with services, or harm other users may be terminated.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Legal Requirements</h3>
              <p className="text-sm">
                We may terminate accounts when required by law, court order, or regulatory requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            11. Changes to Terms
          </h2>
          <p className="mb-4">
            We may update these Terms of Service from time to time to reflect changes in our services, legal requirements, or business operations:
          </p>
          <div className="grid gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Notification</h3>
              <p className="text-sm">
                We will provide notice of material changes through our platform, email, or other appropriate communication channels.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Effective Date</h3>
              <p className="text-sm">
                Changes will be effective immediately upon posting or on the specified effective date, whichever is later.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Continued Use</h3>
              <p className="text-sm">
                Continued use of our services after changes constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            12. Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding these Terms of Service, please contact us:
          </p>
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Sellaap.com Support</h3>
            <p className="text-sm space-y-1">
              <span className="block">📧 Email: <a href="mailto:service@sellaap.com" className="text-blue-600 hover:underline">service@sellaap.com</a></span>
              <span className="block">📧 Support: <a href="mailto:support@sellaap.com" className="text-blue-600 hover:underline">support@sellaap.com</a></span>
              <span className="block">🌐 Website: <a href="https://sellaap.com" className="text-blue-600 hover:underline">https://sellaap.com</a></span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            For urgent matters or legal inquiries, please contact us through the appropriate channels listed above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            13. Governing Law
          </h2>
          <p className="mb-4">
            These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction where Sellaap.com operates, without regard to conflict of law principles.
          </p>
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Dispute Resolution</h3>
            <p className="text-sm">
              Any disputes arising from these terms will be resolved through the appropriate legal channels in the applicable jurisdiction.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-semibold text-green-800 mb-2">Acceptance of Terms</h3>
            <p className="text-sm text-green-700">
              By accessing or using Sellaap.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use our services.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}