'use client';

import { useState, useEffect } from 'react';
import { Product, Post, Category } from '@prisma/client';
import { updateProductImage, updatePostImage } from '@/lib/actions';
import { 
    createCategory, 
    updateCategory,
    deleteCategory, 
    createProduct, 
    deleteProduct, 
    updateProduct,
    createPost,
    updatePost,
    deletePost
} from '@/lib/admin-actions';
import { ImageUploader } from './ImageUploader';
import { Package, FileText, Layers, Plus, Trash2, Edit2, X, Save, CreditCard, Search, Globe } from 'lucide-react';
import { getPaymentSettings, updatePaymentSettings } from '@/lib/admin-actions-payment';
import { getSeoSettings, updateSeoSettings, getAllPagesSeo, updatePageSeo, deletePageSeo } from '@/lib/actions/seo';

interface AdminDashboardProps {
  products: (Product & { category: Category | null })[];
  posts: Post[];
  categories: Category[];
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                active 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
            {children}
        </button>
    );
}

export default function AdminDashboard({ products: initialProducts, posts: initialPosts, categories: initialCategories }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'posts' | 'settings' | 'seo'>('products');
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [posts, setPosts] = useState(initialPosts);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [seoSettings, setSeoSettings] = useState<any>(null);
  const [pagesSeo, setPagesSeo] = useState<any[]>([]);

  useEffect(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setPosts(initialPosts);
    // Load payment settings
    getPaymentSettings().then(res => {
        if(res.success) setPaymentSettings(res.data);
    });
    // Load SEO settings
    getSeoSettings().then(res => {
        if(res.success) setSeoSettings(res.data);
    });
    // Load Pages SEO
    getAllPagesSeo().then(res => {
        if(res.success) setPagesSeo(res.data || []);
    });
  }, [initialProducts, initialCategories, initialPosts]);
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPageSeoModalOpen, setIsPageSeoModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<(Product & { category: Category | null }) | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingPageSeo, setEditingPageSeo] = useState<any>(null);
  const [productImageUrl, setProductImageUrl] = useState<string>('');

  const handleProductImageUpdate = async (id: number, url: string) => {
    const result = await updateProductImage(id, url);
    if (result.success && result.data) {
        setProducts(products.map(p => p.id === id ? { ...p, image: url } : p));
    }
  };

  const handlePostImageUpdate = async (id: number, url: string) => {
    const result = await updatePostImage(id, url);
    if (result.success && result.data) {
        setPosts(posts.map(p => p.id === id ? { ...p, imageUrl: url } : p));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 bg-muted p-1 rounded-lg w-fit">
            <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
                <div className="flex items-center gap-2">
                    <Package size={16} />
                    Products
                </div>
            </TabButton>
            <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
                <div className="flex items-center gap-2">
                    <Layers size={16} />
                    Categories
                </div>
            </TabButton>
            <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
                <div className="flex items-center gap-2">
                    <FileText size={16} />
                    Blog Posts
                </div>
            </TabButton>
            <TabButton active={activeTab === 'seo'} onClick={() => setActiveTab('seo')}>
                <div className="flex items-center gap-2">
                    <Search size={16} />
                    SEO
                </div>
            </TabButton>
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    Payment Settings
                </div>
            </TabButton>
        </div>
        
        <div>
            {activeTab === 'products' && (
                <button 
                    onClick={() => { setEditingProduct(null); setProductImageUrl(''); setIsProductModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    <Plus size={16} /> Add Product
                </button>
            )}
            {activeTab === 'categories' && (
                <button 
                    onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    <Plus size={16} /> Add Category
                </button>
            )}
             {activeTab === 'posts' && (
                <button 
                    onClick={() => { setEditingPost(null); setIsPostModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    <Plus size={16} /> Add Post
                </button>
            )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        {activeTab === 'products' && (
            <div className="divide-y divide-border">
                <div className="p-4 bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Product Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-3">Image</div>
                    <div className="col-span-1">Actions</div>
                </div>
                {products.map((product) => (
                    <div key={product.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-muted-foreground">#{product.id}</div>
                        <div className="col-span-3 font-medium">
                            {product.name}
                            <div className="text-xs text-muted-foreground truncate">{product.description}</div>
                        </div>
                        <div className="col-span-2">
                            <span className="bg-secondary px-2 py-1 rounded text-xs">
                                {product.category?.name || 'Uncategorized'}
                            </span>
                        </div>
                        <div className="col-span-2 text-sm font-semibold">
                            {product.currency} {product.price.toFixed(2)}
                        </div>
                        <div className="col-span-3">
                            <ImageUploader 
                                currentImage={product.image || product.fallbackImage} 
                                onUploadComplete={(url) => handleProductImageUpdate(product.id, url)}
                                folder="products"
                            />
                        </div>
                        <div className="col-span-1 flex gap-2">
                            <button 
                                onClick={() => { setEditingProduct(product); setProductImageUrl(product.image || ''); setIsProductModalOpen(true); }}
                                className="p-1 hover:bg-muted rounded text-blue-500"
                                title="Edit Price & Details"
                            >
                                <Edit2 size={16} />
                            </button>
                            <form action={async () => {
                                if(confirm('Are you sure?')) {
                                    const result = await deleteProduct(product.id);
                                    if (result.success) {
                                        setProducts(products.filter(p => p.id !== product.id));
                                    }
                                }
                            }}>
                                <button type="submit" className="p-1 hover:bg-muted rounded text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'categories' && (
            <div className="divide-y divide-border">
                <div className="p-4 bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Slug</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-1">Actions</div>
                </div>
                {categories.map((category) => (
                    <div key={category.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-muted-foreground">#{category.id}</div>
                        <div className="col-span-3 font-medium">{category.name}</div>
                        <div className="col-span-3 text-muted-foreground font-mono text-xs">{category.slug}</div>
                        <div className="col-span-4 text-sm text-muted-foreground">{category.description}</div>
                        <div className="col-span-1 flex gap-2">
                            <button 
                                onClick={() => { setEditingCategory(category); setIsCategoryModalOpen(true); }}
                                className="p-1 hover:bg-muted rounded text-blue-500"
                            >
                                <Edit2 size={16} />
                            </button>
                             <form action={async () => {
                                if(confirm('Are you sure? This might affect linked products.')) {
                                    const result = await deleteCategory(category.id);
                                    if (result.success) {
                                        setCategories(categories.filter(c => c.id !== category.id));
                                    }
                                }
                            }}>
                                <button type="submit" className="p-1 hover:bg-muted rounded text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'posts' && (
            <div className="divide-y divide-border">
                 <div className="p-4 bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Post Title</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-4">Cover Image</div>
                    <div className="col-span-2">Actions</div>
                </div>
                {posts.map((post) => (
                    <div key={post.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-muted-foreground">#{post.id}</div>
                        <div className="col-span-3 font-medium">
                            {post.title}
                            <div className="text-xs text-muted-foreground truncate">{post.excerpt}</div>
                        </div>
                        <div className="col-span-2 text-sm">{post.category}</div>
                        <div className="col-span-4">
                            <ImageUploader 
                                currentImage={post.imageUrl || ''} 
                                onUploadComplete={(url) => handlePostImageUpdate(post.id, url)}
                                folder="blog"
                            />
                        </div>
                        <div className="col-span-2 flex gap-2">
                             <button 
                                onClick={() => { setEditingPost(post); setIsPostModalOpen(true); }}
                                className="p-1 hover:bg-muted rounded text-blue-500"
                            >
                                <Edit2 size={16} />
                            </button>
                            <form action={async () => {
                                if(confirm('Are you sure?')) {
                                    const result = await deletePost(post.id);
                                    if (result.success) {
                                        setPosts(posts.filter(p => p.id !== post.id));
                                    }
                                }
                            }}>
                                <button type="submit" className="p-1 hover:bg-muted rounded text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={() => { setIsProductModalOpen(false); setProductImageUrl(''); }}><X size={24} /></button>
                </div>
                <form action={async (formData) => {
                    if (editingProduct) {
                        const result = await updateProduct(editingProduct.id, formData);
                        if (result.success && result.data) {
                            // Optimistic update
                            setProducts(prev => prev.map(p => p.id === editingProduct.id ? result.data as any : p));
                        }
                    } else {
                        const result = await createProduct(formData);
                         if (result.success && result.data) {
                            setProducts(prev => [...prev, result.data as any]);
                        }
                    }
                    setIsProductModalOpen(false);
                    setProductImageUrl('');
                }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input name="name" defaultValue={editingProduct?.name} required className="w-full p-2 border rounded-md bg-background" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (USD)</label>
                            <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full p-2 border rounded-md bg-background" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select name="categoryId" defaultValue={editingProduct?.categoryId || ""} className="w-full p-2 border rounded-md bg-background">
                            <option value="">Select Category...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" defaultValue={editingProduct?.description} rows={3} required className="w-full p-2 border rounded-md bg-background" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Features (JSON or plain text)</label>
                        <textarea 
                            name="features" 
                            defaultValue={editingProduct?.features || '["Instant Delivery", "24/7 Support"]'} 
                            rows={3} 
                            className="w-full p-2 border rounded-md bg-background font-mono text-sm" 
                            placeholder='["Feature 1", "Feature 2"]'
                        />
                        <p className="text-xs text-muted-foreground">Format as a JSON array of strings for best results.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Image (Optional)</label>
                        <ImageUploader 
                            currentImage={editingProduct?.image || productImageUrl || "https://placehold.co/600x400?text=No+Image"}
                            onUploadComplete={(url) => setProductImageUrl(url)}
                            folder="products"
                        />
                        <p className="text-xs text-muted-foreground">Upload a product image or leave as default placeholder.</p>
                    </div>

                    <input type="hidden" name="image" value={productImageUrl} />

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-2">SEO Settings</h3>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Title</label>
                                <input name="metaTitle" className="w-full p-2 border rounded-md bg-background" placeholder="SEO Title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Description</label>
                                <textarea name="metaDescription" rows={2} className="w-full p-2 border rounded-md bg-background" placeholder="SEO Description" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Keywords</label>
                                <input name="metaKeywords" className="w-full p-2 border rounded-md bg-background" placeholder="keyword1, keyword2, keyword3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
                            <Save size={16} /> Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-background rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                    <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}><X size={24} /></button>
                </div>
                <form action={async (formData) => {
                    if (editingCategory) {
                        const result = await updateCategory(editingCategory.id, formData);
                        if (result.success && result.data) {
                            setCategories(categories.map(c => c.id === editingCategory.id ? result.data as any : c));
                        }
                    } else {
                        const result = await createCategory(formData);
                        if (result.success && result.data) {
                            setCategories(prev => [...prev, result.data as any]);
                        }
                    }
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                }} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input name="name" required className="w-full p-2 border rounded-md bg-background" defaultValue={editingCategory?.name || ''} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" rows={3} className="w-full p-2 border rounded-md bg-background" defaultValue={editingCategory?.description || ''} />
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-2">SEO Settings</h3>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Title</label>
                                <input name="metaTitle" className="w-full p-2 border rounded-md bg-background" placeholder="SEO Title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Description</label>
                                <textarea name="metaDescription" rows={2} className="w-full p-2 border rounded-md bg-background" placeholder="SEO Description" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Keywords</label>
                                <input name="metaKeywords" className="w-full p-2 border rounded-md bg-background" placeholder="keyword1, keyword2, keyword3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
                            <Save size={16} /> Save Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
                    <button onClick={() => setIsPostModalOpen(false)}><X size={24} /></button>
                </div>
                <form action={async (formData) => {
                    if (editingPost) {
                        const result = await updatePost(editingPost.id, formData);
                        if (result.success && result.data) {
                            setPosts(prev => prev.map(p => p.id === editingPost.id ? result.data as any : p));
                        }
                    } else {
                        const result = await createPost(formData);
                        if (result.success && result.data) {
                            setPosts(prev => [...prev, result.data as any]);
                        }
                    }
                    setIsPostModalOpen(false);
                }} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input name="title" defaultValue={editingPost?.title} required className="w-full p-2 border rounded-md bg-background" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <input name="category" defaultValue={editingPost?.category} required className="w-full p-2 border rounded-md bg-background" placeholder="e.g. Guides" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Keywords</label>
                            <input name="keywords" defaultValue={editingPost?.keywords} className="w-full p-2 border rounded-md bg-background" placeholder="Comma separated" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Excerpt</label>
                        <textarea name="excerpt" defaultValue={editingPost?.excerpt} rows={2} required className="w-full p-2 border rounded-md bg-background" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content (HTML supported)</label>
                        <textarea name="content" defaultValue={editingPost?.content} rows={10} required className="w-full p-2 border rounded-md bg-background font-mono text-sm" />
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold mb-2">SEO Settings</h3>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Title</label>
                                <input name="metaTitle" defaultValue={editingPost?.metaTitle || ''} className="w-full p-2 border rounded-md bg-background" placeholder="SEO Title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Description</label>
                                <textarea name="metaDescription" defaultValue={editingPost?.metaDescription || ''} rows={2} className="w-full p-2 border rounded-md bg-background" placeholder="SEO Description" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Keywords</label>
                                <input name="keywords" defaultValue={editingPost?.keywords || ''} className="w-full p-2 border rounded-md bg-background" placeholder="keyword1, keyword2, keyword3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
                            <Save size={16} /> Save Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {activeTab === 'seo' && (
            <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold mb-6">SEO Configuration</h2>
                <form action={async (formData) => {
                    const res = await updateSeoSettings(formData);
                    if (res.success) {
                        alert('SEO settings updated successfully');
                        // Reload settings
                        const settings = await getSeoSettings();
                        if(settings.success) setSeoSettings(settings.data);
                    } else {
                        alert('Failed to update SEO settings');
                    }
                }} className="space-y-4 max-w-2xl">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Title Template</label>
                            <input 
                                name="siteTitle" 
                                defaultValue={seoSettings?.siteTitle || 'Sellaap - Premium Digital Goods'} 
                                className="w-full px-3 py-2 border rounded-md bg-background"
                                placeholder="e.g., Sellaap - %s"
                            />
                            <p className="text-xs text-muted-foreground">Default title for the homepage.</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Twitter Handle</label>
                            <input 
                                name="twitterHandle" 
                                defaultValue={seoSettings?.twitterHandle || ''} 
                                className="w-full px-3 py-2 border rounded-md bg-background"
                                placeholder="@sellaap"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Meta Description</label>
                        <textarea 
                            name="siteDescription" 
                            defaultValue={seoSettings?.siteDescription || ''} 
                            className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                            placeholder="Default site description for search engines..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Default Keywords</label>
                        <input 
                            name="defaultKeywords" 
                            defaultValue={seoSettings?.defaultKeywords || ''} 
                            className="w-full px-3 py-2 border rounded-md bg-background"
                            placeholder="Comma separated keywords..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">OG Image URL</label>
                        <input 
                            name="ogImage" 
                            defaultValue={seoSettings?.ogImage || ''} 
                            className="w-full px-3 py-2 border rounded-md bg-background"
                            placeholder="https://example.com/og-image.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Google Verification Code</label>
                            <input 
                                name="googleVerification" 
                                defaultValue={seoSettings?.googleVerification || ''} 
                                className="w-full px-3 py-2 border rounded-md bg-background"
                                placeholder="google-site-verification=..."
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bing Verification Code</label>
                            <input 
                                name="bingVerification" 
                                defaultValue={seoSettings?.bingVerification || ''} 
                                className="w-full px-3 py-2 border rounded-md bg-background"
                                placeholder="Bing verification code"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
                            <Save size={16} />
                            Save SEO Settings
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Pages SEO Management</h2>
                        <button 
                            onClick={() => { setEditingPageSeo(null); setIsPageSeoModalOpen(true); }}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                        >
                            <Plus size={16} /> Add Page SEO
                        </button>
                    </div>

                    <div className="divide-y divide-border border rounded-md">
                        <div className="p-4 bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm">
                            <div className="col-span-3">Path</div>
                            <div className="col-span-3">Page Name (Title)</div>
                            <div className="col-span-4">Description</div>
                            <div className="col-span-2">Actions</div>
                        </div>
                        {pagesSeo.map((page) => (
                            <div key={page.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">{page.path}</div>
                                <div className="col-span-3 font-medium">{page.title || '-'}</div>
                                <div className="col-span-4 text-sm text-muted-foreground truncate">{page.description || '-'}</div>
                                <div className="col-span-2 flex gap-2">
                                    <button 
                                        onClick={() => { setEditingPageSeo(page); setIsPageSeoModalOpen(true); }}
                                        className="p-1 hover:bg-muted rounded text-blue-500"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <form action={async () => {
                                        if(confirm('Are you sure you want to delete SEO settings for this page?')) {
                                            const result = await deletePageSeo(page.path);
                                            if (result.success) {
                                                setPagesSeo(pagesSeo.filter(p => p.path !== page.path));
                                            }
                                        }
                                    }}>
                                        <button type="submit" className="p-1 hover:bg-muted rounded text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                        {pagesSeo.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No page-specific SEO settings found. Add one to override global defaults.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
        <div className="bg-card rounded-lg shadow-sm border p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Payment Configuration</h2>
            <form action={async (formData) => {
                const result = await updatePaymentSettings(formData);
                if (result.success && result.data) {
                    setPaymentSettings(result.data);
                    alert('Payment settings updated successfully!');
                }
            }} className="space-y-6">
                
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> PayPal
                        </h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isPaypalEnabled" 
                                defaultChecked={paymentSettings?.isPaypalEnabled ?? false}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-muted-foreground">Enable</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">PayPal Email / Business ID</label>
                        <input 
                            name="paypalEmail" 
                            defaultValue={paymentSettings?.paypalEmail || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> Payoneer
                        </h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isPayoneerEnabled" 
                                defaultChecked={paymentSettings?.isPayoneerEnabled ?? false}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-muted-foreground">Enable</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Payoneer Account Details</label>
                        <textarea 
                            name="payoneerDetails" 
                            defaultValue={paymentSettings?.payoneerDetails || ''}
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Account Holder: ...&#10;Account Number: ...&#10;Sort Code: ..."
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> Wise
                        </h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isWiseEnabled" 
                                defaultChecked={paymentSettings?.isWiseEnabled ?? false}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-muted-foreground">Enable</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Wise Account Details</label>
                        <textarea 
                            name="wiseDetails" 
                            defaultValue={paymentSettings?.wiseDetails || ''}
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Bank Name: Wise&#10;Account Number: ...&#10;Routing Number: ..."
                        />
                        <p className="text-xs text-muted-foreground">Enter bank transfer details visible to customers.</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> Bitcoin (BTC)
                        </h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isBtcEnabled" 
                                defaultChecked={paymentSettings?.isBtcEnabled ?? false}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-muted-foreground">Enable</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">BTC Wallet Address</label>
                        <input 
                            name="btcAddress" 
                            defaultValue={paymentSettings?.btcAddress || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="bc1q..."
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> Binance Pay
                        </h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isBinanceEnabled" 
                                defaultChecked={paymentSettings?.isBinanceEnabled ?? false}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-muted-foreground">Enable</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Binance Pay ID / Email</label>
                        <input 
                            name="binancePayId" 
                            defaultValue={paymentSettings?.binancePayId || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="123456789 or user@binance.com"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard size={18} /> USDT (Tether)
                        </h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                name="isUsdtEnabled" 
                                defaultChecked={paymentSettings?.isUsdtEnabled ?? false}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm text-muted-foreground">Enable</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">USDT Wallet Address (TRC20/ERC20)</label>
                        <input 
                            name="usdtAddress" 
                            defaultValue={paymentSettings?.usdtAddress || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="T..."
                        />
                        <p className="text-xs text-muted-foreground">Please specify network (e.g., TRC20) in instructions if needed.</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2">
                        <Save size={16} />
                        Save Payment Settings
                    </button>
                </div>
            </form>
        </div>
      )}
      {/* Page SEO Modal */}
      {isPageSeoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{editingPageSeo ? 'Edit Page SEO' : 'Add Page SEO'}</h2>
                    <button onClick={() => setIsPageSeoModalOpen(false)}><X size={24} /></button>
                </div>
                <form action={async (formData) => {
                    const result = await updatePageSeo(formData);
                    if (result.success) {
                        // Refresh list
                        const pages = await getAllPagesSeo();
                        if (pages.success) setPagesSeo(pages.data || []);
                        setIsPageSeoModalOpen(false);
                    } else {
                        alert(result.error || 'Failed to save');
                    }
                }} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Path (Route)</label>
                        <div className="relative">
                             <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                             <input 
                                name="path" 
                                defaultValue={editingPageSeo?.path || '/'} 
                                required 
                                className="w-full pl-9 pr-3 py-2 border rounded-md bg-background" 
                                placeholder="/contact"
                                readOnly={!!editingPageSeo} // Prevent changing path on edit to avoid duplicates/confusion
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">e.g., /contact, /about, /products</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Page Name (Meta Title)</label>
                        <input name="title" defaultValue={editingPageSeo?.title || ''} className="w-full p-2 border rounded-md bg-background" placeholder="Page Title" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Meta Description</label>
                        <textarea name="description" defaultValue={editingPageSeo?.description || ''} rows={3} className="w-full p-2 border rounded-md bg-background" placeholder="Page description..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Meta Keywords</label>
                        <input name="keywords" defaultValue={editingPageSeo?.keywords || ''} className="w-full p-2 border rounded-md bg-background" placeholder="keyword1, keyword2" />
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm font-medium">OG Image URL</label>
                        <input name="ogImage" defaultValue={editingPageSeo?.ogImage || ''} className="w-full p-2 border rounded-md bg-background" placeholder="https://..." />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
                            <Save size={16} /> Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
