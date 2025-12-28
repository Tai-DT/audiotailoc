import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface LogContext {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    ip?: string;
    userAgent?: string;
    method?: string;
    url?: string;
    statusCode?: number;
    duration?: number;
    [key: string]: any;
}
export interface ErrorContext extends LogContext {
    error?: Error;
    stack?: string;
    errorCode?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}
export declare class LoggingService {
    private readonly config;
    private readonly prisma;
    private readonly logger;
    private readonly nestLogger;
    constructor(config: ConfigService, prisma: PrismaService);
    private createWinstonLogger;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: ErrorContext): void;
    logRequest(context: LogContext): void;
    logSecurity(event: string, context: LogContext): void;
    logAudit(action: string, context: LogContext): void;
    logPerformance(metric: string, value: number, context?: LogContext): void;
    logBusinessEvent(event: string, context: LogContext): void;
    logDatabaseQuery(query: string, duration: number, context?: LogContext): void;
    logExternalService(service: string, operation: string, duration: number, success: boolean, context?: LogContext): void;
    logUserActivity(userId: string, action: string, context?: LogContext): void;
    private saveActivityLog;
    logPayment(transactionId: string, amount: number, status: string, context?: LogContext): void;
    logSystemHealth(component: string, status: 'healthy' | 'degraded' | 'unhealthy', details?: any): void;
    getLogStats(timeRange?: 'hour' | 'day' | 'week'): Promise<{
        totalLogs: number;
        errorCount: number;
        warnCount: number;
        topErrors: Array<{
            message: string;
            count: number;
        }>;
        topEndpoints: Array<{
            endpoint: string;
            count: number;
            avgDuration: number;
        }>;
        userActivity: Array<{
            userId: string;
            actionCount: number;
        }>;
    }>;
    private getTimeRangeMs;
    private formatContext;
    private formatErrorContext;
    private sanitizeQuery;
    private sendToErrorTracking;
    cleanupLogs(retentionDays?: number): Promise<void>;
    exportLogs(startDate: Date, endDate: Date, format?: 'json' | 'csv'): Promise<string>;
}
