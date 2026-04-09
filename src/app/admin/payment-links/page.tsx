'use client';

import { useEffect, useMemo, useState } from 'react';
import { getProductsAction } from '@/lib/actions/products';
import { createDirectPaddlePaymentLink } from '@/lib/actions/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Copy, Loader2 } from 'lucide-react';

type AdminProduct = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminPaymentLinksPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [customerEmail, setCustomerEmail] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProductsAction();
        setProducts(res as AdminProduct[]);
      } catch (error) {
        setMessage('Failed to load products. Please refresh.');
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id.toString() === selectedProductId),
    [products, selectedProductId]
  );

  async function handleGenerate() {
    setMessage('');
    setGeneratedLink('');

    if (!selectedProductId) {
      setMessage('Please select a product.');
      return;
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      setMessage('Quantity must be a positive whole number.');
      return;
    }

    const email = customerEmail.trim();
    if (!email) {
      setMessage('Customer email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid customer email.');
      return;
    }

    setGenerating(true);
    try {
      const result = await createDirectPaddlePaymentLink({
        productId: Number(selectedProductId),
        quantity: qty,
        customerEmail: email,
      });

      if (!result.success || !result.checkoutUrl) {
        setMessage(result.error || 'Failed to generate payment link.');
        return;
      }

      setGeneratedLink(result.checkoutUrl);
      setMessage('Payment link generated successfully.');
    } catch (error) {
      setMessage('Unexpected error while generating payment link.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setMessage('Copied payment link to clipboard.');
    } catch {
      setMessage('Could not copy automatically. Please copy manually.');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Direct Payment Links</h1>
        <p className="text-muted-foreground mt-1">
          Generate a Paddle checkout URL and share it directly with your buyer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Create New Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            {loadingProducts ? (
              <div className="text-sm text-muted-foreground">Loading products...</div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id.toString()}>
                    {product.name} ({product.slug}) [ID: {product.id}]
                  </option>
                ))}
              </select>
            )}
            {!loadingProducts && products.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                No products found. Create products in Admin Products first.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Tip: If link generation fails, sync the product in Admin &gt; Products first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <Input
                type="number"
                min={1}
                max={100}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Customer Email *</label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="buyer@example.com"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || loadingProducts || products.length === 0}
          >
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Generate Payment Link
          </Button>

          {selectedProduct && (
            <p className="text-xs text-muted-foreground">
              Selected: <span className="font-medium">{selectedProduct.name}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={generatedLink} readOnly placeholder="Your Paddle checkout link will appear here" />
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCopy} disabled={!generatedLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            {generatedLink && (
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Open Link
              </a>
            )}
          </div>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
