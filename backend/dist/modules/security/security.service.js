"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SecurityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
let SecurityService = SecurityService_1 = class SecurityService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SecurityService_1.name);
        this.loginAttempts = new Map();
        this.securityConfig = {
            maxLoginAttempts: this.config.get('MAX_LOGIN_ATTEMPTS') || 5,
            lockoutDuration: this.config.get('LOCKOUT_DURATION') || 15,
            passwordMinLength: this.config.get('PASSWORD_MIN_LENGTH') || 8,
            passwordRequireSpecialChars: this.config.get('PASSWORD_REQUIRE_SPECIAL') || true,
            sessionTimeout: this.config.get('SESSION_TIMEOUT') || 60,
            enableTwoFactor: this.config.get('ENABLE_2FA') || false,
        };
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    validatePasswordStrength(password) {
        const errors = [];
        let score = 0;
        if (password.length < this.securityConfig.passwordMinLength) {
            errors.push(`Password must be at least ${this.securityConfig.passwordMinLength} characters long`);
        }
        else {
            score += 1;
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        else {
            score += 1;
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        else {
            score += 1;
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        else {
            score += 1;
        }
        if (this.securityConfig.passwordRequireSpecialChars &&
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 1;
        }
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
    recordLoginAttempt(identifier, success) {
        const now = new Date();
        const attempt = this.loginAttempts.get(identifier);
        if (!attempt) {
            this.loginAttempts.set(identifier, {
                count: success ? 0 : 1,
                lastAttempt: now,
            });
            return true;
        }
        const lockoutExpiry = new Date(attempt.lastAttempt.getTime() + this.securityConfig.lockoutDuration * 60000);
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
        attempt.count++;
        attempt.lastAttempt = now;
        if (attempt.count >= this.securityConfig.maxLoginAttempts) {
            this.logger.warn(`Account locked due to too many failed attempts: ${identifier}`);
            return false;
        }
        return true;
    }
    isAccountLocked(identifier) {
        const attempt = this.loginAttempts.get(identifier);
        if (!attempt)
            return false;
        const now = new Date();
        const lockoutExpiry = new Date(attempt.lastAttempt.getTime() + this.securityConfig.lockoutDuration * 60000);
        if (now > lockoutExpiry) {
            this.loginAttempts.delete(identifier);
            return false;
        }
        return attempt.count >= this.securityConfig.maxLoginAttempts;
    }
    getRemainingLockoutTime(identifier) {
        const attempt = this.loginAttempts.get(identifier);
        if (!attempt)
            return 0;
        const now = new Date();
        const lockoutExpiry = new Date(attempt.lastAttempt.getTime() + this.securityConfig.lockoutDuration * 60000);
        return Math.max(0, lockoutExpiry.getTime() - now.getTime());
    }
    sanitizeInput(input) {
        if (typeof input !== 'string')
            return '';
        return input
            .trim()
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .substring(0, 1000);
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    validatePhoneNumber(phone) {
        const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    generateCSRFToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    validateCSRFToken(token, sessionToken) {
        return token === sessionToken && token.length === 64;
    }
    validateRequestOrigin(request, allowedOrigins) {
        const origin = request.get('Origin') || request.get('Referer');
        if (!origin)
            return false;
        return allowedOrigins.some(allowed => origin.startsWith(allowed));
    }
    detectSuspiciousActivity(request) {
        const reasons = [];
        let riskScore = 0;
        const userAgent = request.get('User-Agent') || '';
        if (this.isSuspiciousUserAgent(userAgent)) {
            reasons.push('Suspicious user agent detected');
            riskScore += 3;
        }
        const suspiciousHeaders = ['X-Forwarded-For', 'X-Real-IP'];
        suspiciousHeaders.forEach(header => {
            const value = request.get(header);
            if (value && this.isSuspiciousIP(value)) {
                reasons.push(`Suspicious IP in ${header}`);
                riskScore += 2;
            }
        });
        const contentLength = parseInt(request.get('Content-Length') || '0');
        if (contentLength > 10 * 1024 * 1024) {
            reasons.push('Unusually large request');
            riskScore += 2;
        }
        const queryString = request.url.split('?')[1] || '';
        if (this.containsSQLInjectionPatterns(queryString)) {
            reasons.push('Potential SQL injection attempt');
            riskScore += 5;
        }
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
    getSecurityHeaders() {
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
    getCSPHeader() {
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
    generateTOTPSecret() {
        const hex = crypto.randomBytes(20).toString('hex');
        return hex.toUpperCase();
    }
    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        return codes;
    }
    logSecurityEvent(event) {
        this.logger.warn(`Security Event: ${event.type}`, {
            ...event,
            timestamp: new Date().toISOString(),
        });
    }
    isCommonPassword(password) {
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
    isSuspiciousUserAgent(userAgent) {
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
    isSuspiciousIP(ip) {
        const privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[01])\./,
            /^192\.168\./,
            /^127\./,
            /^169\.254\./,
        ];
        return privateRanges.some(range => range.test(ip));
    }
    containsSQLInjectionPatterns(input) {
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
            /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
            /(--|\/\*|\*\/)/,
            /(\bxp_cmdshell\b)/i,
            /(\bsp_executesql\b)/i,
        ];
        return sqlPatterns.some(pattern => pattern.test(input));
    }
    containsXSSPatterns(input) {
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /<object[^>]*>.*?<\/object>/gi,
        ];
        return xssPatterns.some(pattern => pattern.test(input));
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = SecurityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SecurityService);
//# sourceMappingURL=security.service.js.map