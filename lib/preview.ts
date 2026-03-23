/**
 * Preview system utilities for live product demos
 */

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  userAgent?: string;
}

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  desktop: {
    name: 'Desktop',
    width: 1440,
    height: 900,
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
  },
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
  },
};

/**
 * Get CSS classes for device-specific styling
 */
export function getDeviceClasses(device: DeviceType): string {
  const config = DEVICE_CONFIGS[device];
  return `w-[${config.width}px] h-[${config.height}px]`;
}

/**
 * Get inline styles for responsive device preview
 */
export function getDeviceStyles(device: DeviceType, removeFrame: boolean = false) {
  const config = DEVICE_CONFIGS[device];
  return {
    width: config.width,
    height: config.height,
    aspectRatio: `${config.width} / ${config.height}`,
    border: removeFrame ? 'none' : '1px solid rgba(0,0,0,0.1)',
    borderRadius: removeFrame ? '0px' : '8px',
    boxShadow: removeFrame ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden' as const,
    transition: 'all 0.3s ease',
  };
}

/**
 * Copy preview link to clipboard
 */
export async function copyPreviewLink(productId: string): Promise<boolean> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const previewUrl = `${baseUrl}/preview/${productId}`;
    await navigator.clipboard.writeText(previewUrl);
    return true;
  } catch (error) {
    console.error('[v0] Failed to copy preview link:', error);
    return false;
  }
}

/**
 * Open preview in fullscreen
 */
export function openPreviewFullscreen(element: HTMLElement): void {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    (element as any).webkitRequestFullscreen();
  }
}

/**
 * Get preview URL for product demo
 */
export function getPreviewUrl(productId: string, demoUrl?: string): string {
  // Use demoUrl if provided, otherwise use a default demo page
  if (demoUrl) {
    return demoUrl;
  }
  // Fallback to product demo page
  return `/products/${productId}/demo`;
}

/**
 * Generate device selector options
 */
export function getDeviceOptions(): Array<{
  value: DeviceType;
  label: string;
  icon: string;
}> {
  return [
    { value: 'desktop', label: 'Desktop', icon: 'monitor' },
    { value: 'tablet', label: 'Tablet', icon: 'tablet' },
    { value: 'mobile', label: 'Mobile', icon: 'smartphone' },
  ];
}
