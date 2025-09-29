import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MonitoringService } from '../../modules/monitoring/monitoring.service';
export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
        path: string;
        correlationId?: string;
        stack?: string;
    };
}
export declare class EnhancedExceptionFilter implements ExceptionFilter {
    private configService;
    private monitoringService;
    private readonly logger;
    constructor(configService: ConfigService, monitoringService: MonitoringService);
    catch(exception: any, host: ArgumentsHost): void;
    private generateCorrelationId;
    private getClientIP;
    private getErrorDetails;
    private getErrorCode;
    private shouldIncludeDetails;
    private shouldIncludeStack;
    private logError;
}
