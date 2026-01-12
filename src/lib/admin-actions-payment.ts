'use server';

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// --- Payment Settings Actions ---

export async function getPaymentSettings() {
  try {
    const settings = await prisma.paymentSettings.findFirst()
    return { success: true, data: settings }
  } catch (error) {
    console.error('Failed to fetch payment settings:', error)
    return { success: false, error: 'Failed to fetch payment settings' }
  }
}

export async function updatePaymentSettings(formData: FormData) {
  const paypalEmail = formData.get('paypalEmail') as string
  const isPaypalEnabled = formData.get('isPaypalEnabled') === 'on'
  
  const payoneerDetails = formData.get('payoneerDetails') as string
  const isPayoneerEnabled = formData.get('isPayoneerEnabled') === 'on'
  
  const wiseDetails = formData.get('wiseDetails') as string
  const isWiseEnabled = formData.get('isWiseEnabled') === 'on'
  
  const btcAddress = formData.get('btcAddress') as string
  const isBtcEnabled = formData.get('isBtcEnabled') === 'on'
  
  const binancePayId = formData.get('binancePayId') as string
  const isBinanceEnabled = formData.get('isBinanceEnabled') === 'on'
  
  const usdtAddress = formData.get('usdtAddress') as string
  const isUsdtEnabled = formData.get('isUsdtEnabled') === 'on'

  try {
    // Check if settings exist, if so update, else create
    const existing = await prisma.paymentSettings.findFirst()

    let settings;
    if (existing) {
      settings = await prisma.paymentSettings.update({
        where: { id: existing.id },
        data: {
          paypalEmail,
          isPaypalEnabled,
          payoneerDetails,
          isPayoneerEnabled,
          wiseDetails,
          isWiseEnabled,
          btcAddress,
          isBtcEnabled,
          binancePayId,
          isBinanceEnabled,
          usdtAddress,
          isUsdtEnabled
        }
      })
    } else {
      settings = await prisma.paymentSettings.create({
        data: {
          paypalEmail,
          isPaypalEnabled,
          payoneerDetails,
          isPayoneerEnabled,
          wiseDetails,
          isWiseEnabled,
          btcAddress,
          isBtcEnabled,
          binancePayId,
          isBinanceEnabled,
          usdtAddress,
          isUsdtEnabled
        }
      })
    }
    
    revalidatePath('/admin')
    revalidatePath('/checkout')
    return { success: true, data: settings }
  } catch (error) {
    console.error('Failed to update payment settings:', error)
    return { success: false, error: 'Failed to update payment settings' }
  }
}
