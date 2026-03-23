/**
 * Demo Mode Utilities
 * Handles demo mode detection, validation, and badge rendering
 */

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@demo.scriptmarket.com',
    password: 'demo123456',
    name: 'Demo Admin',
  },
  customer: {
    email: 'customer@demo.scriptmarket.com',
    password: 'demo123456',
    name: 'Demo Customer',
  },
};

/**
 * Check if request is in demo mode
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}

/**
 * Get demo badge component markup
 */
export function getDemoBadgeMarkup(): string {
  if (!isDemoMode()) return '';

  return `
    <div class="fixed top-4 right-4 z-50">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
        DEMO MODE
      </div>
    </div>
  `;
}

/**
 * Disable payment processing in demo mode
 */
export function shouldDisablePayment(): boolean {
  return isDemoMode();
}

/**
 * Get demo mode warning message
 */
export function getDemoWarning(): string {
  if (!isDemoMode()) return '';
  return 'This is a demo environment. Use demo credentials to test the platform.';
}

/**
 * Demo user info for display
 */
export const DEMO_USERS_FOR_DISPLAY = [
  {
    role: 'Admin',
    email: DEMO_CREDENTIALS.admin.email,
    password: DEMO_CREDENTIALS.admin.password,
    note: 'Full access to dashboard, manage products, orders, and users',
  },
  {
    role: 'Customer',
    email: DEMO_CREDENTIALS.customer.email,
    password: DEMO_CREDENTIALS.customer.password,
    note: 'Browse products, make test purchases (mock payment)',
  },
];

/**
 * Reset demo data endpoint
 * Called to restore demo database to initial state
 */
export async function resetDemoData(): Promise<{ success: boolean; message: string }> {
  if (!isDemoMode()) {
    return { success: false, message: 'Demo mode is not enabled' };
  }

  try {
    const response = await fetch('/api/admin/demo/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[v0] Error resetting demo data:', error);
    return { success: false, message: 'Failed to reset demo data' };
  }
}

/**
 * Log demo action for analytics
 */
export function logDemoAction(action: string, details: Record<string, any> = {}): void {
  if (!isDemoMode()) return;

  console.log('[v0 DEMO]', action, details);

  // In production, you would send this to analytics service
  // fetch('/api/analytics/demo-action', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ action, details, timestamp: new Date() }),
  // });
}
