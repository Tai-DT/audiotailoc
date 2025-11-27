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
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logging_service_1 = require("./logging.service");
const correlation_service_1 = require("./correlation.service");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor(loggingService) {
        this.loggingService = loggingService;
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        let correlationId = correlation_service_1.CorrelationService.extractFromHeaders(request.headers);
        if (!correlationId) {
            correlationId = correlation_service_1.CorrelationService.generateCorrelationId();
        }
        const correlationContext = correlation_service_1.CorrelationService.startContext(correlationId);
        const userId = this.extractUserId(request);
        if (userId) {
            correlation_service_1.CorrelationService.setUserId(userId);
        }
        correlation_service_1.CorrelationService.addMetadata('endpoint', request.path);
        correlation_service_1.CorrelationService.addMetadata('method', request.method);
        correlation_service_1.CorrelationService.addMetadata('ip', this.getClientIP(request));
        correlation_service_1.CorrelationService.addMetadata('userAgent', request.get('User-Agent'));
        const logContext = {
            correlationId,
            userId,
            requestId: correlationContext.requestId,
            endpoint: request.path,
            method: request.method,
            ip: this.getClientIP(request),
            userAgent: request.get('User-Agent'),
        };
        this.loggingService.logRequest(logContext);
        return next.handle().pipe((0, rxjs_1.tap)(data => {
            const duration = Date.now() - startTime;
            const statusCode = response.statusCode;
            this.loggingService.logResponse({
                ...logContext,
                duration,
                statusCode,
                metadata: {
                    responseSize: this.getResponseSize(data),
                },
            });
            correlation_service_1.CorrelationService.addToHeaders(response.getHeaders());
        }), (0, rxjs_1.catchError)(error => {
            const duration = Date.now() - startTime;
            this.loggingService.logError(error, {
                ...logContext,
                duration,
                statusCode: error.status || 500,
                error: {
                    code: error.code || error.name || 'UNKNOWN_ERROR',
                    message: error.message,
                    stack: error.stack,
                    details: error.details || error.response,
                },
            });
            correlation_service_1.CorrelationService.addToHeaders(response.getHeaders());
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    extractUserId(request) {
        return (request.users?.id ||
            request.users?.userId ||
            request.headers['x-user-id'] ||
            request.query.userId);
    }
    getClientIP(request) {
        return (request.ip ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            'unknown')
            .split(',')[0]
            .trim();
    }
    getResponseSize(data) {
        try {
            if (typeof data === 'string') {
                return Buffer.byteLength(data, 'utf8');
            }
            const jsonString = JSON.stringify(data);
            return Buffer.byteLength(jsonString, 'utf8');
        }
        catch {
            return 0;
        }
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map