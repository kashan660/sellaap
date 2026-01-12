import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - Sellaap",
  description: "Manage your products and blog posts.",
};

// Force dynamic rendering so we always get the latest data
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' },
    include: { category: true }
  });
  
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
  
  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' }
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage products, categories, and blog posts.</p>
        </div>
        
        <AdminDashboard products={products} posts={posts} categories={categories} />
      </div>
    </div>
  );
}
