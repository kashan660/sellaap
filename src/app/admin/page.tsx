import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard - Sellaap",
  description: "Admin overview",
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [
    productCount,
    categoryCount,
    postCount,
    orderCount,
    userCount,
    recentOrders
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.post.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  // Calculate total revenue (simple sum)
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true
    },
    where: {
      status: 'COMPLETED'
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your store's performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={`$${(totalRevenue._sum.total || 0).toFixed(2)}`} 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
          trend="+20.1% from last month"
        />
        <StatsCard 
          title="Orders" 
          value={orderCount.toString()} 
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
          trend="+180.1% from last month"
        />
        <StatsCard 
          title="Products" 
          value={productCount.toString()} 
          icon={<Package className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatsCard 
          title="Active Users" 
          value={userCount.toString()} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{order.user.name || order.user.email}</p>
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {recentOrders.length > 0 && (
              <div className="mt-4 text-center">
                 <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all orders</Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-medium">Products</p>
                  <p className="text-xs text-muted-foreground">{categoryCount} Categories</p>
                </div>
              </div>
              <span className="font-bold text-xl">{productCount}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-medium">Blog Posts</p>
                  <p className="text-xs text-muted-foreground">Published Articles</p>
                </div>
              </div>
              <span className="font-bold text-xl">{postCount}</span>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Link href="/admin/products" className="flex-1">
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                  Manage Products
                </button>
              </Link>
              <Link href="/admin/blogs" className="flex-1">
                <button className="w-full py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-sm">
                  Manage Blog
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
