'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatResetTime, DEMO_RESET_INTERVAL } from '@/lib/demo-utils';
import { isDemoMode } from '@/lib/demo-data';
import Link from 'next/link';
import { X, RotateCcw } from 'lucide-react';

export function DemoBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [resetTime, setResetTime] = useState<string>('');
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const inDemo = isDemoMode(pathname);
    setShowBar(inDemo);
    setIsVisible(inDemo);

    if (inDemo) {
      const resetTimeMs = Date.now() + DEMO_RESET_INTERVAL;
      
      const updateTimer = () => {
        setResetTime(formatResetTime(resetTimeMs));
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [pathname]);

  if (!showBar || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-semibold">You are viewing a demo</p>
            <p className="text-xs opacity-90">Demo resets in {resetTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => {
              localStorage.removeItem('demo_data');
              window.location.reload();
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Demo
          </Button>

          <Link href={`/products`}>
            <Button
              size="sm"
              className="bg-white text-amber-600 hover:bg-white/90"
            >
              Buy Now
            </Button>
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
