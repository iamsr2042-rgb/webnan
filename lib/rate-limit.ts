import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

// In-memory rate limit store (for development)
// In production, use Upstash Redis for distributed rate limiting
const rateLimitStore: RateLimitStore = {};

interface RateLimitOptions {
  interval: number; // in milliseconds
  maxRequests: number;
}

/**
 * Extract client IP from request
 * Handles proxies and load balancers
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Simple in-memory rate limiter
 * For production, use Upstash Redis
 */
export function createRateLimiter(
  key: string,
  options: RateLimitOptions
): { isAllowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore[key];

  if (!entry || now > entry.resetTime) {
    // New window or expired entry
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + options.interval,
    };
    return {
      isAllowed: true,
      remaining: options.maxRequests - 1,
      resetTime: rateLimitStore[key].resetTime,
    };
  }

  // Within existing window
  const isAllowed = entry.count < options.maxRequests;
  if (isAllowed) {
    entry.count++;
  }

  return {
    isAllowed,
    remaining: Math.max(0, options.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit presets
 */
export const RATE_LIMITS = {
  // Auth endpoints: 5 requests per minute per IP
  AUTH: {
    interval: 60 * 1000,
    maxRequests: 5,
  },

  // Download endpoint: 10 requests per day per user
  DOWNLOAD: {
    interval: 24 * 60 * 60 * 1000,
    maxRequests: 10,
  },

  // API endpoints: 100 requests per minute per IP
  API: {
    interval: 60 * 1000,
    maxRequests: 100,
  },

  // Strict: 3 requests per minute (for critical operations)
  STRICT: {
    interval: 60 * 1000,
    maxRequests: 3,
  },

  // Search: 30 requests per minute per IP
  SEARCH: {
    interval: 60 * 1000,
    maxRequests: 30,
  },
};

/**
 * Middleware-friendly rate limiter
 * Returns headers to set on response
 */
export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
}

/**
 * Cleanup old entries from in-memory store
 * Should be called periodically (e.g., every hour)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const keysToDelete = Object.keys(rateLimitStore).filter(
    key => rateLimitStore[key].resetTime < now
  );

  keysToDelete.forEach(key => {
    delete rateLimitStore[key];
  });

  if (keysToDelete.length > 0) {
    console.log(`[v0] Cleaned up ${keysToDelete.length} rate limit entries`);
  }
}

/**
 * Clean up store every 30 minutes
 */
if (typeof global !== 'undefined' && !global.__rateLimit_cleanup_interval) {
  global.__rateLimit_cleanup_interval = setInterval(cleanupRateLimitStore, 30 * 60 * 1000);
}
