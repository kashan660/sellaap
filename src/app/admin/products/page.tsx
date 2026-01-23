'use client';

import { useState, useEffect } from 'react';
import { createProduct, updateProduct, deleteProduct, getProductsAction, getCategories } from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Save, X, Search } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import { Product, Category, ProductRegion } from '@prisma/client';

type ProductWithRelations = Product & {
  category: Category | null;
  regionalAvailability: ProductRegion[];
};

const REGIONS = ['uk', 'us', 'canada', 'europe', 'australia'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    currency: 'USD',
    categoryId: '0',
    image: '',
    fallbackImage: '/placeholder.png',
    features: '[]',
    isFeatured: false,
    regionalAvailability: REGIONS.map(r => ({
      region: r,
      available: true,
      price: '',
      currency: ''
    }))
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProductsAction(),
        getCategories()
      ]);
      setProducts(productsData as ProductWithRelations[]);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('currency', formData.currency);
    if (formData.categoryId) {
      data.append('categoryId', formData.categoryId);
    }
    if (formData.image) data.append('image', formData.image);
    data.append('fallbackImage', formData.fallbackImage);
    data.append('features', formData.features);
    data.append('isFeatured', String(formData.isFeatured));
    
    const regionalAvailability = formData.regionalAvailability
      .filter(r => r.available)
      .map(r => ({
        region: r.region,
        available: true,
        price: r.price || null,
        currency: r.currency || null
      }));
    
    data.append('regionalAvailability', JSON.stringify(regionalAvailability));

    try {
      if (editingProduct) {
        const result = await updateProduct(editingProduct.id, data);
        if (result.success) {
          setIsDialogOpen(false);
          setEditingProduct(null);
          loadData();
        }
      } else {
        const result = await createProduct(data);
        if (result.success) {
          setIsDialogOpen(false);
          resetForm();
          loadData();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: ProductWithRelations) => {
    setEditingProduct(product);
    
    const mergedRegions = REGIONS.map(region => {
      const existing = product.regionalAvailability.find(r => r.region === region);
      return {
        region,
        available: existing ? existing.available : false, // Default to false if not found when editing? Or true? Let's say false if explicit record missing, but getProducts logic was different. 
        // Actually, if record is missing, getProducts hides it. So false is correct.
        price: existing?.price?.toString() || '',
        currency: existing?.currency || ''
      };
    });

    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      currency: product.currency,
      categoryId: product.categoryId?.toString() || '0',
      image: product.image || '',
      fallbackImage: product.fallbackImage,
      features: product.features || '[]',
      isFeatured: product.isFeatured || false,
      regionalAvailability: mergedRegions
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(id);
        if (result.success) {
          loadData();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      currency: 'USD',
      categoryId: '0',
      image: '',
      fallbackImage: '/placeholder.png',
      features: '[]',
      isFeatured: false,
      regionalAvailability: REGIONS.map(r => ({
        region: r,
        available: true,
        price: '',
        currency: ''
      }))
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleImageUpload = (image: any) => {
    setFormData(prev => ({ ...prev, image: image.url }));
  };

  const handleRegionChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newRegions = [...prev.regionalAvailability];
      newRegions[index] = { ...newRegions[index], [field]: value };
      return { ...prev, regionalAvailability: newRegions };
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingProduct(null); resetForm(); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update the product details below.' : 'Fill in the product details below.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          name,
                          slug: prev.slug || generateSlug(name)
                        }));
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="mb-4">
                    {formData.image && (
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border">
                        <Image 
                          src={formData.image} 
                          alt="Preview" 
                          fill 
                          className="object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <ImageUpload onImageUpload={handleImageUpload} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Feature this product (Show on Homepage)
                    </label>
                </div>

                {/* Regional Availability Section */}
                <div>
                  <label className="block text-sm font-medium mb-4">Regional Availability</label>
                  <div className="space-y-4 border rounded-md p-4">
                    {formData.regionalAvailability.map((region, index) => (
                      <div key={region.region} className="flex items-center gap-4 p-2 hover:bg-muted/50 rounded-md">
                        <div className="w-32 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={region.available}
                            onChange={(e) => handleRegionChange(index, 'available', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium uppercase">{region.region}</span>
                        </div>
                        
                        {region.available && (
                          <div className="flex gap-2 flex-1">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Override Price"
                              value={region.price}
                              onChange={(e) => handleRegionChange(index, 'price', e.target.value)}
                              className="h-8 text-sm"
                            />
                            <Input
                              type="text"
                              placeholder="Currency"
                              value={region.currency}
                              onChange={(e) => handleRegionChange(index, 'currency', e.target.value)}
                              className="h-8 w-24 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingProduct ? 'Update' : 'Create'} Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border">
                    <Image 
                      src={product.image || product.fallbackImage} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{product.currency} {product.price}</span>
                      {product.category && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {product.category.name}
                        </span>
                      )}
                      <span>/{product.slug}</span>
                    </div>
                    {/* Show active regions */}
                    <div className="flex gap-1 mt-2">
                        {product.regionalAvailability.filter(r => r.available).map(r => (
                            <span key={r.region} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded border">
                                {r.region.toUpperCase()}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2">{product.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found. Create your first product to get started.</p>
        </div>
      )}
    </div>
  );
}