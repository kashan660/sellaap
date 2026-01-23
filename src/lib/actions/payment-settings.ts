'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getPaymentSettings() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const settings = await prisma.paymentSettings.findFirst();
    return { success: true, settings };
  } catch (error) {
    console.error('Failed to fetch payment settings:', error);
    return { error: "Failed to fetch payment settings" };
  }
}

export async function updatePaymentSettings(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: "Unauthorized" };
  }

  try {
    const data = {
      paypalEmail: formData.get('paypalEmail') as string || null,
      isPaypalEnabled: formData.get('isPaypalEnabled') === 'on',
      payoneerDetails: formData.get('payoneerDetails') as string || null,
      isPayoneerEnabled: formData.get('isPayoneerEnabled') === 'on',
      wiseDetails: formData.get('wiseDetails') as string || null,
      isWiseEnabled: formData.get('isWiseEnabled') === 'on',
      btcAddress: formData.get('btcAddress') as string || null,
      isBtcEnabled: formData.get('isBtcEnabled') === 'on',
      binancePayId: formData.get('binancePayId') as string || null,
      isBinanceEnabled: formData.get('isBinanceEnabled') === 'on',
      usdtAddress: formData.get('usdtAddress') as string || null,
      isUsdtEnabled: formData.get('isUsdtEnabled') === 'on',
    };

    const existing = await prisma.paymentSettings.findFirst();

    if (existing) {
      await prisma.paymentSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.paymentSettings.create({
        data,
      });
    }

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to update payment settings:', error);
    return { error: "Failed to update payment settings" };
  }
}
