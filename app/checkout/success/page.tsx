'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Check, Download, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface OrderDetails {
  id: string;
  productName: string;
  amount: number;
  expiresAt: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('[v0] Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 space-y-8">
          {/* Success Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {/* Order Details */}
          {!isLoading && order ? (
            <div className="border border-border rounded-lg bg-background p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Order Details</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-sm">{order.id}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-semibold text-foreground">{order.productName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-lg font-bold text-primary">${order.amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Download Expires:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center">
              <div className="h-8 w-8 rounded-lg bg-primary/20 animate-pulse mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading order details...</p>
            </div>
          ) : null}

          {/* Next Steps */}
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="font-semibold text-foreground">What's Next?</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Download from Dashboard</p>
                  <p className="text-sm text-muted-foreground">Visit your dashboard to access and download your product</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Check Your Email</p>
                  <p className="text-sm text-muted-foreground">Confirmation and download details have been sent to your email</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Get Support</p>
                  <p className="text-sm text-muted-foreground">30 days of support included with your purchase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 h-12">
                <Download className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/products" className="block">
              <Button variant="outline" className="w-full h-12">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">
              Didn't receive your download? Check your spam folder or{' '}
              <Link href="/contact" className="underline hover:no-underline font-semibold">
                contact support
              </Link>
              . We're here to help!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
