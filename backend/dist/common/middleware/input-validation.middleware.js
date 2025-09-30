"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationMiddleware = void 0;
exports.IsSecureString = IsSecureString;
exports.IsSecureEmail = IsSecureEmail;
exports.IsSecurePhoneNumber = IsSecurePhoneNumber;
exports.IsStrongPassword = IsStrongPassword;
const common_1 = require("@nestjs/common");
const security_service_1 = require("../../modules/security/security.service");
let InputValidationMiddleware = class InputValidationMiddleware {
    constructor(securityService) {
        this.securityService = securityService;
    }
    use(req, res, next) {
        try {
            if (req.body && typeof req.body === 'object') {
                req.body = this.sanitizeObject(req.body);
            }
            if (req.query && typeof req.query === 'object') {
                req.query = this.sanitizeObject(req.query);
            }
            if (req.params && typeof req.params === 'object') {
                req.params = this.sanitizeObject(req.params);
            }
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
                if (suspiciousActivity.riskScore >= 5) {
                    throw new common_1.BadRequestException('Request blocked due to security concerns');
                }
            }
            const contentLength = parseInt(req.get('Content-Length') || '0');
            const maxSize = this.getMaxContentLength(req.path);
            if (contentLength > maxSize) {
                throw new common_1.BadRequestException(`Request too large. Maximum size: ${maxSize} bytes`);
            }
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                this.validateContentType(req);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
    sanitizeObject(obj) {
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
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                const sanitizedKey = this.securityService.sanitizeInput(key);
                if (this.isDangerousKey(sanitizedKey)) {
                    continue;
                }
                sanitized[sanitizedKey] = this.sanitizeObject(value);
            }
            return sanitized;
        }
        return obj;
    }
    isDangerousKey(key) {
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
    getMaxContentLength(path) {
        if (path.includes('/upload') || path.includes('/files')) {
            return 10 * 1024 * 1024;
        }
        if (path.includes('/api/products') && path.includes('images')) {
            return 5 * 1024 * 1024;
        }
        if (path.includes('/api/support/tickets')) {
            return 1 * 1024 * 1024;
        }
        return 100 * 1024;
    }
    validateContentType(req) {
        const contentType = req.get('Content-Type') || '';
        const path = req.path;
        if (path.includes('/api/')) {
            if (!contentType.includes('application/json') &&
                !contentType.includes('multipart/form-data') &&
                !contentType.includes('application/x-www-form-urlencoded')) {
                throw new common_1.BadRequestException('Invalid content type for API endpoint');
            }
        }
        if (path.includes('/upload') || path.includes('/files')) {
            if (!contentType.includes('multipart/form-data')) {
                throw new common_1.BadRequestException('File uploads must use multipart/form-data');
            }
        }
        const dangerousTypes = [
            'text/html',
            'application/javascript',
            'text/javascript',
            'application/x-httpd-php',
            'application/x-sh',
        ];
        if (dangerousTypes.some(type => contentType.includes(type))) {
            throw new common_1.BadRequestException('Content type not allowed');
        }
    }
};
exports.InputValidationMiddleware = InputValidationMiddleware;
exports.InputValidationMiddleware = InputValidationMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [security_service_1.SecurityService])
], InputValidationMiddleware);
const class_validator_1 = require("class-validator");
function IsSecureString(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSecureString',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, _args) {
                    if (typeof value !== 'string')
                        return false;
                    const xssPatterns = [
                        /<script[^>]*>.*?<\/script>/gi,
                        /javascript:/gi,
                        /on\w+\s*=/gi,
                        /<iframe[^>]*>.*?<\/iframe>/gi,
                    ];
                    return !xssPatterns.some(pattern => pattern.test(value));
                },
                defaultMessage(args) {
                    return `${args.property} contains potentially dangerous content`;
                },
            },
        });
    };
}
function IsSecureEmail(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSecureEmail',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, _args) {
                    if (typeof value !== 'string')
                        return false;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value))
                        return false;
                    const suspiciousPatterns = [
                        /javascript:/gi,
                        /<script/gi,
                        /on\w+=/gi,
                    ];
                    return !suspiciousPatterns.some(pattern => pattern.test(value));
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid and secure email address`;
                },
            },
        });
    };
}
function IsSecurePhoneNumber(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSecurePhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, _args) {
                    if (typeof value !== 'string')
                        return false;
                    const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
                    const cleanPhone = value.replace(/\s/g, '');
                    return phoneRegex.test(cleanPhone);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid Vietnamese phone number`;
                },
            },
        });
    };
}
function IsStrongPassword(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isStrongPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, _args) {
                    if (typeof value !== 'string')
                        return false;
                    const minLength = 8;
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumbers = /\d/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                    return value.length >= minLength &&
                        hasUpperCase &&
                        hasLowerCase &&
                        hasNumbers &&
                        hasSpecialChar;
                },
                defaultMessage(args) {
                    return `${args.property} must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters`;
                },
            },
        });
    };
}
//# sourceMappingURL=input-validation.middleware.js.map