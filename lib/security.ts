import { NextResponse } from 'next/server';

/**
 * Security headers to add to all responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy (formerly Feature-Policy)
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

    // Strict-Transport-Security for HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Sanitize user input to prevent XSS
 * For HTML content, consider using DOMPurify
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  const sanitized = email.trim().toLowerCase();
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  return sanitized;
}

/**
 * Prevent SQL injection by validating string patterns
 * (Prisma already prevents SQL injection, but this adds extra validation)
 */
export function isValidDatabaseId(id: string): boolean {
  // Typical MongoDB ObjectId or CUID format
  return /^[a-z0-9_-]+$/i.test(id) && id.length < 50;
}

/**
 * Check for malicious patterns in file uploads
 */
export function validateUploadFilename(filename: string): boolean {
  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }

  // Prevent suspicious extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.jsp'];
  const lowerFilename = filename.toLowerCase();
  if (suspiciousExtensions.some(ext => lowerFilename.endsWith(ext))) {
    return false;
  }

  return true;
}

/**
 * Log security events for audit trail
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY] ${timestamp} - ${event}:`, JSON.stringify(details));
}

/**
 * Validate CSRF token
 * In production, store tokens in secure session
 */
export function validateCSRFToken(token: string | undefined, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }
  return token === sessionToken;
}

/**
 * Detect suspicious patterns in requests
 */
export function detectSuspiciousActivity(
  ipAddress: string,
  endpoint: string,
  method: string
): { isSuspicious: boolean; reason?: string } {
  // Check for repeated failed authentication
  // This would typically check against a database or cache
  // For now, just log the request

  // Check for mass enumeration (accessing many IDs rapidly)
  if (endpoint.includes('[id]') && method === 'GET') {
    // Could track this in a cache to detect enumeration
  }

  return { isSuspicious: false };
}

/**
 * Rate limiting key generation
 */
export function generateRateLimitKey(
  type: 'IP' | 'USER' | 'ENDPOINT',
  identifier: string,
  endpoint?: string
): string {
  switch (type) {
    case 'IP':
      return `rl:ip:${identifier}`;
    case 'USER':
      return `rl:user:${identifier}`;
    case 'ENDPOINT':
      return `rl:endpoint:${identifier}:${endpoint}`;
    default:
      return identifier;
  }
}
