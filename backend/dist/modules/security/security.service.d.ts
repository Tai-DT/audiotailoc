import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export interface SecurityConfig {
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    enableTwoFactor: boolean;
}
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
export declare class SecurityService {
    private readonly config;
    private readonly logger;
    private readonly loginAttempts;
    private readonly securityConfig;
    private readonly disableLoginLockout;
    constructor(config: ConfigService);
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
        score: number;
    };
    recordLoginAttempt(identifier: string, success: boolean): boolean;
    isAccountLocked(identifier: string): boolean;
    getRemainingLockoutTime(identifier: string): number;
    sanitizeInput(input: string): string;
    validateEmail(email: string): boolean;
    validatePhoneNumber(phone: string): boolean;
    generateCSRFToken(): string;
    validateCSRFToken(token: string, sessionToken: string): boolean;
    validateRequestOrigin(request: Request, allowedOrigins: string[]): boolean;
    detectSuspiciousActivity(request: Request): {
        isSuspicious: boolean;
        reasons: string[];
        riskScore: number;
    };
    getSecurityHeaders(): Record<string, string>;
    private getCSPHeader;
    generateTOTPSecret(): string;
    generateBackupCodes(): string[];
    logSecurityEvent(event: {
        type: 'login_attempt' | 'password_change' | 'account_locked' | 'suspicious_activity' | 'data_access';
        userId?: string;
        ip: string;
        userAgent: string;
        details?: any;
    }): void;
    private isCommonPassword;
    private isSuspiciousUserAgent;
    private isSuspiciousIP;
    private containsSQLInjectionPatterns;
    private containsXSSPatterns;
}
