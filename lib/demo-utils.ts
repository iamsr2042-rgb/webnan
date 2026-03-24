import { isDemoMode } from './demo-data';

export interface DemoContextType {
  isDemoMode: boolean;
  demoSlug?: string;
  canMutate: boolean;
  resetTime: number;
}

export const createDemoContext = (pathname: string): DemoContextType => {
  const isDemo = isDemoMode(pathname);
  const match = pathname.match(/\/demo\/([^\/]+)/);
  const demoSlug = match ? match[1] : undefined;

  return {
    isDemoMode: isDemo,
    demoSlug,
    canMutate: false, // All mutations disabled in demo
    resetTime: new Date(Date.now() + 2 * 60 * 60 * 1000).getTime(),
  };
};

export const getDemoErrorMessage = (action: string): string => {
  return `${action} is disabled in demo mode. Purchase to unlock full features.`;
};

export const checkDemoAction = (action: string, isDemoMode: boolean): { allowed: boolean; message?: string } => {
  if (!isDemoMode) {
    return { allowed: true };
  }

  const disabledActions = ['delete', 'edit', 'create', 'update', 'remove'];

  if (disabledActions.some((a) => action.toLowerCase().includes(a))) {
    return {
      allowed: false,
      message: getDemoErrorMessage(action),
    };
  }

  return { allowed: true };
};

export const formatResetTime = (resetTimeMs: number): string => {
  const now = Date.now();
  const diff = resetTimeMs - now;

  if (diff <= 0) {
    return 'now';
  }

  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

export const isValidDemoSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};
