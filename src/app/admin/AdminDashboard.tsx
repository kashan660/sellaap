'use client';

import { useState } from 'react';
import { Product, Post } from '@prisma/client';
import { updateProductImage, updatePostImage } from '@/lib/actions';
import { ImageUploader } from './ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Assuming we might want tabs later, or standard div for now if no UI lib
import { Package, FileText } from 'lucide-react';

// Simple Tab implementation since we might not have shadcn/ui Tabs installed fully
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

interface AdminDashboardProps {
  products: Product[];
  posts: Post[];
}

export default function AdminDashboard({ products: initialProducts, posts: initialPosts }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'posts'>('products');
  const [products, setProducts] = useState(initialProducts);
  const [posts, setPosts] = useState(initialPosts);

  const handleProductImageUpdate = async (id: number, url: string) => {
    const result = await updateProductImage(id, url);
    if (result.success && result.data) {
        setProducts(products.map(p => p.id === id ? result.data! : p));
    }
  };

  const handlePostImageUpdate = async (id: number, url: string) => {
    const result = await updatePostImage(id, url);
    if (result.success && result.data) {
        setPosts(posts.map(p => p.id === id ? result.data! : p));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 bg-muted p-1 rounded-lg w-fit">
        <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            <div className="flex items-center gap-2">
                <Package size={16} />
                Products
            </div>
        </TabButton>
        <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>
            <div className="flex items-center gap-2">
                <FileText size={16} />
                Blog Posts
            </div>
        </TabButton>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        {activeTab === 'products' && (
            <div className="divide-y divide-border">
                <div className="p-4 bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Product Name</div>
                    <div className="col-span-7">Image</div>
                </div>
                {products.map((product) => (
                    <div key={product.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-muted-foreground">#{product.id}</div>
                        <div className="col-span-4 font-medium">{product.name}</div>
                        <div className="col-span-7">
                            <ImageUploader 
                                currentImage={product.image || product.fallbackImage} 
                                onUploadComplete={(url) => handleProductImageUpdate(product.id, url)}
                                folder="products"
                            />
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'posts' && (
            <div className="divide-y divide-border">
                 <div className="p-4 bg-muted/30 font-medium grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Post Title</div>
                    <div className="col-span-7">Cover Image</div>
                </div>
                {posts.map((post) => (
                    <div key={post.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-muted-foreground">#{post.id}</div>
                        <div className="col-span-4 font-medium truncate" title={post.title}>{post.title}</div>
                        <div className="col-span-7">
                            <ImageUploader 
                                currentImage={post.imageUrl} 
                                onUploadComplete={(url) => handlePostImageUpdate(post.id, url)}
                                folder="blog"
                            />
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
