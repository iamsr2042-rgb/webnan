'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Order {
  id: string;
  amount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  product?: {
    id: string;
    title: string;
    price: number;
  };
}

export default function OrdersAdmin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUserAndOrders();
  }, [router]);

  const fetchUserAndOrders = async () => {
    try {
      // Check if user is authenticated and is admin
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      // Check if user is admin
      if (userData.user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      // Fetch all orders
      const ordersRes = await fetch('/api/orders?limit=100');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, deliveryStatus: string, paymentStatus?: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryStatus,
          ...(paymentStatus && { paymentStatus }),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to update order');
        return;
      }

      const data = await response.json();
      setOrders(orders.map(o => o.id === orderId ? data.order : o));
      setSelectedOrder(data.order);
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'bg-green-500/10 text-green-600';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'FAILED':
      case 'REFUNDED':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-foreground mb-6">Orders Management</h1>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground">{order.product?.title || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm">
                          <div>
                            <p className="text-foreground font-semibold">{order.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground font-semibold">${order.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.deliveryStatus)}`}>
                              {order.deliveryStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" /> View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase">Order ID</label>
                  <p className="text-foreground font-mono text-sm">{selectedOrder.id.slice(0, 12)}...</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase">Customer</label>
                  <p className="text-foreground font-semibold">{selectedOrder.user?.name}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase">Email</label>
                  <p className="text-foreground text-sm">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase">Product</label>
                  <p className="text-foreground">{selectedOrder.product?.title}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase">Amount</label>
                  <p className="text-2xl font-bold text-primary">${selectedOrder.amount}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase">Date</label>
                  <p className="text-foreground">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase mb-2 block">Delivery Status</label>
                  <select
                    value={selectedOrder.deliveryStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase mb-2 block">Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.deliveryStatus, e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
