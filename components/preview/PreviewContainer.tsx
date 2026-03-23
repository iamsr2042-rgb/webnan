'use client';

import { useRef } from 'react';
import { getDeviceStyles, DeviceType } from '@/lib/preview';

interface PreviewContainerProps {
  children: React.ReactNode;
  device: DeviceType;
  removeFrame: boolean;
}

export function PreviewContainer({
  children,
  device,
  removeFrame,
}: PreviewContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20"
    >
      <div
        style={getDeviceStyles(device, removeFrame)}
        className="relative"
      >
        {children}
      </div>
    </div>
  );
}
