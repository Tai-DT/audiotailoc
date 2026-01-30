/**
 * Type Definitions for Security Module
 * Provides comprehensive TypeScript interfaces and types for security features
 */

import { Request } from 'express';

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Extended Request with security context
 */
export interface SecureRequest extends Request {
  // API Key information
  apiKey?: {
    key: string;
    name: string;
    scopes: string[];
  };

  // Rate limit information
  rateLimit?: {
    limit: number;
    remaining: number;
    resetTime: Date;
  };

  // User information (if authenticated)
  user?: {
    id: string;
    email?: string;
    roles?: string[];
  };

  // Security audit trail
  securityContext?: SecurityContext;
}

/**
 * Security context for tracking security-related information
 */
export interface SecurityContext {
  // Request information
  requestId: string;
  timestamp: Date;
  method: string;
  path: string;
  ip: string;
  userAgent?: string;

  // Security checks performed
  checks: {
    headerValidation: boolean;
    inputSanitization: boolean;
    rateLimitCheck: boolean;
    apiKeyValidation?: boolean;
  };

  // Security events
  events: SecurityAuditEvent[];
}

/**
 * Security audit event for logging
 */
export interface SecurityAuditEvent {
  type: SecurityEventType;
  severity: Severity;
  timestamp: Date;
  details: Record<string, any>;
  action?: 'ALLOWED' | 'BLOCKED' | 'LOGGED';
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
  // HSTS Configuration
  hsts?: {
    enabled: boolean;
    maxAge: number; // Seconds
    includeSubDomains: boolean;
    preload: boolean;
  };

  // CSP Configuration
  csp?: {
    enabled: boolean;
    directives: Record<string, string[]>;
    reportUri?: string;
  };

  // Frame protection
  frameGuard?: {
    action: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
    uri?: string;
  };

  // Custom headers
  customHeaders?: Record<string, string>;
}

/**
 * Rate limiting rule configuration
 */
export interface RateLimitingConfig {
  // Default settings
  enabled: boolean;
  defaultWindowMs: number;
  defaultMaxRequests: number;

  // Storage backend
  store?: 'memory' | 'redis' | 'dynamodb';
  storeConfig?: Record<string, any>;

  // Rules for specific routes
  rules: RateLimitRule[];
}

/**
 * Rate limit rule for specific routes
 */
export interface RateLimitRule {
  pattern: string | RegExp;
  windowMs: number;
  maxRequests: number;
  methods?: string[];
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/**
 * Input sanitization configuration
 */
export interface SanitizationConfig {
  enabled: boolean;

  // What to sanitize
  targets: {
    body: boolean;
    query: boolean;
    params: boolean;
    cookies: boolean;
  };

  // Sanitization rules
  rules: {
    removeXSS: boolean;
    removeSQLInjection: boolean;
    removeCommandInjection: boolean;
    preventPathTraversal: boolean;
    preventPrototypePollution: boolean;
  };

  // Limits
  maxPayloadSize: number;
  maxNestingDepth: number;
  maxObjectProperties: number;
  maxArrayItems: number;
}

/**
 * API Key configuration
 */
export interface ApiKeyConfig {
  enabled: boolean;
  requireForAll: boolean;

  // Key format
  minLength: number;
  maxLength: number;
  allowedCharacters: string;

  // Storage and hashing
  storage: 'memory' | 'database' | 'redis';
  hashAlgorithm: 'sha256' | 'sha512' | 'bcrypt';

  // Rotation policy
  rotationEnabled: boolean;
  rotationInterval: number; // Days

