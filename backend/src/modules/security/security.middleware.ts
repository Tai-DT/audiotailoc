import { Injectable, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from './security.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly blockedIPs = new Set<string>();
  private readonly suspiciousRequests = new Map<string, number>();
  private readonly rateLimit = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private securityService: SecurityService,
    private configService: ConfigService,
  ) {
    // Initialize blocked IPs from config
    const blockedIPs = this.configService.get('BLOCKED_IPS', '');
    if (blockedIPs) {
      blockedIPs.split(',').forEach((ip: string) => this.blockedIPs.add(ip.trim()));
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    const clientIP = this.getClientIP(req);
    const userAgent = req.get('User-Agent') || '';
    const now = Date.now();

    // 1. Check blocked IPs
    if (this.blockedIPs.has(clientIP)) {
      this.securityService.logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        details: {
          path: req.path,
          method: req.method,
          reason: 'blocked_ip_access',
        },
      });
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    // 2. Check suspicious patterns
    if (this.isSuspiciousRequest(req)) {
      this.handleSuspiciousRequest(clientIP, req);
      return;
    }

    // 3. Rate limiting
    if (this.isRateLimited(clientIP, now)) {
      this.securityService.logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        details: {
          path: req.path,
          method: req.method,
          reason: 'rate_limit_exceeded',
        },
      });
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    // 4. SQL Injection detection
    if (this.containsSQLInjection(req)) {
      this.securityService.logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        details: {
          path: req.path,
          method: req.method,
          reason: 'sql_injection_attempt',
          query: req.query,
          body: req.body,
        },
      });
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }

    // 5. XSS detection
    if (this.containsXSS(req)) {
      this.securityService.logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        details: {
          path: req.path,
          method: req.method,
          reason: 'xss_attempt',
          query: req.query,
          body: req.body,
        },
      });
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }

    // 6. Add security headers
    this.addSecurityHeaders(res);

    // 7. Log security event
    this.securityService.logSecurityEvent({
      type: 'data_access',
      ip: clientIP,
      userAgent,
      details: {
        path: req.path,
        method: req.method,
        reason: 'request_processed',
      },
    });

    next();
  }

  private getClientIP(req: Request): string {
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      'unknown'
    ).split(',')[0].trim();
  }

  private isSuspiciousRequest(req: Request): boolean {
    const userAgent = req.get('User-Agent') || '';
    const path = req.path;

    // Check for common attack patterns
    const suspiciousPatterns = [
      /\.\.\//, // Directory traversal
      /<script/i, // Script tags
      /javascript:/i, // JavaScript protocol
      /onload=/i, // Event handlers
      /onerror=/i,
    ];

    return suspiciousPatterns.some(pattern =>
      pattern.test(path) ||
      pattern.test(userAgent) ||
      pattern.test(JSON.stringify(req.query)) ||
      pattern.test(JSON.stringify(req.body))
    );
  }

  private handleSuspiciousRequest(ip: string, req: Request) {
    const currentCount = this.suspiciousRequests.get(ip) || 0;
    this.suspiciousRequests.set(ip, currentCount + 1);

    // Block IP after 5 suspicious requests
    if (currentCount >= 5) {
      this.blockedIPs.add(ip);
      this.securityService.logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent: '',
        details: {
          reason: 'too_many_suspicious_requests',
        },
      });
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    throw new HttpException('Suspicious request detected', HttpStatus.BAD_REQUEST);
  }

  private isRateLimited(ip: string, now: number): boolean {
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100; // requests per window

    const current = this.rateLimit.get(ip);

    if (!current || now > current.resetTime) {
      this.rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (current.count >= maxRequests) {
      return true;
    }

    current.count++;
    return false;
  }

  private containsSQLInjection(req: Request): boolean {
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // Single quotes, comments
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, // Union selects
      /\w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, // OR statements
      /((\%27)|(\'))union/i, // Union injections
      /exec(\s|\+)+(s|x)p\w+/i, // exec xp
    ];

    const checkString = JSON.stringify({
      query: req.query,
      body: req.body,
      params: req.params,
    });

    return sqlPatterns.some(pattern => pattern.test(checkString));
  }

  private containsXSS(req: Request): boolean {
    const xssPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe[^>]*>[\s\S]*?<\/iframe>/i,
      /<object[^>]*>[\s\S]*?<\/object>/i,
      /<embed[^>]*>[\s\S]*?<\/embed>/i,
      /<form[^>]*>[\s\S]*?<\/form>/i,
      /document\.(cookie|write|location)/i,
      /eval\s*\(/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
    ];

    const checkString = JSON.stringify({
      query: req.query,
      body: req.body,
      headers: req.headers,
    });

    return xssPatterns.some(pattern => pattern.test(checkString));
  }

  private addSecurityHeaders(res: Response) {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self'; " +
      "media-src 'self'; " +
      "object-src 'none'; " +
      "child-src 'none'; " +
      "worker-src 'none'; " +
      "frame-ancestors 'none';"
    );

    // Strict Transport Security (for HTTPS)
    if (this.configService.get('NODE_ENV') === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // Feature Policy
    res.setHeader('Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()'
    );
  }
}
