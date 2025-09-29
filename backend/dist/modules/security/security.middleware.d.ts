import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from './security.service';
import { ConfigService } from '@nestjs/config';
export declare class SecurityMiddleware implements NestMiddleware {
    private securityService;
    private configService;
    private readonly blockedIPs;
    private readonly suspiciousRequests;
    private readonly rateLimit;
    constructor(securityService: SecurityService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): void;
    private getClientIP;
    private isSuspiciousRequest;
    private handleSuspiciousRequest;
    private isRateLimited;
    private containsSQLInjection;
    private containsXSS;
    private addSecurityHeaders;
}
