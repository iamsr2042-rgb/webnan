'use client';

import { DEMO_MODE } from '@/lib/demo';
import Link from 'next/link';

export function DemoBadge() {
  if (!DEMO_MODE) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
      {/* Badge */}
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg">
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
        DEMO MODE
      </div>

      {/* Quick Links */}
      <div className="bg-background border border-border rounded-lg shadow-lg p-2 text-xs space-y-1">
        <Link
          href="/demo"
          className="block px-3 py-2 hover:bg-secondary rounded text-foreground hover:text-primary transition-colors"
        >
          Demo Info
        </Link>
        <Link
          href="/products"
          className="block px-3 py-2 hover:bg-secondary rounded text-foreground hover:text-primary transition-colors"
        >
          Demo Products
        </Link>
      </div>
    </div>
  );
}
