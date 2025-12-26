import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Sanitization Patterns for Common Attack Vectors
 */
export const SANITIZATION_PATTERNS = {
  // XSS patterns
  xss: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<img[^>]*\s+on\w+\s*=/gi,
    /<svg[^>]*\s+on\w+\s*=/gi,
  ],

  // SQL Injection patterns
  sqlInjection: [
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(-{2}|\/\*|\*\/|;)/g, // SQL comments and terminators
  ],

  // Command Injection patterns
  commandInjection: [
    /[;&|`$()]/g, // Shell metacharacters
  ],

  // Path Traversal patterns
  pathTraversal: [/\.\.\//g, /\.\.\\/g, /%2e%2e/gi],

  // LDAP Injection patterns
  ldapInjection: [/[*()\\|&=]/g],

  // NoSQL Injection patterns
  noSqlInjection: [/(\$where|\$regex|\$exists|\$gt|\$lt|\$ne|\$and|\$or|\$not)/gi],
};

/**
 * Sanitize Interceptor
 * Cleans input data to prevent XSS, injection attacks, and other malicious payloads
 *
 * Features:
 * - Sanitizes request body, query parameters, and URL parameters
 * - Removes dangerous HTML/JavaScript patterns
 * - Prevents SQL injection, command injection, and path traversal
 * - Escapes special characters in strings
 * - Validates and sanitizes email addresses
 * - Removes potentially dangerous object keys
 * - Can optionally validate against custom patterns
 */
@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SanitizeInterceptor.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      // Sanitize request body
      if (request.body && typeof request.body === 'object') {
        request.body = this.sanitizeObject(request.body);
      }

      // Sanitize query parameters
      if (request.query && typeof request.query === 'object') {
        request.query = this.sanitizeObject(request.query);
      }

      // Sanitize URL parameters
      if (request.params && typeof request.params === 'object') {
        request.params = this.sanitizeObject(request.params);
      }

      // Validate content length
      this.validateContentLength(request);

      // Set security response headers (defense in depth)
      this.setSecurityHeaders(response);
    } catch (error) {
      this.logger.error(
        `Sanitization error: ${error instanceof Error ? error.message : 'unknown'}`,
        error instanceof Error ? error.stack : '',
      );
      throw new BadRequestException('Invalid or suspicious request detected');
    }

    return next.handle().pipe(
      map(data => {
        // Optionally sanitize response data if it contains user input
        return data;
      }),
      catchError(error => {
        return throwError(() => error);
      }),
    );
  }

  /**
   * Recursively sanitize an object (body, query params, etc.)
   */
  private sanitizeObject(obj: any, depth: number = 0): any {
    // Prevent infinite recursion
    if (depth > 10) {
      throw new BadRequestException('Request structure too deeply nested');
    }

    // Handle null/undefined
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Handle primitive types
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      if (obj.length > 1000) {
        throw new BadRequestException('Array too large');
      }
      return obj.map(item => this.sanitizeObject(item, depth + 1));
    }

    // Handle objects
    if (typeof obj === 'object') {
      const sanitized: any = {};
      const keys = Object.keys(obj);

      if (keys.length > 100) {
        throw new BadRequestException('Object has too many properties');
      }

      for (const key of keys) {
        // Skip dangerous keys
        if (this.isDangerousKey(key)) {
          this.logger.warn(`Skipping dangerous object key: ${key}`);
          continue;
        }

        // Sanitize key
        const sanitizedKey = this.sanitizeString(key);

        // Recursively sanitize value
        const value = obj[key];
        sanitized[sanitizedKey] = this.sanitizeObject(value, depth + 1);
      }

      return sanitized;
    }

    return obj;
  }

  /**
   * Sanitize a string value
   * Removes dangerous characters and patterns
   */
  private sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }

    let sanitized = str;

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove control characters except newline and carriage return (common in text)
    sanitized = sanitized.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');

    // Remove XSS patterns
    for (const pattern of SANITIZATION_PATTERNS.xss) {
      sanitized = sanitized.replace(pattern, '');
    }

    // Remove SQL injection patterns
    for (const pattern of SANITIZATION_PATTERNS.sqlInjection) {
      sanitized = sanitized.replace(pattern, '');
    }

    // Remove command injection patterns (but be careful not to break valid input)
    // Only apply strict filtering if it's clearly an injection attempt
    if (this.looksLikeCommandInjection(sanitized)) {
      sanitized = sanitized.replace(/[;&|`$()\n]/g, '');
    }

    // Remove path traversal attempts
    for (const pattern of SANITIZATION_PATTERNS.pathTraversal) {
      sanitized = sanitized.replace(pattern, '');
    }

    return sanitized.trim();
  }

  /**
   * Check if a string looks like a command injection attempt
   */
  private looksLikeCommandInjection(str: string): boolean {
    // Only consider it suspicious if it has multiple shell metacharacters
    const metacharCount = (str.match(/[;&|`$()\n]/g) || []).length;
    return metacharCount >= 2;
  }

  /**
   * Check if an object key is dangerous (could be used for prototype pollution)
   */
  private isDangerousKey(key: string): boolean {
    const dangerousKeys = [
      '__proto__',
      'constructor',
      'prototype',
      '__proto__',
      'eval',
      'execScript',
      'Function',
      'function',
      'Object',
      'object',
      'String',
      'string',
      'Number',
      'number',
      'Array',
      'array',
    ];

    const lowerKey = key.toLowerCase();
    return dangerousKeys.some(dangerous => lowerKey.includes(dangerous.toLowerCase()));
  }

  /**
   * Validate request content length
   */
  private validateContentLength(request: Request): void {
    const contentLength = parseInt(request.get('Content-Length') || '0', 10);

    // Check for unreasonably large requests
    if (contentLength > 50 * 1024 * 1024) {
      // 50MB max by default
      throw new BadRequestException('Request payload too large');
    }

    // More strict limits for specific endpoints
    if (request.path.includes('/auth/login') && contentLength > 1024 * 1024) {
      // 1MB for auth
      throw new BadRequestException('Request payload too large');
    }
  }

  /**
   * Set additional security headers in response
   */
  private setSecurityHeaders(response: Response): void {
    // Indicate to clients that the response should not be cached if it contains sensitive data
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');

    // Remove server header to not leak information
    response.removeHeader('Server');
  }
}

/**
 * Utility function to sanitize a string outside of the interceptor context
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return String(input);
  }

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');

  // Remove XSS patterns
  for (const pattern of SANITIZATION_PATTERNS.xss) {
    sanitized = sanitized.replace(pattern, '');
  }

  return sanitized.trim();
}

/**
 * Utility function to sanitize HTML input (for rich text fields)
 * Uses DOMPurify for comprehensive XSS protection
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    // Use isomorphic-dompurify for server-side sanitization
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const createDOMPurify = require('isomorphic-dompurify');
    const DOMPurify = createDOMPurify();

    // Default allowed tags for rich text content
    const allowedTags = [
      'p', 'br', 'strong', 'em', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'a', 'img',
      'blockquote', 'pre', 'code', 'kbd', 'samp',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
      'div', 'span', 'hr',
      'abbr', 'cite', 'q', 'sub', 'sup', 'time',
      'mark', 'del', 'ins'
    ];

    // Default allowed attributes
    const allowedAttributes: Record<string, string[]> = {
      a: ['href', 'title', 'target', 'rel', 'class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'class', 'loading'],
      code: ['class'],
      pre: ['class'],
      '*': ['class', 'id']
    };

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: Object.values(allowedAttributes).flat(),
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: true,
      // Prevent XSS via event handlers
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      // Remove dangerous protocols
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  } catch (error) {
    // Fallback to basic sanitization if DOMPurify fails
    let sanitized = html;
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    return sanitized;
  }
}

/**
 * Utility function to escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Utility function to validate email addresses
 */
export function isValidEmail(email: string): boolean {
  // RFC 5322 simplified email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional checks
  if (email.length > 254) {
    return false;
  }

  const [localPart, domain] = email.split('@');

  // Local part max length
  if (localPart.length > 64) {
    return false;
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }

  // Check for leading/trailing dots
  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    domain.startsWith('.') ||
    domain.endsWith('.')
  ) {
    return false;
  }

  return true;
}

/**
 * Utility function to validate URLs
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Check for suspicious hostnames
    if (parsedUrl.hostname.startsWith('.')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Utility function to sanitize file names
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path components
  let sanitized = fileName.replace(/^.*[\\\/]/, '');

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

  // Remove leading dots and spaces
  sanitized = sanitized.replace(/^[\s.]+/, '');

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized || 'file';
}
