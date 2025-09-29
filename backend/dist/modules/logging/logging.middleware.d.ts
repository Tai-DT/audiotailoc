import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';
export declare class LoggingMiddleware implements NestMiddleware {
    private readonly loggingService;
    private readonly logger;
    constructor(loggingService: LoggingService);
    use(request: Request, response: Response, next: NextFunction): void;
    private extractUserId;
    private getClientIP;
    private sanitizeHeaders;
}
