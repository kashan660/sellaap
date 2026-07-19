'use client';

import { useState, useEffect } from 'react';
import {
  getDropshipSettings,
  updateDropshipSettings,
  searchCjCatalog,
  getCjProductVariants,
  importCjProduct,
} from '@/lib/actions/cj';
import { getCategoryTree } from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Download } from 'lucide-react';
import Image from 'next/image';
import type { CjCatalogProduct, CjVariant } from '@/lib/cj/catalog';

interface CategoryNode {
  id: number;
  name: string;
  children: { id: number; name: string }[];
}

export default function DropshipPage() {
  const [markupPercent, setMarkupPercent] = useState(30);
  const [autoFulfill, setAutoFulfill] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const selectedCategory = categoryTree.find((c) => c.id.toString() === categoryId);
  const effectiveCategoryId = subcategoryId || categoryId;

  const [keyword, setKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<CjCatalogProduct[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [openPid, setOpenPid] = useState<string | null>(null);
  const [variants, setVariants] = useState<CjVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [importingVid, setImportingVid] = useState<string | null>(null);

  useEffect(() => {
    getDropshipSettings().then((settings) => {
      setMarkupPercent(settings.markupPercent);
      setAutoFulfill(settings.autoFulfill);
    });
    getCategoryTree().then(setCategoryTree);
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateDropshipSettings({ markupPercent, autoFulfill });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    setSearchError(null);
    setOpenPid(null);
    try {
      const result = await searchCjCatalog(keyword);
      if (result.success) {
        setResults(result.products || []);
      } else {
        setSearchError(result.error || 'Search failed');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleViewVariants = async (pid: string) => {
    if (openPid === pid) {
      setOpenPid(null);
      return;
    }
    setOpenPid(pid);
    setLoadingVariants(true);
    setVariants([]);
    try {
      const result = await getCjProductVariants(pid);
      if (result.success) setVariants(result.variants || []);
    } finally {
      setLoadingVariants(false);
    }
  };

  // Direct "Import" on the product row - single-variant products (the common
  // case) import immediately; multi-variant products expand so you can pick.
  const handleQuickImport = async (product: CjCatalogProduct) => {
    if (!effectiveCategoryId) {
      alert('Please select a category before importing.');
      return;
    }
    setImportingVid(product.pid);
    try {
      const result = await getCjProductVariants(product.pid);
      if (!result.success) {
        alert(result.error || 'Failed to load product variants');
        return;
      }
      const found = result.variants || [];
      if (found.length === 1) {
        await handleImport(product.pid, found[0].vid);
      } else {
        setOpenPid(product.pid);
        setVariants(found);
      }
    } finally {
      setImportingVid(null);
    }
  };

  const handleImport = async (pid: string, vid: string) => {
    if (!effectiveCategoryId) {
      alert('Please select a category before importing.');
      return;
    }
    setImportingVid(vid);
    try {
      const result = await importCjProduct({
        pid,
        vid,
        categoryId: parseInt(effectiveCategoryId),
      });
      if (result.success) {
        alert('Product imported. It now appears in Admin > Products.');
      } else {
        alert(result.error || 'Failed to import product');
      }
    } finally {
      setImportingVid(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CJ Dropshipping</h1>
        <p className="text-muted-foreground mt-1">Import products from CJ Dropshipping and manage fulfillment settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium w-48">Markup over CJ cost (%)</label>
            <Input
              type="number"
              className="w-32"
              value={markupPercent}
              onChange={(e) => setMarkupPercent(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium w-48">Auto-submit paid orders to CJ</label>
            <Switch checked={autoFulfill} onCheckedChange={setAutoFulfill} />
          </div>
          <p className="text-xs text-muted-foreground">
            Leave off until you have manually tested &ldquo;Retry CJ fulfillment&rdquo; on a real order in Admin &gt; Orders -
            CJ&apos;s order-creation request shape hasn&apos;t been verified against a live order yet.
          </p>
          <Button onClick={handleSaveSettings} disabled={savingSettings}>
            {savingSettings ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search CJ Dropshipping catalog (e.g. phone case)"
                className="pl-8"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setSubcategoryId(''); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category *" />
              </SelectTrigger>
              <SelectContent>
                {categoryTree.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && selectedCategory.children.length > 0 && (
              <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Subcategory (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory.children.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>

          {!effectiveCategoryId && (
            <p className="text-sm text-amber-600">Select a category above before importing any products.</p>
          )}
          {searchError && <p className="text-sm text-red-600">{searchError}</p>}

          <div className="space-y-3">
            {results.map((product) => (
              <div key={product.pid} className="border rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted border shrink-0">
                    {product.image && (
                      <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      SKU {product.sku} · ${product.sellPrice.toFixed(2)} · {product.categoryName || 'Uncategorized'}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleQuickImport(product)}
                    disabled={importingVid === product.pid || !effectiveCategoryId}
                  >
                    {importingVid === product.pid ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Import
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewVariants(product.pid)}>
                    {openPid === product.pid ? 'Hide variants' : 'View variants'}
                  </Button>
                </div>

                {openPid === product.pid && (
                  <div className="border-t bg-muted/30 p-4 space-y-2">
                    {loadingVariants ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : variants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No variants found.</p>
                    ) : (
                      variants.map((variant) => (
                        <div key={variant.vid} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                          <div>
                            <div className="font-medium">{variant.name}</div>
                            <div className="text-muted-foreground">
                              SKU {variant.sku} · ${variant.sellPrice.toFixed(2)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleImport(product.pid, variant.vid)}
                            disabled={importingVid === variant.vid || !effectiveCategoryId}
                          >
                            {importingVid === variant.vid ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4 mr-2" />
                            )}
                            Import
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
