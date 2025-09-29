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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winston = __importStar(require("winston"));
const path = __importStar(require("path"));
require("winston-daily-rotate-file");
let LoggingService = class LoggingService {
    constructor(configService) {
        this.configService = configService;
        this.contextMap = new Map();
        this.initializeWinston();
    }
    initializeWinston() {
        const logLevel = this.configService.get('LOG_LEVEL', 'info');
        const logDir = this.configService.get('LOG_DIR', './logs');
        const maxFiles = this.configService.get('LOG_MAX_FILES', '30d');
        const maxSize = this.configService.get('LOG_MAX_SIZE', '20m');
        const transports = [
            new winston.transports.Console({
                level: logLevel,
                format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const correlationId = meta.correlationId ? ` [${meta.correlationId}]` : '';
                    const context = meta.context ? ` [${meta.context}]` : '';
                    return `${timestamp} ${level}${correlationId}${context}: ${message}`;
                })),
            }),
        ];
        if (this.configService.get('NODE_ENV') === 'production') {
            transports.push(new winston.transports.DailyRotateFile({
                filename: path.join(logDir, 'error-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                maxSize: maxSize,
                maxFiles: maxFiles,
                format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
            }), new winston.transports.DailyRotateFile({
                filename: path.join(logDir, 'combined-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                maxSize: maxSize,
                maxFiles: maxFiles,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }), new winston.transports.DailyRotateFile({
                filename: path.join(logDir, 'security-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                level: 'warn',
                maxSize: maxSize,
                maxFiles: maxFiles,
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }));
        }
        this.winstonLogger = winston.createLogger({
            level: logLevel,
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
            transports,
            exceptionHandlers: [
                new winston.transports.File({
                    filename: path.join(logDir, 'exceptions.log'),
                }),
            ],
            rejectionHandlers: [
                new winston.transports.File({
                    filename: path.join(logDir, 'rejections.log'),
                }),
            ],
        });
    }
    log(message, context) {
        this.winstonLogger.info(message, { context });
    }
    error(message, trace, context) {
        this.winstonLogger.error(message, { context, trace });
    }
    warn(message, context) {
        this.winstonLogger.warn(message, { context });
    }
    debug(message, context) {
        this.winstonLogger.debug(message, { context });
    }
    verbose(message, context) {
        this.winstonLogger.verbose(message, { context });
    }
    logWithContext(level, message, context = {}) {
        const logEntry = {
            message,
            timestamp: new Date().toISOString(),
            level,
            ...context,
        };
        if (context.correlationId) {
            this.contextMap.set(context.correlationId, {
                ...this.contextMap.get(context.correlationId),
                ...context,
            });
        }
        this.winstonLogger.log(level, message, logEntry);
    }
    logRequest(context) {
        this.logWithContext('info', 'HTTP Request', {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'request_start',
            },
        });
    }
    logResponse(context) {
        const level = context.statusCode && context.statusCode >= 400 ? 'warn' : 'info';
        this.logWithContext(level, 'HTTP Response', {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'request_complete',
            },
        });
    }
    logError(error, context = {}) {
        this.logWithContext('error', error.message, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'error',
            },
            error: {
                code: error.code || 'UNKNOWN_ERROR',
                message: error.message,
                stack: error.stack,
            },
        });
    }
    logSecurityEvent(event, context = {}) {
        this.logWithContext('warn', `Security Event: ${event}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'security',
                securityEvent: event,
            },
        });
    }
    logBusinessEvent(event, data, context = {}) {
        this.logWithContext('info', `Business Event: ${event}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'business',
                businessEvent: event,
                data,
            },
        });
    }
    logPerformance(operation, duration, context = {}) {
        this.logWithContext('info', `Performance: ${operation}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'performance',
                operation,
                duration,
            },
        });
    }
    logDatabase(operation, collection, context = {}) {
        this.logWithContext('debug', `Database: ${operation} on ${collection}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'database',
                operation,
                collection,
            },
        });
    }
    logAI(operation, model, context = {}) {
        this.logWithContext('info', `AI Operation: ${operation} with ${model}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'ai',
                operation,
                model,
            },
        });
    }
    logPayment(operation, amount, currency, context = {}) {
        this.logWithContext('info', `Payment: ${operation}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'payment',
                operation,
                amount,
                currency,
            },
        });
    }
    getCorrelationContext(correlationId) {
        return this.contextMap.get(correlationId);
    }
    updateCorrelationContext(correlationId, updates) {
        const existing = this.contextMap.get(correlationId) || {};
        this.contextMap.set(correlationId, { ...existing, ...updates });
    }
    clearCorrelationContext(correlationId) {
        this.contextMap.delete(correlationId);
    }
    createStructuredLog(level, event, data, context = {}) {
        return {
            timestamp: new Date().toISOString(),
            level,
            event,
            data,
            context: {
                correlationId: context.correlationId,
                userId: context.userId,
                sessionId: context.sessionId,
                requestId: context.requestId,
                endpoint: context.endpoint,
                method: context.method,
                ip: context.ip,
                userAgent: context.userAgent,
                duration: context.duration,
                statusCode: context.statusCode,
                ...context.metadata,
            },
        };
    }
    logAudit(action, subject, object, context = {}) {
        this.logWithContext('info', `Audit: ${action} ${subject} on ${object}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'audit',
                audit: {
                    action,
                    subject,
                    object,
                    timestamp: new Date().toISOString(),
                },
            },
        });
    }
    logVersionUsage(version, endpoint, context = {}) {
        this.logWithContext('info', `API Version Usage: ${version}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'version_usage',
                version,
                endpoint,
            },
        });
    }
    logDeprecation(feature, replacement, context = {}) {
        this.logWithContext('warn', `Deprecated Feature Used: ${feature}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'deprecation',
                feature,
                replacement,
            },
        });
    }
    logHealthCheck(component, status, details, context = {}) {
        const level = status === 'healthy' ? 'info' : 'error';
        this.logWithContext(level, `Health Check: ${component} is ${status}`, {
            ...context,
            metadata: {
                ...context.metadata,
                event: 'health_check',
                component,
                status,
                details,
            },
        });
    }
    getLoggerStats() {
        return {
            contextMapSize: this.contextMap.size,
            winstonLoggerLevel: this.winstonLogger.level,
            transports: this.winstonLogger.transports.map(t => ({
                name: t.constructor.name,
                level: t.level,
                silent: t.silent,
            })),
        };
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggingService);
//# sourceMappingURL=logging.service.js.map