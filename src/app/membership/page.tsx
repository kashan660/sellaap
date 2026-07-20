import { Metadata } from "next";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MembershipPricing } from "@/components/MembershipPricing";

export const metadata: Metadata = {
  title: "Sellaap+ Membership - Sellaap",
  description: "Join Sellaap+ for a discount on every order.",
};

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const h = await headers();
  // Vercel sets this at the edge; absent locally / off-Vercel, in which case
  // Paddle.PricePreview() falls back to IP-based auto-detection client-side.
  const countryCode = h.get("x-vercel-ip-country") || undefined;

  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Sellaap+ Membership</h1>
        <p className="text-lg text-muted-foreground">Save on every order, every time you shop.</p>
      </div>
      <MembershipPricing
        countryCode={countryCode}
        userId={session?.user?.id ?? null}
        userEmail={session?.user?.email ?? null}
      />
    </div>
  );
}
