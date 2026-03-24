'use client';

import { useEffect, useState } from 'react';
import { getDemoDataBySlug } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Package, Users, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AdminDemoPage({ params }: PageProps) {
  const [slug, setSlug] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSlug = async () => {
      const { slug: resolvedSlug } = await params;
      setSlug(resolvedSlug);

      const demoData = getDemoDataBySlug(resolvedSlug);
      if (demoData) {
        setData(demoData);
      }
      setLoading(false);
    };

    getSlug();
  }, [params]);

  const handleDemoAction = (action: string) => {
    toast.error(`${action} is disabled in demo mode. Purchase to unlock full features.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-lg bg-primary/20 animate-pulse mx-auto"></div>
          <p className="text-muted-foreground">Loading admin demo...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">Demo Not Found</h1>
          <p className="text-muted-foreground">The demo you are looking for does not exist.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border sticky top-16 z-40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/demo/${slug}`} className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Frontend
          </Link>
        </div>
      </div>

      {/* Admin Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard Demo</h1>
            <p className="text-muted-foreground">Explore the admin panel features (read-only in demo mode)</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">${data.stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-2">+{data.stats.revenueGrowth}% from last month</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{data.stats.totalOrders}</p>
              <p className="text-xs text-green-600 mt-2">+{data.stats.ordersGrowth}% from last month</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Products</p>
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{data.stats.totalProducts}</p>
              <p className="text-xs text-green-600 mt-2">+{data.stats.productGrowth}% from last month</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{data.stats.totalCustomers}</p>
              <p className="text-xs text-green-600 mt-2">+{data.stats.customerGrowth}% from last month</p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{data.credentials.email}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{order.product.title}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">${order.amount}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDemoAction('Edit order')}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user: any) => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDemoAction('Edit user')}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Ready to manage your marketplace?</h3>
              <p className="text-sm text-muted-foreground">Get full access to all admin features</p>
            </div>
            <Link href={`/products/${data.product.id}`}>
              <Button className="bg-primary hover:bg-primary/90">Buy Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
