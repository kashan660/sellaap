import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ConversionData {
  programName: string;
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{
    productId: string;
    productName: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  customerEmail?: string;
  customData?: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const data: ConversionData = await request.json();

    // Validate required fields
    if (!data.programName || !data.orderId || !data.amount) {
      return NextResponse.json(
        { error: 'Missing required fields: programName, orderId, amount' },
        { status: 400 }
      );
    }

    // Log conversion to database for reporting
    // Optional: create an AffiliateConversion model in Prisma if you want persistent tracking
    console.log('Affiliate conversion tracked:', {
      timestamp: new Date(),
      ...data,
    });

    // Send to Impact API if configured
    if (process.env.IMPACT_API_KEY && data.programName === 'impact') {
      try {
        await fetch('https://api.impact.com/conversions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.IMPACT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId: data.orderId,
            amount: data.amount,
            currency: data.currency,
            items: data.items,
            customerEmail: data.customerEmail,
          }),
        });
      } catch (error) {
        console.error('Failed to send Impact conversion:', error);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Conversion tracked' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}
