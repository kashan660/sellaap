import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let pageSeo = null;
  try {
      if ((prisma as any).pageSeo) {
        pageSeo = await prisma.pageSeo.findUnique({ where: { path: '/contact' } });
      }
  } catch (e) {}

  if (pageSeo) {
      return {
          title: pageSeo.title,
          description: pageSeo.description,
          keywords: pageSeo.keywords?.split(','),
          openGraph: pageSeo.ogImage ? { images: [pageSeo.ogImage] } : undefined
      }
  }

  return {
    title: "Contact Us - Sellaap",
    description: "Get in touch with Sellaap for support regarding Firestick setup and digital goods."
  };
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions about our Firestick setups or digital products? We're here to help you get the best streaming experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Us</h3>
                  <p className="text-muted-foreground mb-1">For general inquiries and support</p>
                  <a href="mailto:support@sellaap.com" className="text-primary hover:underline font-medium">support@sellaap.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p className="text-muted-foreground mb-1">Mon-Fri from 9am to 6pm GMT</p>
                  <a href="tel:+447454288184" className="text-primary hover:underline font-medium">+44 7454 288184</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp</h3>
                  <p className="text-muted-foreground mb-1">Instant support via chat</p>
                  <a 
                    href="https://wa.me/447454288184" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-8 border">
            <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
            <ul className="space-y-4">
              <li>
                <h4 className="font-medium text-foreground">How long does delivery take?</h4>
                <p className="text-sm text-muted-foreground mt-1">Digital products are delivered instantly. Firestick setups are shipped within 24 hours.</p>
              </li>
              <li>
                <h4 className="font-medium text-foreground">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground mt-1">Yes, we have a 30-day money-back guarantee for all our products.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <input 
                  type="text" 
                  id="firstName"
                  className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <input 
                  type="text" 
                  id="lastName"
                  className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <input 
                type="email" 
                id="email"
                className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <select 
                id="subject"
                className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="">Select a topic</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales Inquiry</option>
                <option value="billing">Billing Question</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message"
                rows={5}
                className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="How can we help you today?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                alert("Thank you for your message! We'll get back to you shortly.");
              }}
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
