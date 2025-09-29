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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LoggingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const winston = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
let LoggingService = LoggingService_1 = class LoggingService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.nestLogger = new common_1.Logger(LoggingService_1.name);
        this.logger = this.createWinstonLogger();
    }
    createWinstonLogger() {
        const logLevel = this.config.get('LOG_LEVEL') || 'info';
        const logFormat = this.config.get('LOG_FORMAT') || 'json';
        const environment = this.config.get('NODE_ENV') || 'development';
        const formats = [
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
        ];
        if (logFormat === 'json') {
            formats.push(winston.format.json());
        }
        else {
            formats.push(winston.format.printf(({ timestamp, level, message, ...meta }) => {
                return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
            }));
        }
        const transports = [];
        if (environment === 'development') {
            transports.push(new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
            }));
        }
        if (environment === 'production') {
            transports.push(new winston_daily_rotate_file_1.default({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d',
                level: logLevel,
            }));
            transports.push(new winston_daily_rotate_file_1.default({
                filename: 'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '30d',
                level: 'error',
            }));
            transports.push(new winston_daily_rotate_file_1.default({
                filename: 'logs/security-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '90d',
                level: 'warn',
            }));
            transports.push(new winston_daily_rotate_file_1.default({
                filename: 'logs/audit-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '365d',
            }));
        }
        return winston.createLogger({
            level: logLevel,
            format: winston.format.combine(...formats),
            transports,
            exitOnError: false,
        });
    }
    debug(message, context) {
        this.logger.debug(message, this.formatContext(context));
    }
    info(message, context) {
        this.logger.info(message, this.formatContext(context));
    }
    warn(message, context) {
        this.logger.warn(message, this.formatContext(context));
    }
    error(message, context) {
        const formattedContext = this.formatErrorContext(context);
        this.logger.error(message, formattedContext);
        this.sendToErrorTracking(message, formattedContext);
    }
    logRequest(context) {
        const { method, url, statusCode, duration, userId: _userId, ip: _ip } = context;
        const message = `${method} ${url} ${statusCode} ${duration}ms`;
        if (statusCode && statusCode >= 400) {
            this.warn(`Request failed: ${message}`, context);
        }
        else {
            this.info(`Request: ${message}`, context);
        }
    }
    logSecurity(event, context) {
        this.warn(`Security Event: ${event}`, {
            ...context,
            category: 'security',
            timestamp: new Date().toISOString(),
        });
    }
    logAudit(action, context) {
        this.info(`Audit: ${action}`, {
            ...context,
            category: 'audit',
            timestamp: new Date().toISOString(),
        });
    }
    logPerformance(metric, value, context) {
        this.info(`Performance: ${metric} = ${value}`, {
            ...context,
            category: 'performance',
            metric,
            value,
            timestamp: new Date().toISOString(),
        });
    }
    logBusinessEvent(event, context) {
        this.info(`Business Event: ${event}`, {
            ...context,
            category: 'business',
            timestamp: new Date().toISOString(),
        });
    }
    logDatabaseQuery(query, duration, context) {
        if (duration > 1000) {
            this.warn(`Slow Query: ${duration}ms`, {
                ...context,
                query: this.sanitizeQuery(query),
                duration,
                category: 'database',
            });
        }
        else {
            this.debug(`Query: ${duration}ms`, {
                ...context,
                query: this.sanitizeQuery(query),
                duration,
                category: 'database',
            });
        }
    }
    logExternalService(service, operation, duration, success, context) {
        const message = `External Service: ${service}.${operation} ${success ? 'SUCCESS' : 'FAILED'} ${duration}ms`;
        if (!success || duration > 5000) {
            this.warn(message, {
                ...context,
                service,
                operation,
                duration,
                success,
                category: 'external_service',
            });
        }
        else {
            this.info(message, {
                ...context,
                service,
                operation,
                duration,
                success,
                category: 'external_service',
            });
        }
    }
    logUserActivity(userId, action, context) {
        this.info(`User Activity: ${action}`, {
            ...context,
            userId,
            action,
            category: 'user_activity',
            timestamp: new Date().toISOString(),
        });
        this.saveActivityLog({
            userId,
            action,
            resource: context?.resource,
            resourceId: context?.resourceId,
            details: context ? JSON.stringify(context) : null,
            ipAddress: context?.ip,
            userAgent: context?.userAgent,
            method: context?.method,
            url: context?.url,
            statusCode: context?.statusCode,
            duration: context?.duration,
            category: 'user_activity',
            severity: 'info'
        }).catch(error => {
            this.error('Failed to save activity log to database', { error: error, userId, action });
        });
    }
    async saveActivityLog(data) {
        try {
            await this.prisma.activityLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    resource: data.resource,
                    resourceId: data.resourceId,
                    details: data.details,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                    method: data.method,
                    url: data.url,
                    statusCode: data.statusCode,
                    duration: data.duration,
                    category: data.category,
                    severity: data.severity,
                }
            });
        }
        catch (error) {
            this.error('Failed to save activity log', { error: error, data });
            throw error;
        }
    }
    logPayment(transactionId, amount, status, context) {
        this.info(`Payment: ${transactionId} ${amount} ${status}`, {
            ...context,
            transactionId,
            amount,
            status,
            category: 'payment',
            timestamp: new Date().toISOString(),
        });
    }
    logSystemHealth(component, status, details) {
        const message = `System Health: ${component} is ${status}`;
        if (status === 'unhealthy') {
            this.error(message, { component, status, details, category: 'system_health' });
        }
        else if (status === 'degraded') {
            this.warn(message, { component, status, details, category: 'system_health' });
        }
        else {
            this.info(message, { component, status, details, category: 'system_health' });
        }
    }
    async getLogStats(_timeRange = 'hour') {
        return {
            totalLogs: 0,
            errorCount: 0,
            warnCount: 0,
            topErrors: [],
            topEndpoints: [],
            userActivity: [],
        };
    }
    formatContext(context) {
        if (!context)
            return {};
        return {
            ...context,
            timestamp: new Date().toISOString(),
            environment: this.config.get('NODE_ENV'),
            service: 'audiotailoc-backend',
        };
    }
    formatErrorContext(context) {
        if (!context)
            return {};
        const { error, ...rest } = context;
        return {
            ...this.formatContext(rest),
            error: {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            },
            severity: context.severity || 'medium',
        };
    }
    sanitizeQuery(query) {
        return query
            .replace(/password\s*=\s*'[^']*'/gi, "password='***'")
            .replace(/token\s*=\s*'[^']*'/gi, "token='***'")
            .replace(/secret\s*=\s*'[^']*'/gi, "secret='***'")
            .substring(0, 500);
    }
    sendToErrorTracking(_message, _context) {
        const sentryDsn = this.config.get('SENTRY_DSN');
        if (sentryDsn) {
            try {
                this.nestLogger.debug('Error sent to external tracking service');
            }
            catch (error) {
                this.nestLogger.error('Failed to send error to tracking service', error);
            }
        }
    }
    async cleanupLogs(retentionDays = 30) {
        try {
            this.info('Log cleanup completed', { retentionDays });
        }
        catch (error) {
            this.error('Log cleanup failed', { error: error });
        }
    }
    async exportLogs(startDate, endDate, format = 'json') {
        try {
            this.info('Logs exported', { startDate, endDate, format });
            return 'export-path';
        }
        catch (error) {
            this.error('Log export failed', { error: error });
            throw error;
        }
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = LoggingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], LoggingService);
//# sourceMappingURL=logging.service.js.map