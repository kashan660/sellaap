'use client';

import { useState } from 'react';
import { createCustomGameOrderCheckout } from '@/lib/actions/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function CustomGameOrderPage() {
  const [email, setEmail] = useState('');
  const [budgetUsd, setBudgetUsd] = useState('2000');
  const [projectBrief, setProjectBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const budget = Number(budgetUsd);
    if (!Number.isFinite(budget) || budget < 2000 || budget > 50000) {
      setMessage('Budget must be between USD 2,000 and USD 50,000.');
      return;
    }

    if (projectBrief.trim().length < 20) {
      setMessage('Please add at least 20 characters describing your project.');
      return;
    }

    setLoading(true);
    try {
      const result = await createCustomGameOrderCheckout({
        email,
        budgetUsd: budget,
        projectBrief,
      });

      if (!result.success || !result.checkoutUrl) {
        setMessage(result.error || 'Could not start checkout.');
        return;
      }

      window.location.href = result.checkoutUrl;
    } catch (error) {
      setMessage('Unexpected error while creating checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Custom Exclusive 3D Game Order</h1>
        <p className="text-muted-foreground mt-2">
          Private, fresh-built 3D game project made only for you. Never published on any marketplace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start Secure Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                We use this email to deliver source code updates and ownership documents.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget (USD) *</label>
              <Input
                type="number"
                min={2000}
                max={50000}
                step={100}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Allowed range: $2,000 to $50,000.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Brief *</label>
              <Textarea
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                rows={6}
                placeholder="Describe genre, features (multiplayer/chat/in-app), timeline, platform, and priorities..."
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Continue to Secure Card Checkout
            </Button>

            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