  // Rate limiting per key
  rateLimit?: {
    enabled: boolean;
    defaultRequestsPerMinute: number;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * API Key metadata
 */
export interface ApiKeyData {
  id: string;
  key: string;
  name: string;
  description?: string;
  owner: string;

  // Access control
  scopes: string[];
  permissions: Permission[];
  restrictions: ApiKeyRestriction[];

  // Lifecycle
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;

  // Status
  active: boolean;
  revoked: boolean;
  revokedAt?: Date;
  revocationReason?: string;
}

/**
 * API Key restriction
 */
export interface ApiKeyRestriction {
  type: 'IP' | 'METHOD' | 'PATH' | 'TIME' | 'RATE_LIMIT';

  // IP restriction
  ipAddresses?: string[];
  ipCIDR?: string[];

  // HTTP method restriction
  allowedMethods?: string[];

  // Path restriction
  allowedPaths?: string[];
  deniedPaths?: string[];

  // Time restriction
  timeWindow?: {
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    timezone: string;
    daysOfWeek: number[]; // 0-6
  };

  // Rate limiting
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

/**
 * Permission granted to API key
 */
export interface Permission {
  resource: string;
  action: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  conditions?: Record<string, any>;
}

// ============================================================================
// Security Event Types
// ============================================================================

/**
 * Security event type enumeration
 */
export enum SecurityEventType {
  // XSS / Injection
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  COMMAND_INJECTION_ATTEMPT = 'COMMAND_INJECTION_ATTEMPT',
  LDAP_INJECTION_ATTEMPT = 'LDAP_INJECTION_ATTEMPT',
  NOSQL_INJECTION_ATTEMPT = 'NOSQL_INJECTION_ATTEMPT',
  PATH_TRAVERSAL_ATTEMPT = 'PATH_TRAVERSAL_ATTEMPT',
  PROTOTYPE_POLLUTION_ATTEMPT = 'PROTOTYPE_POLLUTION_ATTEMPT',

  // Authentication
  AUTH_ATTEMPT = 'AUTH_ATTEMPT',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  INVALID_API_KEY = 'INVALID_API_KEY',
  EXPIRED_API_KEY = 'EXPIRED_API_KEY',
  API_KEY_REVOKED = 'API_KEY_REVOKED',

  // Authorization
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  INSUFFICIENT_SCOPE = 'INSUFFICIENT_SCOPE',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  BRUTE_FORCE_DETECTED = 'BRUTE_FORCE_DETECTED',

  // Access violations
  IP_NOT_WHITELISTED = 'IP_NOT_WHITELISTED',
  GEO_BLOCKED = 'GEO_BLOCKED',
  TIME_RESTRICTED = 'TIME_RESTRICTED',

  // Policy violations
  CSP_VIOLATION = 'CSP_VIOLATION',
  CORS_VIOLATION = 'CORS_VIOLATION',
  HSTS_VIOLATION = 'HSTS_VIOLATION',
  HEADERS_MISSING = 'HEADERS_MISSING',

  // Suspicious activity
  SUSPICIOUS_PATTERN = 'SUSPICIOUS_PATTERN',
  ANOMALOUS_BEHAVIOR = 'ANOMALOUS_BEHAVIOR',
  DATA_EXFILTRATION_ATTEMPT = 'DATA_EXFILTRATION_ATTEMPT',

  // Configuration
  SECURITY_MISCONFIGURATION = 'SECURITY_MISCONFIGURATION',
  MISSING_SECURITY_HEADER = 'MISSING_SECURITY_HEADER',
  WEAK_ENCRYPTION = 'WEAK_ENCRYPTION',
}

/**
 * Event severity level
 */
export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Security event
 */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: Severity;

  // Timeline
  timestamp: Date;
  detectedAt: Date;
  resolvedAt?: Date;

  // Source
  sourceIP: string;
  userAgent?: string;
  userId?: string;
  apiKeyId?: string;

  // Request context
  method: string;
  path: string;
  statusCode?: number;

  // Details
  description: string;
  details: Record<string, any>;
  evidence?: string[];

  // Response
  action: 'ALLOWED' | 'BLOCKED' | 'LOGGED' | 'ALERTED';
  actionDetails?: Record<string, any>;

  // Classification
  category: string;
  tags: string[];
}

// ============================================================================
// Metrics Types
// ============================================================================

/**
 * Security metrics
 */
export interface SecurityMetrics {
  // Time period
  period: {
    startTime: Date;
    endTime: Date;
    duration: number;
  };

  // Request metrics
  requests: {
    total: number;
    allowed: number;
    blocked: number;
    rateLimited: number;
    average_response_time_ms: number;
  };

  // Security events
  security: {
    xss_attempts: number;
    injection_attempts: number;
    auth_failures: number;
    rate_limit_violations: number;
    suspicious_activities: number;
  };

  // API Keys
  apiKeys: {
    total: number;
    active: number;
    expired: number;
    revoked: number;
    rotationDue: number;
  };

  // Performance
  performance: {
    slowestEndpoint: string;
    slowestEndpointTime_ms: number;
    mostCalledEndpoint: string;
    mostCalledEndpointCount: number;
  };

  // Health
  health: {
    uptime_percentage: number;
    availability: boolean;
    lastIncident?: Date;
  };
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Input validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
  sanitized?: any;
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  rule: string;
  message: string;
  value?: any;
  severity: Severity;
}

/**
 * Sanitization result
 */
export interface SanitizationResult {
  original: string;
  sanitized: string;
  threatsRemoved: SanitizationThreat[];
  isSafe: boolean;
}

/**
 * Sanitization threat detected
 */
export interface SanitizationThreat {
  type: string;
  pattern: string;
  severity: Severity;
  location: number;
  snippet: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Security error response
 */
export interface SecurityErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, any>;
  requestId?: string;
  timestamp: Date;
}

/**
 * Rate limit response headers
 */
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'Retry-After': string;
}

// ============================================================================
// Decorator Types
// ============================================================================

/**
 * Security decorator options
 */
export interface SecurityDecoratorOptions {
  // What level of security to apply
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  // Scopes required
  requiredScopes?: string[];

  // Rate limiting
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour?: number;
  };

  // IP whitelist
  ipWhitelist?: string[];

  // Custom validation
  validate?: (req: SecureRequest) => boolean | Promise<boolean>;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Hash algorithm type
 */
export type HashAlgorithm = 'sha256' | 'sha512' | 'bcrypt';

/**
 * Store type for caching/persistence
 */
export type StoreType = 'memory' | 'redis' | 'dynamodb' | 'custom';

/**
 * IP address (IPv4 or IPv6)
 */
export type IPAddress = string & { readonly __brand: 'IPAddress' };

/**
 * CIDR notation (e.g., 192.168.0.0/24)
 */
export type CIDRNotation = string & { readonly __brand: 'CIDR' };

/**
 * API Key (opaque type)
 */
export type ApiKey = string & { readonly __brand: 'ApiKey' };

/**
 * Security token
 */
export type SecurityToken = string & { readonly __brand: 'SecurityToken' };
