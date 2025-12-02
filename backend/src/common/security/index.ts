/**
 * Security Module Exports
 * Central export point for all security components
 */

// Middleware
export {
  SecurityHeadersMiddleware,
  SecurityHeaderOptions,
  createSecurityHeadersMiddleware,
} from './security-headers.middleware';

// Rate Limiting
export {
  RateLimiterConfigService,
  RateLimiterRule,
  RateLimiterConfig,
  createRateLimiterConfig,
} from './rate-limiter.config';

// Sanitization
export {
  SanitizeInterceptor,
  SANITIZATION_PATTERNS,
  sanitizeInput,
  sanitizeHtml,
  escapeHtml,
  isValidEmail,
  isValidUrl,
  sanitizeFileName,
} from './sanitize.interceptor';

// API Key Guard
export {
  ApiKeyGuard,
  ApiKeyMetadata,
  REQUIRE_API_KEY,
  RequireApiKey,
  RequestWithApiKey,
  getApiKeyFromRequest,
} from './api-key.guard';

/**
 * Type definitions for security configuration
 */

export interface SecurityConfig {
  // Headers Configuration
  headers: {
    enableHSTS: boolean;
    hstsMaxAge: number;
    enableCSP: boolean;
    cspReportUri?: string;
  };

  // Rate Limiting Configuration
  rateLimiting: {
    enabled: boolean;
    defaultWindowMs: number;
    defaultMaxRequests: number;
    redisEnabled: boolean;
  };

  // Input Sanitization Configuration
  sanitization: {
    enabled: boolean;
    removeXSS: boolean;
    removeSQLInjection: boolean;
    removeCommandInjection: boolean;
    maxPayloadSize: number;
    maxNestingDepth: number;
  };

  // API Key Configuration
  apiKey: {
    enabled: boolean;
    requireForAll: boolean;
    hashingAlgorithm: 'sha256' | 'sha512' | 'bcrypt';
    rotationInterval?: number; // Days
  };
}

/**
 * Default security configuration
 */
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  headers: {
    enableHSTS: true,
    hstsMaxAge: 31536000, // 1 year
    enableCSP: true,
    cspReportUri: undefined,
  },
  rateLimiting: {
    enabled: true,
    defaultWindowMs: 15 * 60 * 1000, // 15 minutes
    defaultMaxRequests: 100,
    redisEnabled: false,
  },
  sanitization: {
    enabled: true,
    removeXSS: true,
    removeSQLInjection: true,
    removeCommandInjection: true,
    maxPayloadSize: 50 * 1024 * 1024, // 50MB
    maxNestingDepth: 10,
  },
  apiKey: {
    enabled: true,
    requireForAll: false,
    hashingAlgorithm: 'sha256',
    rotationInterval: 90, // 90 days
  },
};

/**
 * Security audit event types
 */
export enum SecurityEventType {
  // XSS/Injection attempts
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  COMMAND_INJECTION_ATTEMPT = 'COMMAND_INJECTION_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',

  // Authentication related
  FAILED_LOGIN = 'FAILED_LOGIN',
  SUCCESSFUL_LOGIN = 'SUCCESSFUL_LOGIN',
  FAILED_API_KEY_AUTH = 'FAILED_API_KEY_AUTH',
  INVALID_API_KEY = 'INVALID_API_KEY',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_RESET = 'RATE_LIMIT_RESET',

  // Access control
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  IP_NOT_WHITELISTED = 'IP_NOT_WHITELISTED',

  // Policy violations
  CSP_VIOLATION = 'CSP_VIOLATION',
  CORS_VIOLATION = 'CORS_VIOLATION',
  HSTS_VIOLATION = 'HSTS_VIOLATION',

  // Other
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SECURITY_MISCONFIGURATION = 'SECURITY_MISCONFIGURATION',
}

/**
 * Security event structure
 */
export interface SecurityEvent {
  timestamp: Date;
  type: SecurityEventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourceIP: string;
  userID?: string;
  apiKeyName?: string;
  endpoint: string;
  method: string;
  userAgent: string;
  details: Record<string, any>;
  action?: string; // e.g., 'BLOCKED', 'ALLOWED', 'LOGGED'
}

/**
 * Security metrics
 */
export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  rateLimitedRequests: number;
  xssAttemptsDetected: number;
  injectionAttemptsDetected: number;
  unauthorizedAccessAttempts: number;
  averageResponseTime: number;
  uptime: number;
  lastSecurityIncident?: Date;
}

/**
 * Helper function to create a security event
 */
export function createSecurityEvent(
  type: SecurityEventType,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  sourceIP: string,
  endpoint: string,
  method: string,
  userAgent: string,
  details: Record<string, any>,
  options?: {
    userID?: string;
    apiKeyName?: string;
    action?: string;
  }
): SecurityEvent {
  return {
    timestamp: new Date(),
    type,
    severity,
    sourceIP,
    endpoint,
    method,
    userAgent,
    details,
    ...options,
  };
}

/**
 * Helper function to determine severity level based on event type
 */
export function determineSeverity(type: SecurityEventType): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const criticalEvents = [
    SecurityEventType.SQL_INJECTION_ATTEMPT,
    SecurityEventType.COMMAND_INJECTION_ATTEMPT,
    SecurityEventType.PATH_TRAVERSAL_ATTEMPT,
  ];

  const highEvents = [
    SecurityEventType.XSS_ATTEMPT,
    SecurityEventType.UNAUTHORIZED_ACCESS,
    SecurityEventType.IP_NOT_WHITELISTED,
    SecurityEventType.INVALID_API_KEY,
  ];

  const mediumEvents = [
    SecurityEventType.RATE_LIMIT_EXCEEDED,
    SecurityEventType.SUSPICIOUS_ACTIVITY,
  ];

  if (criticalEvents.includes(type)) return 'CRITICAL';
  if (highEvents.includes(type)) return 'HIGH';
  if (mediumEvents.includes(type)) return 'MEDIUM';
  return 'LOW';
}
