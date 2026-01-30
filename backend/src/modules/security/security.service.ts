import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Request } from 'express';

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number; // in minutes
  enableTwoFactor: boolean;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();
  private readonly securityConfig: SecurityConfig;
  private readonly disableLoginLockout: boolean;

  constructor(private readonly config: ConfigService) {
    const nodeEnv = (this.config.get<string>('NODE_ENV') || 'development').toLowerCase();
    const disableLoginLockoutEnv = (
      this.config.get<string>('DISABLE_LOGIN_LOCKOUT') || ''
    ).toLowerCase();
    // Default: disable lockout in development to avoid dev UX issues.
    // Override: set DISABLE_LOGIN_LOCKOUT=false to re-enable even in development.
    this.disableLoginLockout =
      disableLoginLockoutEnv === 'true' ||
      (nodeEnv === 'development' && disableLoginLockoutEnv !== 'false');

    this.securityConfig = {
      maxLoginAttempts: this.config.get<number>('MAX_LOGIN_ATTEMPTS') || 5,
      lockoutDuration: this.config.get<number>('LOCKOUT_DURATION') || 15,
      passwordMinLength: this.config.get<number>('PASSWORD_MIN_LENGTH') || 8,
      passwordRequireSpecialChars: this.config.get<boolean>('PASSWORD_REQUIRE_SPECIAL') || true,
      sessionTimeout: this.config.get<number>('SESSION_TIMEOUT') || 60,
      enableTwoFactor: this.config.get<boolean>('ENABLE_2FA') || false,
    };
  }

  // Password security
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string | null | undefined): Promise<boolean> {
    if (!hash) return false;
    return bcrypt.compare(password, hash);
  }

  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    // Length check
    if (password.length < this.securityConfig.passwordMinLength) {
      errors.push(
        `Password must be at least ${this.securityConfig.passwordMinLength} characters long`,
      );
    } else {
      score += 1;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    // Special character check
    if (
      this.securityConfig.passwordRequireSpecialChars &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push('Password must contain at least one special character');
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    }

    // Common password check
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common, please choose a more unique password');
      score = Math.max(0, score - 2);
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.min(5, score),
    };
  }

  // Login attempt tracking
  recordLoginAttempt(identifier: string, success: boolean): boolean {
    if (this.disableLoginLockout) {
      // Don't track attempts in development when lockout is disabled.
      if (this.loginAttempts.has(identifier)) this.loginAttempts.delete(identifier);
      return true;
    }

    const now = new Date();
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt) {
      this.loginAttempts.set(identifier, {
        count: success ? 0 : 1,
        lastAttempt: now,
      });
      return true;
    }

    // Check if lockout period has expired
    const lockoutExpiry = new Date(
      attempt.lastAttempt.getTime() + this.securityConfig.lockoutDuration * 60000,
    );
    if (now > lockoutExpiry) {
      this.loginAttempts.set(identifier, {
        count: success ? 0 : 1,
        lastAttempt: now,
      });
      return true;
    }

    if (success) {
      this.loginAttempts.delete(identifier);
      return true;
    }

    // Failed attempt
    attempt.count++;
    attempt.lastAttempt = now;

    if (attempt.count >= this.securityConfig.maxLoginAttempts) {
      this.logger.warn(`Account locked due to too many failed attempts: ${identifier}`);
      return false;
    }

    return true;
  }

  isAccountLocked(identifier: string): boolean {
    if (this.disableLoginLockout) return false;

    const attempt = this.loginAttempts.get(identifier);
    if (!attempt) return false;

    const now = new Date();
    const lockoutExpiry = new Date(
      attempt.lastAttempt.getTime() + this.securityConfig.lockoutDuration * 60000,
    );

    if (now > lockoutExpiry) {
      this.loginAttempts.delete(identifier);
      return false;
    }

    return attempt.count >= this.securityConfig.maxLoginAttempts;
  }

  getRemainingLockoutTime(identifier: string): number {
    if (this.disableLoginLockout) return 0;

    const attempt = this.loginAttempts.get(identifier);
    if (!attempt) return 0;

    const now = new Date();
    const lockoutExpiry = new Date(
      attempt.lastAttempt.getTime() + this.securityConfig.lockoutDuration * 60000,
    );

    return Math.max(0, lockoutExpiry.getTime() - now.getTime());
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  validatePhoneNumber(phone: string): boolean {
    // Vietnamese phone number validation
    const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // CSRF protection
  generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken && token.length === 64;
  }

  // Request validation
  validateRequestOrigin(request: Request, allowedOrigins: string[]): boolean {
    const origin = request.get('Origin') || request.get('Referer');
    if (!origin) return false;

    return allowedOrigins.some(allowed => origin.startsWith(allowed));
  }

  detectSuspiciousActivity(request: Request): {
    isSuspicious: boolean;
    reasons: string[];
    riskScore: number;
  } {
    const reasons: string[] = [];
    let riskScore = 0;

    // Check for suspicious user agents
    const userAgent = request.get('User-Agent') || '';
    if (this.isSuspiciousUserAgent(userAgent)) {
      reasons.push('Suspicious user agent detected');
      riskScore += 3;
    }

    // Check for suspicious headers
    const suspiciousHeaders = ['X-Forwarded-For', 'X-Real-IP'];
    suspiciousHeaders.forEach(header => {
      const value = request.get(header);
      if (value && this.isSuspiciousIP(value)) {
        reasons.push(`Suspicious IP in ${header}`);
        riskScore += 2;
      }
    });

    // Check request size
    const contentLength = parseInt(request.get('Content-Length') || '0');
    if (contentLength > 10 * 1024 * 1024) {
      // 10MB
      reasons.push('Unusually large request');
      riskScore += 2;
    }

    // Check for SQL injection patterns
    const queryString = request.url.split('?')[1] || '';
    if (this.containsSQLInjectionPatterns(queryString)) {
      reasons.push('Potential SQL injection attempt');
      riskScore += 5;
    }

    // Check for XSS patterns
    if (this.containsXSSPatterns(queryString)) {
      reasons.push('Potential XSS attempt');
      riskScore += 4;
    }

    return {
      isSuspicious: riskScore >= 3,
      reasons,
      riskScore,
    };
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': this.getCSPHeader(),
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  private getCSPHeader(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.audiotailoc.com wss://api.audiotailoc.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];

    return csp.join('; ');
  }

  // Two-factor authentication
  generateTOTPSecret(): string {
    // base32 is not a valid BufferEncoding; generate hex and convert to a base32-like charset
    const hex = crypto.randomBytes(20).toString('hex');
    return hex.toUpperCase();
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // Audit logging
  logSecurityEvent(event: {
    type:
      | 'login_attempt'
      | 'password_change'
      | 'account_locked'
      | 'suspicious_activity'
      | 'data_access';
    userId?: string;
    ip: string;
    userAgent: string;
    details?: any;
  }): void {
    this.logger.warn(`Security Event: ${event.type}`, {
      ...event,
      timestamp: new Date().toISOString(),
    });
  }

  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      'dragon',
      'master',
      'shadow',
      'football',
      'baseball',
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private isSuspiciousIP(ip: string): boolean {
    // Check for private IP ranges that shouldn't be in forwarded headers
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
    ];

    return privateRanges.some(range => range.test(ip));
  }

  private containsSQLInjectionPatterns(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(--|\/\*|\*\/)/,
      /(\bxp_cmdshell\b)/i,
      /(\bsp_executesql\b)/i,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  private containsXSSPatterns(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}
