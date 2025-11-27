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
exports.SecurityMiddleware = void 0;
const common_1 = require("@nestjs/common");
const security_service_1 = require("./security.service");
const config_1 = require("@nestjs/config");
let SecurityMiddleware = class SecurityMiddleware {
    constructor(securityService, configService) {
        this.securityService = securityService;
        this.configService = configService;
        this.blockedIPs = new Set();
        this.suspiciousRequests = new Map();
        this.rateLimit = new Map();
        const blockedIPs = this.configService.get('BLOCKED_IPS', '');
        if (blockedIPs) {
            blockedIPs.split(',').forEach((ip) => this.blockedIPs.add(ip.trim()));
        }
    }
    use(req, res, next) {
        const clientIP = this.getClientIP(req);
        const userAgent = req.get('User-Agent') || '';
        const now = Date.now();
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
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        if (this.isSuspiciousRequest(req)) {
            this.handleSuspiciousRequest(clientIP, req);
            return;
        }
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
            throw new common_1.HttpException('Too many requests', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
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
            throw new common_1.HttpException('Invalid request', common_1.HttpStatus.BAD_REQUEST);
        }
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
            throw new common_1.HttpException('Invalid request', common_1.HttpStatus.BAD_REQUEST);
        }
        this.addSecurityHeaders(res);
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
    getClientIP(req) {
        return (req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            'unknown')
            .split(',')[0]
            .trim();
    }
    isSuspiciousRequest(req) {
        const userAgent = req.get('User-Agent') || '';
        const path = req.path;
        const suspiciousPatterns = [
            /\.\.\//,
            /<script/i,
            /javascript:/i,
            /onload=/i,
            /onerror=/i,
        ];
        return suspiciousPatterns.some(pattern => pattern.test(path) ||
            pattern.test(userAgent) ||
            pattern.test(JSON.stringify(req.query)) ||
            pattern.test(JSON.stringify(req.body)));
    }
    handleSuspiciousRequest(ip, _req) {
        const currentCount = this.suspiciousRequests.get(ip) || 0;
        this.suspiciousRequests.set(ip, currentCount + 1);
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
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        throw new common_1.HttpException('Suspicious request detected', common_1.HttpStatus.BAD_REQUEST);
    }
    isRateLimited(ip, now) {
        const isDevelopment = this.configService.get('NODE_ENV') === 'development';
        const windowMs = isDevelopment ? 60 * 1000 : 15 * 60 * 1000;
        const maxRequests = isDevelopment ? 1000 : 100;
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
    containsSQLInjection(req) {
        const sqlPatterns = [
            /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
            /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
            /\w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
            /((\%27)|(\'))union/i,
            /exec(\s|\+)+(s|x)p\w+/i,
        ];
        const checkString = JSON.stringify({
            query: req.query,
            body: req.body,
            params: req.params,
        });
        return sqlPatterns.some(pattern => pattern.test(checkString));
    }
    containsXSS(req) {
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
    addSecurityHeaders(res) {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Content-Security-Policy', "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self'; " +
            "connect-src 'self'; " +
            "media-src 'self'; " +
            "object-src 'none'; " +
            "child-src 'none'; " +
            "worker-src 'none'; " +
            "frame-ancestors 'none';");
        if (this.configService.get('NODE_ENV') === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
exports.SecurityMiddleware = SecurityMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [security_service_1.SecurityService,
        config_1.ConfigService])
], SecurityMiddleware);
//# sourceMappingURL=security.middleware.js.map