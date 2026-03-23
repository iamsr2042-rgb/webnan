'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Check, DollarSign, CreditCard, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { DEMO_MODE } from '@/lib/demo';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('product');
  const failed = searchParams.get('failed');
  const cancelled = searchParams.get('cancelled');
  const success = searchParams.get('success');

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'sslcommerz'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode] = useState(DEMO_MODE);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('[v0] Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!product) return;

    try {
      setIsProcessing(true);
      setError(null);

      // In demo mode, simulate payment success
      if (isDemoMode) {
        console.log('[v0] Demo mode - simulating payment...');
        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Redirect to success page
        router.push(`/checkout/success?order=${Date.now()}`);
        return;
      }

      if (paymentMethod === 'stripe') {
        // Create Stripe Payment Intent
        const response = await fetch('/api/payment/stripe-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        // In production, redirect to Stripe checkout or open Stripe Elements
        // For now, show the client secret
        console.log('[v0] Payment Intent created:', data.clientSecret);
        alert('Payment intent created. In production, this would open Stripe payment dialog.');
      } else {
        // SSLCommerz payment
        const response = await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to initiate payment');
        }

        const data = await response.json();
        // Redirect to SSLCommerz payment page
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="rounded-lg border border-border bg-card p-8 text-center space-y-6">
            <Check className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful</h1>
              <p className="text-muted-foreground">
                Your purchase has been completed. You can now download your product from your dashboard.
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button variant="outline" className="w-full">
                  Browse More Products
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (failed || cancelled) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="rounded-lg border border-border bg-card p-8 text-center space-y-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {failed ? 'Payment Failed' : 'Payment Cancelled'}
              </h1>
              <p className="text-muted-foreground">
                {failed
                  ? 'We couldn\'t process your payment. Please try again or contact support.'
                  : 'You cancelled the payment. Feel free to continue shopping or try again later.'}
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/products" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  {failed ? 'Try Another Product' : 'Continue Shopping'}
                </Button>
              </Link>
              {failed && (
                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        ) : !product ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center space-y-6">
            <AlertCircle className="h-12 w-12 text-accent mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
              <p className="text-muted-foreground">
                {error || 'The product you\'re looking for doesn\'t exist or has been removed.'}
              </p>
            </div>
            <Link href="/products" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Demo Mode Warning */}
            {isDemoMode && (
              <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-4 flex gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Demo Mode Active</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    You are in demo mode. Payments are simulated and no real charges will be made. Use this environment to test the checkout flow.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

              <div className="space-y-4">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-6">
              <h2 className="text-xl font-bold text-foreground">Payment Method</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <input
                    type="radio"
                    name="payment-method"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="font-semibold text-foreground">Stripe</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Credit/Debit Cards, Apple Pay, Google Pay
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <input
                    type="radio"
                    name="payment-method"
                    value="sslcommerz"
                    checked={paymentMethod === 'sslcommerz'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'sslcommerz')}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="font-semibold text-foreground">SSLCommerz</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Local Payment Methods
                    </p>
                  </div>
                </label>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay ${product.price.toFixed(2)} with {paymentMethod === 'stripe' ? 'Stripe' : 'SSLCommerz'}
                  </>
                )}
              </Button>

              {/* Security Info */}
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  Your payment is secured with industry-standard encryption. We never store your card details.
                </p>
              </div>
            </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
