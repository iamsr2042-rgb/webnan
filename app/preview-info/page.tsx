'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Eye, Monitor, Smartphone, Tablet, Copy, Maximize, Layers } from 'lucide-react';
import Link from 'next/link';

export default function PreviewInfoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Live Preview System
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test products across different devices before purchasing. Explore every feature in a fully responsive, interactive environment.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Preview */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Monitor className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Multi-Device Preview
                </h3>
              </div>
              <p className="text-muted-foreground">
                Switch between desktop (1440px), tablet (768px), and mobile (375px) views to test responsiveness and compatibility.
              </p>
              <div className="flex gap-2 pt-2">
                <span className="inline-block px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                  Desktop
                </span>
                <span className="inline-block px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                  Tablet
                </span>
                <span className="inline-block px-3 py-1 bg-secondary text-foreground rounded-full text-sm">
                  Mobile
                </span>
              </div>
            </div>

            {/* Frame Toggle */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Remove Frame Option
                </h3>
              </div>
              <p className="text-muted-foreground">
                Toggle the frame border to see the product in fullscreen mode. Perfect for examining the full interface without borders.
              </p>
              <button className="inline-block px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors text-sm font-medium">
                Remove Frame
              </button>
            </div>

            {/* Copy Link */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Copy className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Share Preview Link
                </h3>
              </div>
              <p className="text-muted-foreground">
                Copy the preview URL to share with team members or clients. Every product has a unique, shareable preview link.
              </p>
              <code className="block px-3 py-2 bg-secondary text-foreground rounded text-sm overflow-x-auto">
                /preview/product-id
              </code>
            </div>

            {/* Fullscreen Mode */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Maximize className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Fullscreen Mode
                </h3>
              </div>
              <p className="text-muted-foreground">
                Expand the preview to fullscreen for an immersive viewing experience. Perfect for detailed examination and presentations.
              </p>
              <button className="inline-block px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors text-sm font-medium">
                Fullscreen
              </button>
            </div>
          </div>

          {/* How to Use */}
          <div className="border border-border rounded-lg p-8 space-y-6 bg-card">
            <h2 className="text-2xl font-bold text-foreground">How to Use Live Preview</h2>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Browse Products',
                  description: 'Visit the products page and click "Live Preview" on any product card.',
                },
                {
                  step: 2,
                  title: 'Select Device',
                  description: 'Use the top toolbar to switch between desktop, tablet, and mobile views.',
                },
                {
                  step: 3,
                  title: 'Explore Features',
                  description: 'Interact with the product demo to test functionality and responsiveness.',
                },
                {
                  step: 4,
                  title: 'Toggle Frame',
                  description: 'Click the frame button to remove borders and see fullscreen preview.',
                },
                {
                  step: 5,
                  title: 'Share or Go Fullscreen',
                  description: 'Copy the preview link or expand to fullscreen for detailed viewing.',
                },
                {
                  step: 6,
                  title: 'Purchase',
                  description: 'Confident with your choice? Go back and purchase the product.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="border border-border rounded-lg p-8 space-y-6 bg-card">
            <h2 className="text-2xl font-bold text-foreground">Why Live Preview?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Confidence',
                  description: 'See exactly what you\'re buying before making a purchase.',
                },
                {
                  title: 'Testing',
                  description: 'Test all features and ensure compatibility with your needs.',
                },
                {
                  title: 'Sharing',
                  description: 'Share previews with clients, team members, or stakeholders.',
                },
              ].map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-bold text-foreground">
              Ready to explore products?
            </h2>
            <p className="text-muted-foreground">
              Browse our marketplace and try live previews of all available templates.
            </p>
            <Link href="/products">
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
                Explore Products
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
