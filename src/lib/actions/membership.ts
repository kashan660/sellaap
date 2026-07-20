'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getActiveDiscountPercent, type MembershipDiscount } from '@/lib/membership/discount';

export async function getMyMembershipDiscount(): Promise<MembershipDiscount> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { percent: 0, tierName: null, paddleDiscountId: null };
  return getActiveDiscountPercent(parseInt(session.user.id, 10));
}
