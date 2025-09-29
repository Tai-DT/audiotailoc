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
var EnhancedExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const monitoring_service_1 = require("../../modules/monitoring/monitoring.service");
let EnhancedExceptionFilter = EnhancedExceptionFilter_1 = class EnhancedExceptionFilter {
    constructor(configService, monitoringService) {
        this.configService = configService;
        this.monitoringService = monitoringService;
        this.logger = new common_1.Logger(EnhancedExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const correlationId = this.generateCorrelationId();
        const timestamp = new Date().toISOString();
        const path = request.url;
        const method = request.method;
        const userAgent = request.get('User-Agent') || '';
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorDetails = this.getErrorDetails(exception);
        this.logError(exception, {
            status,
            method,
            path,
            correlationId,
            userAgent,
            ip: this.getClientIP(request),
            error: errorDetails,
        });
        if (this.monitoringService) {
            this.monitoringService.recordError(errorDetails.code, path);
        }
        const errorResponse = {
            success: false,
            error: {
                code: errorDetails.code,
                message: errorDetails.message,
                details: this.shouldIncludeDetails(status) ? errorDetails.details : undefined,
                timestamp,
                path,
                correlationId,
                stack: this.shouldIncludeStack(status) ? errorDetails.stack : undefined,
            },
        };
        response.setHeader('X-Correlation-ID', correlationId);
        response.setHeader('X-Request-ID', correlationId);
        response.status(status).json(errorResponse);
    }
    generateCorrelationId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getClientIP(request) {
        return (request.ip ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.headers['x-forwarded-for'] ||
            request.headers['x-real-ip'] ||
            'unknown').split(',')[0].trim();
    }
    getErrorDetails(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            const message = typeof response === 'string'
                ? response
                : (typeof response === 'object' && response && 'message' in response ? response.message : exception.message);
            const code = typeof response === 'object' && response && 'code' in response
                ? response.code
                : this.getErrorCode(exception.constructor.name, exception.getStatus());
            return {
                code,
                message: Array.isArray(message) ? message.join(', ') : message,
                details: typeof response === 'object' ? response : undefined,
            };
        }
        if (exception.name === 'ValidationError') {
            return {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: exception.errors,
            };
        }
        if (exception.name === 'CastError') {
            return {
                code: 'INVALID_ID',
                message: 'Invalid ID format',
                details: { value: exception.value, path: exception.path },
            };
        }
        if (exception.code === 11000) {
            return {
                code: 'DUPLICATE_KEY',
                message: 'Duplicate key error',
                details: { key: Object.keys(exception.keyValue)[0] },
            };
        }
        return {
            code: 'INTERNAL_ERROR',
            message: exception.message || 'Internal server error',
            stack: exception.stack,
        };
    }
    getErrorCode(className, status) {
        const errorCodes = {
            'BadRequestException': 'BAD_REQUEST',
            'UnauthorizedException': 'UNAUTHORIZED',
            'ForbiddenException': 'FORBIDDEN',
            'NotFoundException': 'NOT_FOUND',
            'ConflictException': 'CONFLICT',
            'GoneException': 'GONE',
            'PayloadTooLargeException': 'PAYLOAD_TOO_LARGE',
            'UnsupportedMediaTypeException': 'UNSUPPORTED_MEDIA_TYPE',
            'UnprocessableEntityException': 'VALIDATION_ERROR',
            'InternalServerErrorException': 'INTERNAL_ERROR',
            'NotImplementedException': 'NOT_IMPLEMENTED',
            'BadGatewayException': 'BAD_GATEWAY',
            'ServiceUnavailableException': 'SERVICE_UNAVAILABLE',
            'GatewayTimeoutException': 'GATEWAY_TIMEOUT',
        };
        return errorCodes[className] || `HTTP_${status}`;
    }
    shouldIncludeDetails(status) {
        return status >= 400 && status < 500;
    }
    shouldIncludeStack(status) {
        const isDevelopment = this.configService.get('NODE_ENV') !== 'production';
        return isDevelopment || status >= 500;
    }
    logError(exception, context) {
        const { status, method, path, correlationId, userAgent, ip, error } = context;
        const logContext = {
            correlationId,
            status,
            method,
            path,
            ip,
            userAgent,
            error: {
                code: error.code,
                message: error.message,
                stack: error.stack,
            },
        };
        if (status >= 500) {
            this.logger.error(`Server Error: ${error.message}`, logContext, exception.stack);
        }
        else if (status >= 400) {
            this.logger.warn(`Client Error: ${error.message}`, logContext);
        }
        else {
            this.logger.log(`Request Error: ${error.message}`, logContext);
        }
    }
};
exports.EnhancedExceptionFilter = EnhancedExceptionFilter;
exports.EnhancedExceptionFilter = EnhancedExceptionFilter = EnhancedExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        monitoring_service_1.MonitoringService])
], EnhancedExceptionFilter);
//# sourceMappingURL=enhanced-exception.filter.js.map