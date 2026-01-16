import { Metadata } from "next";
import { generateStructuredData } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Privacy Policy | Sellaap Europe",
  description: "Sellaap privacy policy for European users. Learn how we collect, use, and protect your personal data in compliance with GDPR.",
  alternates: {
    canonical: "https://sellaap.com/europe/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Sellaap Europe",
    description: "Sellaap privacy policy for European users. Learn how we collect, use, and protect your personal data in compliance with GDPR.",
    url: "https://sellaap.com/europe/privacy",
    siteName: "Sellaap",
    images: [
      {
        url: "https://sellaap.com/og-image-privacy-europe.jpg",
        width: 1200,
        height: 630,
        alt: "Sellaap Europe Privacy Policy",
      },
    ],
    locale: "en-GB",
    type: "website",
  },
};

export default function EuropePrivacyPage() {
  const structuredData = generateStructuredData({
    type: "WebPage",
    title: "Privacy Policy | Sellaap Europe",
    description: "Sellaap privacy policy for European users. Learn how we collect, use, and protect your personal data in compliance with GDPR.",
    url: "https://sellaap.com/europe/privacy",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy - Europe</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 17, 2026</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            This Privacy Policy applies to users in the European Economic Area (EEA) and United Kingdom. 
            We are committed to protecting your personal data in accordance with the General Data Protection 
            Regulation (GDPR) and other applicable European privacy laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Controller</h2>
          <p>
            <strong>Sellaap Europe Ltd.</strong><br />
            Email: <a href="mailto:service@sellaap.com" className="text-primary hover:underline">service@sellaap.com</a><br />
            Address: 123 Tech Street, Dublin 2, Ireland<br />
            Company Registration: IE12345678
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Data We Collect</h2>
          <h3 className="text-xl font-medium mb-3">Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Account registration details (name, email, password)</li>
            <li>Profile information and preferences</li>
            <li>Product listings and descriptions</li>
            <li>Payment information (processed securely through PayPal, Payoneer, or direct vendor payments)</li>
            <li>Customer support communications</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Usage patterns and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Legal Basis for Processing</h2>
          <p className="mb-4">We process your personal data based on the following legal grounds:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Contract:</strong> To provide our marketplace services and process transactions</li>
            <li><strong>Legitimate Interests:</strong> To improve our services, prevent fraud, and ensure security</li>
            <li><strong>Consent:</strong> For marketing communications and non-essential cookies</li>
            <li><strong>Legal Obligation:</strong> To comply with tax, accounting, and regulatory requirements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and maintain our marketplace platform</li>
            <li>To process transactions and facilitate payments</li>
            <li>To verify user identity and prevent fraud</li>
            <li>To communicate with you about your account and transactions</li>
            <li>To improve our services and develop new features</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p className="mb-4">
            We retain your personal data for the following periods:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account data:</strong> Until account deletion plus 6 years</li>
            <li><strong>Transaction records:</strong> 7 years for tax and accounting purposes</li>
            <li><strong>Marketing data:</strong> Until consent is withdrawn or 2 years after last interaction</li>
            <li><strong>Support communications:</strong> 2 years</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights Under GDPR</h2>
          <p className="mb-4">You have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Right of Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Right to Object:</strong> Object to certain processing activities</li>
            <li><strong>Rights Related to Automated Decision-Making:</strong> Not be subject to automated decisions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
          <p className="mb-4">
            Your data may be transferred to and processed in countries outside the EEA. We ensure 
            appropriate safeguards are in place, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Adequacy decisions for countries with sufficient protection</li>
            <li>Binding Corporate Rules where applicable</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal data, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and penetration testing</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Staff training on data protection</li>
            <li>Incident response procedures</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Processors</h2>
          <p className="mb-4">
            We work with trusted third-party service providers who process data on our behalf:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Payment Processors:</strong> PayPal, Payoneer (secure payment processing)</li>
            <li><strong>Cloud Infrastructure:</strong> AWS, Google Cloud (hosting and storage)</li>
            <li><strong>Analytics:</strong> Google Analytics, Mixpanel (service improvement)</li>
            <li><strong>Customer Support:</strong> Zendesk, Intercom (support services)</li>
          </ul>
          <p>All processors are bound by data processing agreements requiring GDPR compliance.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy or your data rights, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: <a href="mailto:service@sellaap.com" className="text-primary hover:underline">service@sellaap.com</a></li>
            <li>Postal: Data Protection Officer, Sellaap Europe Ltd., 123 Tech Street, Dublin 2, Ireland</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Supervisory Authority</h2>
          <p className="mb-4">
            You have the right to lodge a complaint with your local data protection supervisory authority:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Ireland:</strong> Data Protection Commission - <a href="https://www.dataprotection.ie" className="text-primary hover:underline">www.dataprotection.ie</a></li>
            <li><strong>UK:</strong> Information Commissioner's Office - <a href="https://ico.org.uk" className="text-primary hover:underline">ico.org.uk</a></li>
            <li><strong>Other EEA countries:</strong> Find your authority at <a href="https://edpb.europa.eu" className="text-primary hover:underline">edpb.europa.eu</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes 
            through our website or via email. Continued use of our services after changes constitutes acceptance 
            of the updated policy.
          </p>
        </section>

        <div className="bg-muted p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-2">Safe Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            We partner with trusted payment providers including PayPal, Payoneer, and direct vendor payments 
            to ensure your financial information remains secure and protected.
          </p>
        </div>
      </div>
    </div>
  );
}