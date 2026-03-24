'use client';

import { useEffect, useState } from 'react';
import { getDemoDataBySlug } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DemoPage({ params }: PageProps) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-lg bg-primary/20 animate-pulse mx-auto"></div>
          <p className="text-muted-foreground">Loading demo...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
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
          <Link href={`/products/${data.product.id}`} className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Product
          </Link>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{data.product.title} Demo</h1>
            <p className="text-lg text-muted-foreground">{data.product.description}</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.product.features.map((feature: string, idx: number) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-4 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Demo Preview */}
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-lg text-slate-400">
                  Frontend demo would load here
                </p>
                <p className="text-sm text-slate-500">
                  In production, this would display an iframe with the actual demo URL
                </p>
              </div>
            </div>
          </div>

          {/* Demo Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Demo User</p>
              <p className="font-mono text-sm">{data.credentials.email}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Demo Password</p>
              <p className="font-mono text-sm">{data.credentials.password}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Price</p>
              <p className="text-2xl font-bold text-primary">${data.product.price}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Ready to purchase?</h3>
              <p className="text-sm text-muted-foreground">Get instant access to the full version</p>
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
