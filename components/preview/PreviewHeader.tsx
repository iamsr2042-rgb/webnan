'use client';

import { useState } from 'react';
import { Copy, Maximize, Minimize, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyPreviewLink, openPreviewFullscreen, DeviceType } from '@/lib/preview';

interface PreviewHeaderProps {
  productId: string;
  productTitle: string;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  removeFrame: boolean;
  onFrameToggle: () => void;
  frameRef?: React.RefObject<HTMLDivElement>;
}

export function PreviewHeader({
  productId,
  productTitle,
  device,
  onDeviceChange,
  removeFrame,
  onFrameToggle,
  frameRef,
}: PreviewHeaderProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyPreviewLink(productId);
    if (success) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleFullscreen = () => {
    if (frameRef?.current) {
      openPreviewFullscreen(frameRef.current);
      setIsFullscreen(true);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section: Product Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-white truncate">
                {productTitle}
              </h1>
              <p className="text-xs text-slate-400">Live Preview</p>
            </div>
          </div>

          {/* Center Section: Device Selector */}
          <div className="flex items-center gap-1">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                onClick={() => onDeviceChange(d)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  device === d
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Right Section: Controls */}
          <div className="flex items-center gap-2">
            {/* Frame Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onFrameToggle}
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
              title={removeFrame ? 'Show frame' : 'Remove frame'}
            >
              <Layers className="h-4 w-4" />
            </Button>

            {/* Copy Link Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Copy preview link"
            >
              <Copy className="h-4 w-4" />
              {copyFeedback && (
                <span className="text-xs ml-1 text-green-400">Copied!</span>
              )}
            </Button>

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Open fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
