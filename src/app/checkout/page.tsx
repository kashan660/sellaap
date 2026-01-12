'use client';

import { useCart } from "@/context/CartContext";
import { Price } from "@/components/Price";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPaymentSettings } from "@/lib/admin-actions-payment";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/actions/order";
import { CreditCard, Banknote } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const arePaymentsEnabled = paymentSettings && (
    paymentSettings.isPaypalEnabled || 
    paymentSettings.isPayoneerEnabled || 
    paymentSettings.isWiseEnabled ||
    paymentSettings.isBtcEnabled ||
    paymentSettings.isBinanceEnabled ||
    paymentSettings.isUsdtEnabled
  );

  useEffect(() => {
    getPaymentSettings().then(res => {
        if(res.success) setPaymentSettings(res.data);
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => router.push('/products')} className="text-primary hover:underline">
          Go to Products
        </button>
      </div>
    );
  }

  async function handleCheckout() {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }

    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const result = await createOrder(items, cartTotal, selectedMethod);
      if (result.success) {
        clearCart();
        router.push('/profile'); // Or success page
      } else {
        alert("Checkout failed");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-card border rounded-lg p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                </div>
                <div>
                  <Price amount={item.price * item.quantity} baseCurrency={item.currency} />
                </div>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <Price amount={cartTotal} baseCurrency="USD" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="bg-card border rounded-lg p-6 space-y-6">
             {paymentSettings && !arePaymentsEnabled && (
                 <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
                     Payment system is currently disabled by administrator.
                 </div>
             )}

             {arePaymentsEnabled && (
                 <div className="space-y-4">
                     <p className="text-sm text-muted-foreground mb-2">Select a payment method:</p>
                     
                     {paymentSettings.isPaypalEnabled && paymentSettings.paypalEmail && (
                         <div 
                             onClick={() => setSelectedMethod('PAYPAL')}
                             className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'PAYPAL' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                         >
                             <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold flex items-center gap-2"><CreditCard size={18} /> PayPal</span>
                                 <input type="radio" checked={selectedMethod === 'PAYPAL'} onChange={() => setSelectedMethod('PAYPAL')} className="accent-primary" />
                             </div>
                             <p className="text-sm text-muted-foreground">Pay via PayPal to: <span className="font-medium text-foreground">{paymentSettings.paypalEmail}</span></p>
                         </div>
                     )}

                     {paymentSettings.isPayoneerEnabled && paymentSettings.payoneerDetails && (
                         <div 
                             onClick={() => setSelectedMethod('PAYONEER')}
                             className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'PAYONEER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                         >
                             <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold flex items-center gap-2"><CreditCard size={18} /> Payoneer</span>
                                 <input type="radio" checked={selectedMethod === 'PAYONEER'} onChange={() => setSelectedMethod('PAYONEER')} className="accent-primary" />
                             </div>
                             <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-2 rounded mt-2 font-mono text-xs">
                                 {paymentSettings.payoneerDetails}
                             </div>
                         </div>
                     )}

                     {paymentSettings.isWiseEnabled && paymentSettings.wiseDetails && (
                         <div 
                             onClick={() => setSelectedMethod('WISE')}
                             className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'WISE' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                         >
                             <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold flex items-center gap-2"><Banknote size={18} /> Wise / Bank Transfer</span>
                                 <input type="radio" checked={selectedMethod === 'WISE'} onChange={() => setSelectedMethod('WISE')} className="accent-primary" />
                             </div>
                             <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-2 rounded mt-2 font-mono text-xs">
                                 {paymentSettings.wiseDetails}
                             </div>
                         </div>
                     )}

                     {paymentSettings.isBtcEnabled && paymentSettings.btcAddress && (
                         <div 
                             onClick={() => setSelectedMethod('BTC')}
                             className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'BTC' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                         >
                             <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold flex items-center gap-2"><CreditCard size={18} /> Bitcoin (BTC)</span>
                                 <input type="radio" checked={selectedMethod === 'BTC'} onChange={() => setSelectedMethod('BTC')} className="accent-primary" />
                             </div>
                             <p className="text-sm text-muted-foreground mb-1">Send BTC to this wallet address:</p>
                             <div className="text-sm font-mono bg-muted p-2 rounded text-xs break-all select-all">
                                 {paymentSettings.btcAddress}
                             </div>
                         </div>
                     )}

                     {paymentSettings.isBinanceEnabled && paymentSettings.binancePayId && (
                         <div 
                             onClick={() => setSelectedMethod('BINANCE')}
                             className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'BINANCE' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                         >
                             <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold flex items-center gap-2"><CreditCard size={18} /> Binance Pay</span>
                                 <input type="radio" checked={selectedMethod === 'BINANCE'} onChange={() => setSelectedMethod('BINANCE')} className="accent-primary" />
                             </div>
                             <p className="text-sm text-muted-foreground mb-1">Pay to Binance ID / Email:</p>
                             <div className="text-sm font-mono bg-muted p-2 rounded text-xs select-all">
                                 {paymentSettings.binancePayId}
                             </div>
                         </div>
                     )}

                     {paymentSettings.isUsdtEnabled && paymentSettings.usdtAddress && (
                         <div 
                             onClick={() => setSelectedMethod('USDT')}
                             className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'USDT' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                         >
                             <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold flex items-center gap-2"><CreditCard size={18} /> USDT (Tether)</span>
                                 <input type="radio" checked={selectedMethod === 'USDT'} onChange={() => setSelectedMethod('USDT')} className="accent-primary" />
                             </div>
                             <p className="text-sm text-muted-foreground mb-1">Send USDT to this address:</p>
                             <div className="text-sm font-mono bg-muted p-2 rounded text-xs break-all select-all">
                                 {paymentSettings.usdtAddress}
                             </div>
                         </div>
                     )}
                 </div>
             )}

             <button
               onClick={handleCheckout}
               disabled={loading || !arePaymentsEnabled || !selectedMethod}
               className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 font-bold mt-4"
             >
               {loading ? "Processing..." : "Place Order"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
