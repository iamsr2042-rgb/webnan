'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PreviewHeader } from '@/components/preview/PreviewHeader';
import { PreviewContainer } from '@/components/preview/PreviewContainer';
import { DeviceType } from '@/lib/preview';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  demoUrl?: string;
  price: number;
  category: string;
}

export default function PreviewPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [removeFrame, setRemoveFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }

      const data = await response.json();
      setProduct(data.product);
    } catch (err) {
      console.error('[v0] Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">
            Preview Not Available
          </h1>
          <p className="text-slate-300 mb-6">
            {error || 'Could not load the product preview'}
          </p>
          <a
            href="/products"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  const demoUrl = product.demoUrl || `/products/${product.id}/demo`;

  return (
    <>
      <PreviewHeader
        productId={product.id}
        productTitle={product.title}
        device={device}
        onDeviceChange={setDevice}
        removeFrame={removeFrame}
        onFrameToggle={() => setRemoveFrame(!removeFrame)}
        frameRef={frameRef}
      />

      <PreviewContainer device={device} removeFrame={removeFrame}>
        <div
          ref={frameRef}
          className="w-full h-full"
          style={{
            transition: 'all 0.3s ease',
          }}
        >
          <iframe
            src={demoUrl}
            title={`${product.title} - Live Preview`}
            className="w-full h-full border-none"
            style={{
              borderRadius: removeFrame ? '0px' : '8px',
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation allow-presentation"
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </PreviewContainer>
    </>
  );
}
