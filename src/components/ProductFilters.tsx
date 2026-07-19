'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { Category } from '@prisma/client';

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [categorySlug, setCategorySlug] = useState(searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  function applyFilters(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (categorySlug && categorySlug !== 'all') params.set('category', categorySlug);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  }

  function clearFilters() {
    setQ('');
    setCategorySlug('all');
    setMinPrice('');
    setMaxPrice('');
    router.push('/products');
  }

  const hasActiveFilters = q || (categorySlug && categorySlug !== 'all') || minPrice || maxPrice;

  return (
    <form onSubmit={applyFilters} className="flex flex-col md:flex-row gap-3 items-stretch md:items-end mb-10">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="w-full md:w-48">
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select value={categorySlug} onValueChange={setCategorySlug}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-28">
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <Input type="number" min="0" step="0.01" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
      </div>

      <div className="w-full md:w-28">
        <label className="block text-sm font-medium mb-1">Max Price</label>
        <Input type="number" min="0" step="0.01" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <Button type="submit">Apply</Button>
        {hasActiveFilters && (
          <Button type="button" variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}
