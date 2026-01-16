import { Metadata } from "next";
import { generateStructuredData } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Privacy Policy | Sellaap Australia",
  description: "Sellaap privacy policy for Australian users. Learn how we collect, use, and protect your personal information in compliance with the Privacy Act 1988.",
  alternates: {
    canonical: "https://sellaap.com/australia/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Sellaap Australia",
    description: "Sellaap privacy policy for Australian users. Learn how we collect, use, and protect your personal information in compliance with the Privacy Act 1988.",
    url: "https://sellaap.com/australia/privacy",
    siteName: "Sellaap",
    images: [
      {
        url: "https://sellaap.com/og-image-privacy-australia.jpg",
        width: 1200,
        height: 630,
        alt: "Sellaap Australia Privacy Policy",
      },
    ],
    locale: "en-AU",
    type: "website",
  },
};

export default function AustraliaPrivacyPage() {
  const structuredData = generateStructuredData({
    type: "WebPage",
    title: "Privacy Policy | Sellaap Australia",
    description: "Sellaap privacy policy for Australian users. Learn how we collect, use, and protect your personal information in compliance with the Privacy Act 1988.",
    url: "https://sellaap.com/australia/privacy",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy - Australia</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 17, 2026</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            This Privacy Policy applies to users in Australia. We are committed to protecting your personal 
            information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p>
            <strong>Sellaap Australia Pty Ltd.</strong><br />
            Email: <a href="mailto:service@sellaap.com" className="text-primary hover:underline">service@sellaap.com</a><br />
            Address: Level 15, 123 Pitt Street, Sydney NSW 2000, Australia<br />
            ABN: 12 345 678 901<br />
            We are an APP entity under the Privacy Act 1988.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Information We Collect</h2>
          <h3 className="text-xl font-medium mb-3">Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Account registration details (name, email address, password)</li>
            <li>Profile information and business details</li>
            <li>Product listings and descriptions</li>
            <li>Payment information (processed securely through PayPal, Payoneer, or direct vendor payments)</li>
            <li>Customer support inquiries and feedback</li>
            <li>Marketing preferences and communications</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Information We Collect Automatically</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Device information and browser details</li>
            <li>IP address and approximate location</li>
            <li>Website usage patterns and analytics</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Transaction history and account activity</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Sensitive Information</h3>
          <p className="mb-4">
            We do not generally collect sensitive information (as defined under the Privacy Act) unless:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>You voluntarily provide it to us</li>
            <li>It is required or authorised by law</li>
            <li>It is necessary to prevent or lessen a serious threat to life, health, or safety</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Collect Personal Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Directly from you when you register, make purchases, or contact us</li>
            <li>Automatically through our website and mobile applications</li>
            <li>From third parties such as payment processors and social media platforms</li>
            <li>From publicly available sources for business verification purposes</li>
          </ul>
          <p className="mb-4">
            Where reasonable and practicable, we will collect personal information directly from you. 
            If we collect information about you from a third party, we will take reasonable steps to 
            notify you or ensure you are aware of the collection.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Purposes for Collecting Personal Information</h2>
          <p className="mb-4">We collect, hold, use, and disclose personal information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and improve our marketplace services</li>
            <li>To process transactions and facilitate payments</li>
            <li>To verify user identity and prevent fraud</li>
            <li>To communicate with you about your account and services</li>
            <li>To comply with legal and regulatory obligations</li>
            <li>To conduct marketing and promotional activities (with your consent)</li>
            <li>To maintain and improve our website and services</li>
            <li>To respond to inquiries and provide customer support</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclosure of Personal Information</h2>
          <p className="mb-4">We may disclose your personal information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Payment processors:</strong> PayPal, Payoneer, and direct vendor payment systems</li>
            <li><strong>Service providers:</strong> Cloud hosting, analytics, and customer support providers</li>
            <li><strong>Business partners:</strong> For marketing and promotional activities (with your consent)</li>
            <li><strong>Legal and regulatory authorities:</strong> When required by law or court order</li>
            <li><strong>Business transferees:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p className="mb-4">
            We require all third parties to whom we disclose personal information to handle it in accordance 
            with the Privacy Act and our privacy requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
          <p className="mb-4">
            We may transfer your personal information to recipients located outside Australia, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>United States (cloud hosting and payment processing)</li>
            <li>European Union (data processing and analytics)</li>
            <li>Other countries where our service providers operate</li>
          </ul>
          <p className="mb-4">
            Before disclosing personal information to overseas recipients, we take reasonable steps to ensure 
            they comply with the APPs or are subject to laws or binding schemes that provide similar protection.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure payment processing through trusted providers</li>
            <li>Access controls and authentication systems</li>
            <li>Regular security assessments and monitoring</li>
            <li>Staff training on privacy and security</li>
            <li>Incident response and breach notification procedures</li>
          </ul>
          <p className="mb-4">
            Despite our security measures, no internet transmission is completely secure. We encourage you to 
            use strong passwords and keep your login credentials confidential.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
          <p className="mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remember your preferences and login status</li>
            <li>Analyze website usage and improve our services</li>
            <li>Provide personalized content and advertising</li>
            <li>Detect and prevent fraud and security issues</li>
          </ul>
          <p className="mb-4">
            You can control cookie settings through your browser preferences. Some cookies are essential 
            for website functionality and cannot be disabled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Direct Marketing</h2>
          <p className="mb-4">
            We may use your personal information for direct marketing purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Sending promotional emails about new products and services</li>
            <li>Providing special offers and discounts</li>
            <li>Sharing relevant content and updates</li>
          </ul>
          <p className="mb-4">
            We will only send you marketing communications if you have consented or if we are otherwise 
            permitted by law. You can opt-out of marketing communications at any time by:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Clicking the "unsubscribe" link in our emails</li>
            <li>Contacting us at <a href="mailto:service@sellaap.com" className="text-primary hover:underline">service@sellaap.com</a></li>
            <li>Updating your account preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">Under the Privacy Act, you have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Complaint:</strong> Lodge a complaint with us or the Office of the Australian Information Commissioner</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us at <a href="mailto:service@sellaap.com" className="text-primary hover:underline">service@sellaap.com</a>. 
            We will respond to your request within a reasonable time and may need to verify your identity before processing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Breach Notification</h2>
          <p className="mb-4">
            If we experience a data breach that is likely to result in serious harm to you, we will:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Notify you as soon as practicable</li>
            <li>Notify the Office of the Australian Information Commissioner</li>
            <li>Provide information about the breach and recommended steps</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: <a href="mailto:service@sellaap.com" className="text-primary hover:underline">service@sellaap.com</a></li>
            <li>Phone: +61 2 9000 0000 (Monday-Friday, 9 AM-5 PM AEST)</li>
            <li>Mail: Privacy Officer, Sellaap Australia Pty Ltd., Level 15, 123 Pitt Street, Sydney NSW 2000</li>
          </ul>
          <p className="mb-4">
            We will respond to your inquiry within 30 days. If you are not satisfied with our response, 
            you may lodge a complaint with the Office of the Australian Information Commissioner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Office of the Australian Information Commissioner</h2>
          <p className="mb-4">
            If you wish to make a complaint about our handling of your personal information, you can contact:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Website: <a href="https://www.oaic.gov.au" className="text-primary hover:underline">www.oaic.gov.au</a></li>
            <li>Phone: 1300 363 992</li>
            <li>Email: <a href="mailto:enquiries@oaic.gov.au" className="text-primary hover:underline">enquiries@oaic.gov.au</a></li>
            <li>Mail: GPO Box 5218, Sydney NSW 2001</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. When we do, we will:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Post the updated policy on our website</li>
            <li>Update the "Last updated" date at the top of the policy</li>
            <li>Notify you of significant changes where required</li>
          </ul>
          <p>
            Your continued use of our services after changes are made constitutes acceptance of the updated policy.
          </p>
        </section>

        <div className="bg-muted p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-2">Safe Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            We partner with trusted payment providers including PayPal, Payoneer, and direct vendor payments 
            to ensure your financial information remains secure and protected under Australian privacy laws.
          </p>
        </div>
      </div>
    </div>
  );
}