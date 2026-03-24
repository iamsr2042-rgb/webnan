import React from 'react';
import { DemoBar } from '@/components/demo/DemoBar';

export const metadata = {
  title: 'Product Demo - Script Market',
  description: 'Explore our product demo with full functionality preview',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DemoBar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
