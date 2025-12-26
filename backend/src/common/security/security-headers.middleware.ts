import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Security Headers Middleware
 * Adds essential security headers to HTTP responses to protect against common attacks
 *
 * Headers added:
 * - Strict-Transport-Security (HSTS): Forces HTTPS
 * - X-Content-Type-Options: Prevents MIME type sniffing
 * - X-Frame-Options: Prevents clickjacking
 * - X-XSS-Protection: Additional XSS protection for older browsers
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Controls browser features (replaces Feature-Policy)
 * - Content-Security-Policy: Prevents inline scripts and resource loading from untrusted sources
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityHeadersMiddleware.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  use(req: Request, res: Response, next: NextFunction) {
    // Strict Transport Security (HSTS)
    // Forces HTTPS connections. Disabled in development to allow local HTTP testing
    if (!this.isDevelopment) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Prevent MIME type sniffing
    // Tells the browser not to guess the MIME type of a response
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking attacks
    // DENY: The page cannot be displayed in a frame
    // For APIs, we typically don't need to be embeddable in frames
    res.setHeader('X-Frame-Options', 'DENY');

    // Additional XSS protection for older browsers
    // Note: Modern browsers use CSP instead, but this header is useful for legacy browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Control how much referrer information is shared
    // strict-no-referrer: Never send referrer information
    // We use strict-no-referrer to protect user privacy
    res.setHeader('Referrer-Policy', 'strict-no-referrer');

    // Permissions Policy (formerly Feature-Policy)
    // Restricts which browser features can be used
    // This is more comprehensive than X-Frame-Options for controlling browser capabilities
    res.setHeader(
      'Permissions-Policy',
      [
        'accelerometer=()',
        'ambient-light-sensor=()',
        'autoplay=()',
        'battery=()',
        'camera=()',
        'document-domain=()',
        'encrypted-media=()',
        'fullscreen=()',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'midi=()',
        'payment=()',
        'usb=()',
        'vr=()',
        'xr-spatial-tracking=()',
      ].join('; '),
    );

    // Content Security Policy (CSP)
    // Restricts which resources the browser can load
    // This helps prevent XSS, injection attacks, and other content-based attacks
    const csp = this.getContentSecurityPolicy();
    res.setHeader('Content-Security-Policy', csp);

    // Additional security headers for defense in depth
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    // Public-Key-Pins (optional - only if using certificate pinning)
    // Uncomment if you want to implement HPKP for additional certificate security
    // res.setHeader('Public-Key-Pins', 'pin-sha256="..."; pin-sha256="..."; max-age=...');

    next();
  }

  /**
   * Generate Content Security Policy header
   * This is the most powerful defense against XSS and injection attacks
   */
  private getContentSecurityPolicy(): string {
    const policies: Record<string, string[]> = {
      // Default fallback for any resource not covered by specific directives
      'default-src': ["'self'"],

      // Scripts - only allow from same origin and trusted inline scripts
      'script-src': [
        "'self'",
        // Add trusted CDNs for third-party scripts if needed
        // 'https://cdn.jsdelivr.net',
        // Allow unsafe-inline only in development for hot module replacement
        ...(this.isDevelopment ? ["'unsafe-inline'"] : []),
        // Allow hashes for specific inline scripts (alternative to unsafe-inline)
        // 'sha256-...',
      ],

      // Styles - allow from same origin and inline styles (often needed for dynamic styling)
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Often necessary for styled-components and dynamic CSS
        // 'https://fonts.googleapis.com',
      ],

      // Images from same origin, data URIs, and HTTPS
      'img-src': [
        "'self'",
        'data:',
        'https:',
        // Add trusted image CDNs if needed
        // 'https://res.cloudinary.com',
      ],

      // Fonts
      'font-src': [
        "'self'",
        'data:',
        // 'https://fonts.gstatic.com',
      ],

      // Form submission targets
      'form-action': ["'self'"],

      // Frame ancestors (prevents clickjacking)
      'frame-ancestors': ["'none'"],

      // Base URI restriction
      'base-uri': ["'self'"],

      // Disable plugins (deprecated but useful for older browsers)
      'object-src': ["'none'"],

      // Media from same origin only
      'media-src': ["'self'"],

      // Connections to WebSockets, HTTP/HTTPS, data URIs
      'connect-src': [
        "'self'",
        // Allow connections to your API endpoints
        // 'https://api.example.com',
        // Allow WebSocket connections if needed
        // 'wss://example.com',
      ],

      // Child frames
      'child-src': ["'self'"],

      // Worker scripts
      'worker-src': ["'self'"],

      // Manifest
      'manifest-src': ["'self'"],
    };

    // If not in development, add stricter policies
    if (!this.isDevelopment) {
      // Remove unsafe-inline from script-src in production
      policies['script-src'] = [
        "'self'",
        // Add SRI (Subresource Integrity) hashes for critical scripts
      ];

      // Consider removing unsafe-inline from style-src in production if possible
      // policies['style-src'] = ["'self'"];
    }

    // Convert policy object to string
    const policyString = Object.entries(policies)
      .filter(([, directives]) => directives && directives.length > 0)
      .map(([directive, values]) => {
        const directiveValues = values.join(' ');
        return `${directive} ${directiveValues}`;
      })
      .join('; ');

    // Add report-uri in production for CSP violations (optional)
    const reportUri = process.env.CSP_REPORT_URI;
    if (reportUri && !this.isDevelopment) {
      return `${policyString}; report-uri ${reportUri}`;
    }

    this.logger.debug('Content-Security-Policy applied successfully');
    return policyString;
  }
}

/**
 * Helper type for security header options
 */
export interface SecurityHeaderOptions {
  enableHSTS?: boolean;
  hstsMaxAge?: number;
  enableCSP?: boolean;
  cspReportUri?: string;
  enablePermissionsPolicy?: boolean;
  customHeaders?: Record<string, string>;
}

/**
 * Factory function to create a configured instance of the middleware
 */
export function createSecurityHeadersMiddleware(
  options: SecurityHeaderOptions = {},
): SecurityHeadersMiddleware {
  // Could extend the middleware class to accept options
  return new SecurityHeadersMiddleware();
}
