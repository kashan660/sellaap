export interface Tier {
  name: 'Starter' | 'Pro' | 'Advanced';
  key: 'starter' | 'pro' | 'advanced';
  description: string;
  features: string[];
  discountPercent: number;
  priceId: { month: string; year: string };
  // Reusable Paddle Discount object (percentage, non-recurring) applied to
  // one-time order transactions for members of this tier - see
  // createPaddleCheckout in lib/actions/order.ts.
  paddleDiscountId: string;
}

export const TIERS: Tier[] = [
  {
    name: 'Starter',
    key: 'starter',
    description: '5% off every order at Sellaap.',
    features: ['5% off every order', 'Cancel anytime'],
    discountPercent: 5,
    priceId: {
      month: 'pri_01kxzswtcg2p2r3x6ye04vpzv4',
      year: 'pri_01kxzswv5jchy94p4daqahy9tq',
    },
    paddleDiscountId: 'dsc_01kxzt6y3arb74h99ny2ddqz46',
  },
  {
    name: 'Pro',
    key: 'pro',
    description: '10% off every order at Sellaap.',
    features: ['10% off every order', 'Cancel anytime'],
    discountPercent: 10,
    priceId: {
      month: 'pri_01kxzswvtmjmwf1mz9sxqk7zmb',
      year: 'pri_01kxzsww45sjth7wydywxe5jsd',
    },
    paddleDiscountId: 'dsc_01kxzt6yejfjp0teh6n00mvvw5',
  },
  {
    name: 'Advanced',
    key: 'advanced',
    description: '15% off every order at Sellaap.',
    features: ['15% off every order', 'Cancel anytime', 'Priority support'],
    discountPercent: 15,
    priceId: {
      month: 'pri_01kxzswwqmepqd386qbz8t5t9y',
      year: 'pri_01kxzswx2cms9vsf13dr7hfer0',
    },
    paddleDiscountId: 'dsc_01kxzt6z57tw0ts9a0t7fz1jxp',
  },
];

export function getTierByKey(key: string): Tier | undefined {
  return TIERS.find((t) => t.key === key);
}

export function getTierByPriceId(priceId: string): Tier | undefined {
  return TIERS.find((t) => t.priceId.month === priceId || t.priceId.year === priceId);
}

export function getBillingPeriodForPriceId(tier: Tier, priceId: string): 'month' | 'year' | null {
  if (tier.priceId.month === priceId) return 'month';
  if (tier.priceId.year === priceId) return 'year';
  return null;
}
