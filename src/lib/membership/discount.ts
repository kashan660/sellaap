import { prisma } from '@/lib/prisma';
import { getTierByKey } from './tiers';

export interface MembershipDiscount {
  percent: number;
  tierName: string | null;
  paddleDiscountId: string | null;
}

// Authoritative source of truth for a user's Sellaap+ discount - called both
// from the checkout server action (to validate/apply the charged total) and
// from a client-facing action (to display it before the user submits).
export async function getActiveDiscountPercent(userId: number): Promise<MembershipDiscount> {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription || subscription.status !== 'active') {
    return { percent: 0, tierName: null, paddleDiscountId: null };
  }

  const tier = getTierByKey(subscription.tier);
  if (!tier) return { percent: 0, tierName: null, paddleDiscountId: null };

  return { percent: tier.discountPercent, tierName: tier.name, paddleDiscountId: tier.paddleDiscountId };
}
