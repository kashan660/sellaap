'use client';

import { useCart } from "@/context/CartContext";
import { Price } from "@/components/Price";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPaymentSettings } from "@/lib/admin-actions-payment";
import { useEffect, useState } from "react";
import { createOrder, createPaddleCheckout } from "@/lib/actions/order";
import { CreditCard, Banknote, Minus, Plus, Trash2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart, removeItem, updateQuantity } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const requiresShipping = items.some((item) => item.sourceType === 'CJ');
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  const manualPaymentsEnabled = !!paymentSettings && (
    paymentSettings.isPaypalEnabled || 
    paymentSettings.isPayoneerEnabled || 
    paymentSettings.isWiseEnabled ||
    paymentSettings.isBtcEnabled ||
    paymentSettings.isBinanceEnabled ||
    paymentSettings.isUsdtEnabled
  );
  const arePaymentsEnabled = true;

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

    if (requiresShipping && (!shipping.name || !shipping.phone || !shipping.address1 || !shipping.city || !shipping.postalCode)) {
      alert("Please fill in your shipping address (this order contains a physical product)");
      return;
    }

    setLoading(true);
    try {
      const result = await createOrder(items, cartTotal, selectedMethod, requiresShipping ? shipping : undefined);
      if (result.success) {
        if (selectedMethod === 'PADDLE') {
          const paddleResult = await createPaddleCheckout(result.orderId);
          if (!paddleResult.success || !paddleResult.checkoutUrl) {
            alert(paddleResult.error || "Failed to initialize Paddle checkout");
            return;
          }
          clearCart();
          router.push(paddleResult.checkoutUrl);
          return;
        }

        clearCart();
        router.push('/profile'); // Or success page
      } else {
        alert(result.error || "Checkout failed");
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
                  <div className="flex items-center gap-2 border rounded-md">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-muted"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
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

        <div className="space-y-8">
          {requiresShipping && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address (US only)</h2>
              <div className="bg-card border rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="border rounded-md px-3 py-2 sm:col-span-2"
                  placeholder="Full name"
                  value={shipping.name}
                  onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2 sm:col-span-2"
                  placeholder="Phone number"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2 sm:col-span-2"
                  placeholder="Address line 1"
                  value={shipping.address1}
                  onChange={(e) => setShipping((s) => ({ ...s, address1: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2 sm:col-span-2"
                  placeholder="Address line 2 (optional)"
                  value={shipping.address2}
                  onChange={(e) => setShipping((s) => ({ ...s, address2: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="State"
                  value={shipping.state}
                  onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="ZIP / Postal code"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                />
                <input
                  className="border rounded-md px-3 py-2 bg-muted"
                  value="United States"
                  disabled
                />
              </div>
            </div>
          )}

          <div>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="bg-card border rounded-lg p-6 space-y-6">
             {paymentSettings && !manualPaymentsEnabled && (
                 <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
                     Manual payment methods are disabled by administrator. You can still use Paddle.
                 </div>
             )}

             {arePaymentsEnabled && (
                 <div className="space-y-4">
                     <p className="text-sm text-muted-foreground mb-2">Select a payment method:</p>

                     <div 
                         onClick={() => setSelectedMethod('PADDLE')}
                         className={`border rounded-md p-4 cursor-pointer transition-all ${selectedMethod === 'PADDLE' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                     >
                         <div className="flex items-center justify-between mb-2">
                             <span className="font-semibold flex items-center gap-2"><CreditCard size={18} /> Paddle</span>
                             <input type="radio" checked={selectedMethod === 'PADDLE'} onChange={() => setSelectedMethod('PADDLE')} className="accent-primary" />
                         </div>
                         <p className="text-sm text-muted-foreground">Secure card checkout powered by Paddle.</p>
                     </div>
                     
                     {paymentSettings?.isPaypalEnabled && paymentSettings?.paypalEmail && (
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

                     {paymentSettings?.isPayoneerEnabled && paymentSettings?.payoneerDetails && (
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

                     {paymentSettings?.isWiseEnabled && paymentSettings?.wiseDetails && (
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

                     {paymentSettings?.isBtcEnabled && paymentSettings?.btcAddress && (
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

                     {paymentSettings?.isBinanceEnabled && paymentSettings?.binancePayId && (
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

                     {paymentSettings?.isUsdtEnabled && paymentSettings?.usdtAddress && (
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
    </div>
  );
}
