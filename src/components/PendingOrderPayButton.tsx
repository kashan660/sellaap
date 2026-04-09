'use client';

import { useState } from 'react';
import { createPaddleCheckout } from '@/lib/actions/order';

interface PendingOrderPayButtonProps {
  orderId: number;
  paymentMethod?: string | null;
  status: string;
}

export function PendingOrderPayButton({ orderId, paymentMethod, status }: PendingOrderPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const canPay =
    status?.toUpperCase() === 'PENDING' &&
    (!paymentMethod || paymentMethod.toLowerCase() === 'paddle');

  if (!canPay) return null;

  async function handlePayNow() {
    setLoading(true);
    try {
      const result = await createPaddleCheckout(orderId);
      if (!result.success || !result.checkoutUrl) {
        alert(result.error || 'Could not initialize Paddle checkout.');
        return;
      }
      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error(error);
      alert('Could not initialize Paddle checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayNow}
      disabled={loading}
      className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      {loading ? 'Opening Checkout...' : 'Pay Now'}
    </button>
  );
}
