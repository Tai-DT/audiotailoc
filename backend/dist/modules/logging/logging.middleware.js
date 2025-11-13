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
var LoggingMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logging_service_1 = require("./logging.service");
const correlation_service_1 = require("./correlation.service");
let LoggingMiddleware = LoggingMiddleware_1 = class LoggingMiddleware {
    constructor(loggingService) {
        this.loggingService = loggingService;
        this.logger = new common_1.Logger(LoggingMiddleware_1.name);
    }
    use(request, response, next) {
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
        correlation_service_1.CorrelationService.addMetadata('query', JSON.stringify(request.query));
        correlation_service_1.CorrelationService.addMetadata('params', JSON.stringify(request.params));
        this.loggingService.logWithContext('info', `Incoming ${request.method} ${request.path}`, {
            correlationId,
            requestId: correlationContext.requestId,
            endpoint: request.path,
            method: request.method,
            ip: this.getClientIP(request),
            userAgent: request.get('User-Agent'),
            metadata: {
                query: request.query,
                headers: this.sanitizeHeaders(request.headers),
            },
        });
        const originalEnd = response.end;
        const self = this;
        response.end = function (chunk, encoding) {
            const duration = Date.now() - startTime;
            self.loggingService.logWithContext(response.statusCode >= 400 ? 'warn' : 'info', `Response ${request.method} ${request.path} - ${response.statusCode}`, {
                correlationId,
                requestId: correlationContext.requestId,
                endpoint: request.path,
                method: request.method,
                statusCode: response.statusCode,
                duration,
                metadata: {
                    responseSize: chunk ? chunk.length : 0,
                },
            });
            correlation_service_1.CorrelationService.addToHeaders(response.getHeaders());
            if (typeof encoding === 'function') {
                return originalEnd.call(this, chunk, encoding);
            }
            else {
                return originalEnd.call(this, chunk, encoding);
            }
        };
        const originalJson = response.json;
        response.json = function (data) {
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                data._correlationId = correlationId;
            }
            return originalJson.call(this, data);
        };
        next();
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
            'unknown').split(',')[0].trim();
    }
    sanitizeHeaders(headers) {
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'password'];
        const sanitized = { ...headers };
        sensitiveHeaders.forEach(header => {
            if (sanitized[header.toLowerCase()]) {
                sanitized[header.toLowerCase()] = '[REDACTED]';
            }
        });
        return sanitized;
    }
};
exports.LoggingMiddleware = LoggingMiddleware;
exports.LoggingMiddleware = LoggingMiddleware = LoggingMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], LoggingMiddleware);
//# sourceMappingURL=logging.middleware.js.map