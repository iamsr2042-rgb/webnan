import { prisma } from './db';

export enum AuditEventType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_REGISTER = 'USER_REGISTER',
  USER_DELETE = 'USER_DELETE',
  USER_ROLE_CHANGE = 'USER_ROLE_CHANGE',
  
  PRODUCT_CREATE = 'PRODUCT_CREATE',
  PRODUCT_UPDATE = 'PRODUCT_UPDATE',
  PRODUCT_DELETE = 'PRODUCT_DELETE',
  PRODUCT_UPLOAD = 'PRODUCT_UPLOAD',
  
  ORDER_CREATE = 'ORDER_CREATE',
  ORDER_UPDATE = 'ORDER_UPDATE',
  ORDER_DOWNLOAD = 'ORDER_DOWNLOAD',
  
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  
  SECURITY_BREACH_ATTEMPT = 'SECURITY_BREACH_ATTEMPT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  
  ADMIN_ACTION = 'ADMIN_ACTION',
}

export interface AuditLog {
  eventType: AuditEventType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceId?: string;
  resourceType?: string;
  action: string;
  details?: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Log security and audit events
 * In production, these should be persisted to a database or logging service
 */
export async function logAuditEvent(log: AuditLog): Promise<void> {
  const timestamp = new Date().toISOString();

  // Determine log level based on severity
  const logLevel = {
    LOW: 'log',
    MEDIUM: 'warn',
    HIGH: 'error',
    CRITICAL: 'error',
  }[log.severity];

  // Format log message
  const logMessage = `[AUDIT] ${timestamp} - ${log.eventType}: ${log.action}`;
  const logDetails = {
    userId: log.userId,
    ipAddress: log.ipAddress,
    severity: log.severity,
    resourceId: log.resourceId,
    resourceType: log.resourceType,
    ...log.details,
  };

  // Log to console
  console[logLevel as keyof typeof console](logMessage, logDetails);

  // In production, send to external logging service
  // Example: Sentry, LogRocket, DataDog, Splunk, etc.
  try {
    // Future: Integrate with external logging service
    // await sendToExternalLogger({ ...log, timestamp });
  } catch (error) {
    console.error('[AUDIT] Failed to send audit log to external service:', error);
  }
}

/**
 * Log successful user login
 */
export async function logUserLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.USER_LOGIN,
    userId,
    ipAddress,
    userAgent,
    action: `User logged in`,
    severity: 'LOW',
  });
}

/**
 * Log user logout
 */
export async function logUserLogout(userId: string, ipAddress?: string): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.USER_LOGOUT,
    userId,
    ipAddress,
    action: `User logged out`,
    severity: 'LOW',
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(email: string, ipAddress?: string): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.SECURITY_BREACH_ATTEMPT,
    ipAddress,
    action: `Failed login attempt for email: ${email}`,
    severity: 'MEDIUM',
    details: { email },
  });
}

/**
 * Log rate limit exceeded
 */
export async function logRateLimitExceeded(
  endpoint: string,
  ipAddress?: string,
  userId?: string
): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
    userId,
    ipAddress,
    action: `Rate limit exceeded on endpoint: ${endpoint}`,
    severity: 'MEDIUM',
    details: { endpoint },
  });
}

/**
 * Log admin action
 */
export async function logAdminAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.ADMIN_ACTION,
    userId,
    action,
    resourceType,
    resourceId,
    severity: 'HIGH',
    details,
  });
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
  description: string,
  ipAddress?: string,
  userId?: string,
  details?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
    userId,
    ipAddress,
    action: description,
    severity: 'HIGH',
    details,
  });
}

/**
 * Log security breach attempt
 */
export async function logSecurityBreach(
  description: string,
  ipAddress?: string,
  userId?: string,
  details?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    eventType: AuditEventType.SECURITY_BREACH_ATTEMPT,
    userId,
    ipAddress,
    action: description,
    severity: 'CRITICAL',
    details,
  });
}

/**
 * Get user's recent activity
 */
export async function getUserActivity(userId: string, limit: number = 50): Promise<any[]> {
  // In production, query from audit log table
  // For now, return empty array as placeholder
  console.log(`[AUDIT] Fetching activity for user ${userId} (last ${limit} events)`);
  return [];
}
