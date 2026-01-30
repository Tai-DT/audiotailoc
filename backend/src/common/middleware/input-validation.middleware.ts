import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../../modules/security/security.service';

@Injectable()
export class InputValidationMiddleware implements NestMiddleware {
  constructor(private readonly securityService: SecurityService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate and sanitize request body
      if (req.body && typeof req.body === 'object') {
        req.body = this.sanitizeObject(req.body);
      }

      // Validate and sanitize query parameters
      if (req.query && typeof req.query === 'object') {
        req.query = this.sanitizeObject(req.query);
      }

      // Validate and sanitize URL parameters
      if (req.params && typeof req.params === 'object') {
        req.params = this.sanitizeObject(req.params);
      }

      // Check for suspicious activity
      const suspiciousActivity = this.securityService.detectSuspiciousActivity(req);
      if (suspiciousActivity.isSuspicious) {
        this.securityService.logSecurityEvent({
          type: 'suspicious_activity',
          ip: req.ip || '',
          userAgent: req.get('User-Agent') || '',
          details: {
            reasons: suspiciousActivity.reasons,
            riskScore: suspiciousActivity.riskScore,
            path: req.path,
            method: req.method,
          },
        });

        // Block high-risk requests
        if (suspiciousActivity.riskScore >= 5) {
          throw new BadRequestException('Request blocked due to security concerns');
        }
      }

      // Validate content length
      const contentLength = parseInt(req.get('Content-Length') || '0');
      const maxSize = this.getMaxContentLength(req.path);
      if (contentLength > maxSize) {
        throw new BadRequestException(`Request too large. Maximum size: ${maxSize} bytes`);
      }

      // Validate content type for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        this.validateContentType(req);
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.securityService.sanitizeInput(obj);
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};

      for (const [key, value] of Object.entries(obj)) {
        // Sanitize the key
        const sanitizedKey = this.securityService.sanitizeInput(key);

        // Skip potentially dangerous keys
        if (this.isDangerousKey(sanitizedKey)) {
          continue;
        }

        // Recursively sanitize the value
        sanitized[sanitizedKey] = this.sanitizeObject(value);
      }

      return sanitized;
    }

    return obj;
  }

  private isDangerousKey(key: string): boolean {
    const dangerousKeys = [
      '__proto__',
      'constructor',
      'prototype',
      'eval',
      'function',
      'script',
      'javascript',
    ];

    return dangerousKeys.some(dangerous => key.toLowerCase().includes(dangerous.toLowerCase()));
  }

  private getMaxContentLength(path: string): number {
    // Different limits for different endpoints
    if (path.includes('/upload') || path.includes('/files')) {
      return 10 * 1024 * 1024; // 10MB for file uploads
    }

    if (path.includes('/api/products') && path.includes('images')) {
      return 5 * 1024 * 1024; // 5MB for product images
    }

    if (path.includes('/api/support/tickets')) {
      return 1 * 1024 * 1024; // 1MB for support tickets (may include attachments)
    }

    // Default limit for regular API requests
    return 100 * 1024; // 100KB
  }

  private validateContentType(req: Request): void {
    const contentType = req.get('Content-Type') || '';
    const path = req.path;

    // Allow JSON for API endpoints
    if (path.includes('/api/')) {
      if (
        !contentType.includes('application/json') &&
        !contentType.includes('multipart/form-data') &&
        !contentType.includes('application/x-www-form-urlencoded')
      ) {
        throw new BadRequestException('Invalid content type for API endpoint');
      }
    }

    // Validate file upload content types
    if (path.includes('/upload') || path.includes('/files')) {
      if (!contentType.includes('multipart/form-data')) {
        throw new BadRequestException('File uploads must use multipart/form-data');
      }
    }

    // Block potentially dangerous content types
    const dangerousTypes = [
      'text/html',
      'application/javascript',
      'text/javascript',
      'application/x-httpd-php',
      'application/x-sh',
    ];

    if (dangerousTypes.some(type => contentType.includes(type))) {
      throw new BadRequestException('Content type not allowed');
    }
  }
}

// Validation decorators for DTOs
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsSecureString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSecureString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Check for XSS patterns
          const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
          ];

          return !xssPatterns.some(pattern => pattern.test(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains potentially dangerous content`;
        },
      },
    });
  };
}

export function IsSecureEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSecureEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return false;

          // Check for suspicious patterns
          const suspiciousPatterns = [/javascript:/gi, /<script/gi, /on\w+=/gi];

          return !suspiciousPatterns.some(pattern => pattern.test(value));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid and secure email address`;
        },
      },
    });
  };
}

export function IsSecurePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSecurePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Vietnamese phone number validation
          const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
          const cleanPhone = value.replace(/\s/g, '');

          return phoneRegex.test(cleanPhone);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Vietnamese phone number`;
        },
      },
    });
  };
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Password strength validation
          const minLength = 8;
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

          return (
            value.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters`;
        },
      },
    });
  };
}
