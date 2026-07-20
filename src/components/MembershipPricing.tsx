'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { Check } from 'lucide-react';
import { TIERS } from '@/lib/membership/tiers';

interface MembershipPricingProps {
  countryCode?: string;
  userId: string | null;
  userEmail: string | null;
}

type BillingPeriod = 'month' | 'year';

function resolvePaddleEnvironment(): 'sandbox' | 'production' {
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
  if (!env) {
    // Fail loudly rather than silently defaulting - running membership
    // checkout against the wrong Paddle account is not a safe default.
    throw new Error('NEXT_PUBLIC_PADDLE_ENV is not set. Refusing to initialize Paddle.');
  }
  const normalized = env.toLowerCase();
  if (normalized === 'live' || normalized === 'production') return 'production';
  if (normalized === 'sandbox') return 'sandbox';
  throw new Error(`NEXT_PUBLIC_PADDLE_ENV has an unrecognized value: "${env}"`);
}

export function MembershipPricing({ countryCode, userId, userEmail }: MembershipPricingProps) {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('month');
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [formattedTotals, setFormattedTotals] = useState<Record<string, string>>({});
  const [initError, setInitError] = useState<string | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [subscribingKey, setSubscribingKey] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      setInitError('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set.');
      return;
    }

    let environment: 'sandbox' | 'production';
    try {
      environment = resolvePaddleEnvironment();
    } catch (e) {
      setInitError(e instanceof Error ? e.message : 'Failed to resolve Paddle environment.');
      return;
    }

    initializePaddle({ environment, token })
      .then((instance) => {
        if (instance) setPaddle(instance);
        else setInitError('Paddle.js failed to initialize.');
      })
      .catch((e) => setInitError(e instanceof Error ? e.message : 'Paddle.js failed to initialize.'));
  }, []);

  useEffect(() => {
    if (!paddle) return;
    setLoadingPrices(true);
    const items = TIERS.flatMap((tier) => [
      { priceId: tier.priceId.month, quantity: 1 },
      { priceId: tier.priceId.year, quantity: 1 },
    ]);

    paddle
      .PricePreview({
        items,
        ...(countryCode ? { address: { countryCode } } : {}),
      })
      .then((result) => {
        const map: Record<string, string> = {};
        for (const lineItem of result.data.details.lineItems) {
          map[lineItem.price.id] = lineItem.formattedTotals.total;
        }
        setFormattedTotals(map);
      })
      .catch((e) => setInitError(e instanceof Error ? e.message : 'Failed to load prices.'))
      .finally(() => setLoadingPrices(false));
  }, [paddle, countryCode]);

  function handleSubscribe(tierKey: string, priceId: string) {
    if (!paddle) return;

    if (!userId) {
      router.push(`/auth/signin?callbackUrl=/membership`);
      return;
    }

    setSubscribingKey(tierKey);
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId },
      ...(userEmail ? { customer: { email: userEmail } } : {}),
      settings: {
        displayMode: 'overlay',
        variant: 'one-page',
        successUrl: `${window.location.origin}/welcome`,
      },
    });
  }

  if (initError) {
    return (
      <div className="max-w-xl mx-auto bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
        {initError}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${billingPeriod === 'month' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setBillingPeriod((p) => (p === 'month' ? 'year' : 'month'))}
          className="relative w-12 h-6 rounded-full bg-muted transition-colors"
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-primary transition-transform ${
              billingPeriod === 'year' ? 'translate-x-6' : ''
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingPeriod === 'year' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Yearly
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const priceId = tier.priceId[billingPeriod];
          const total = formattedTotals[priceId];

          return (
            <div key={tier.key} className="bg-card border rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-bold mb-1">{tier.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <div className="text-3xl font-extrabold mb-4">
                {loadingPrices || !total ? (
                  <span className="text-muted-foreground text-lg">Loading price...</span>
                ) : (
                  <>
                    {total}
                    <span className="text-sm font-normal text-muted-foreground">
                      {' '}
                      / {billingPeriod}
                    </span>
                  </>
                )}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!paddle || loadingPrices || subscribingKey === tier.key}
                onClick={() => handleSubscribe(tier.key, priceId)}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {subscribingKey === tier.key ? 'Opening checkout...' : `Subscribe to ${tier.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
