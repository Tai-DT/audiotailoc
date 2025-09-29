import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggingService } from './logging.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly loggingService;
    private readonly logger;
    constructor(loggingService: LoggingService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private extractUserId;
    private getClientIP;
    private getResponseSize;
}
