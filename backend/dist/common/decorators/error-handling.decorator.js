"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = CustomError;
exports.HandleDatabaseErrors = HandleDatabaseErrors;
exports.HandlePaymentErrors = HandlePaymentErrors;
exports.HandleAIIntegrationErrors = HandleAIIntegrationErrors;
const common_1 = require("@nestjs/common");
function CustomError(options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                if (error instanceof common_1.HttpException) {
                    throw error;
                }
                const statusCode = options.statusCode || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                const errorResponse = {
                    code: options.code || 'INTERNAL_ERROR',
                    message: options.message || (error instanceof Error ? error.message : 'An unexpected error occurred'),
                    details: options.details || undefined,
                    originalError: error instanceof Error ? error.message : 'Unknown error',
                };
                throw new common_1.HttpException(errorResponse, statusCode);
            }
        };
        return descriptor;
    };
}
function HandleDatabaseErrors() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                if (error instanceof Error && 'code' in error && error.code === 'P2002') {
                    throw new common_1.HttpException({
                        code: 'DUPLICATE_ENTRY',
                        message: 'A record with this information already exists',
                        details: { fields: error.meta?.target },
                    }, common_1.HttpStatus.CONFLICT);
                }
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    throw new common_1.HttpException({
                        code: 'RECORD_NOT_FOUND',
                        message: 'The requested record was not found',
                    }, common_1.HttpStatus.NOT_FOUND);
                }
                if (error instanceof Error && 'code' in error && error.code === 'P2003') {
                    throw new common_1.HttpException({
                        code: 'FOREIGN_KEY_CONSTRAINT',
                        message: 'Cannot delete record due to existing references',
                        details: { field: error.meta?.field_name },
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                if (error instanceof Error && error.name === 'ValidationError') {
                    throw new common_1.HttpException({
                        code: 'VALIDATION_ERROR',
                        message: 'Data validation failed',
                        details: error.errors,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                if (error instanceof Error && error.name === 'CastError') {
                    throw new common_1.HttpException({
                        code: 'INVALID_ID',
                        message: 'Invalid ID format',
                        details: { value: error.value, path: error.path },
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                if (error instanceof Error && 'code' in error && error.code === 11000) {
                    throw new common_1.HttpException({
                        code: 'DUPLICATE_KEY',
                        message: 'Duplicate key error',
                        details: { key: Object.keys(error.keyValue)[0] },
                    }, common_1.HttpStatus.CONFLICT);
                }
                throw error;
            }
        };
        return descriptor;
    };
}
function HandlePaymentErrors() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                if (error instanceof Error && 'code' in error && error.code === 'PAYMENT_DECLINED') {
                    throw new common_1.HttpException({
                        code: 'PAYMENT_DECLINED',
                        message: 'Payment was declined by the payment processor',
                        details: error.details,
                    }, common_1.HttpStatus.PAYMENT_REQUIRED);
                }
                if (error instanceof Error && 'code' in error && error.code === 'INSUFFICIENT_FUNDS') {
                    throw new common_1.HttpException({
                        code: 'INSUFFICIENT_FUNDS',
                        message: 'Insufficient funds for this transaction',
                    }, common_1.HttpStatus.PAYMENT_REQUIRED);
                }
                if (error instanceof Error && 'code' in error && error.code === 'PAYMENT_TIMEOUT') {
                    throw new common_1.HttpException({
                        code: 'PAYMENT_TIMEOUT',
                        message: 'Payment processing timed out',
                    }, common_1.HttpStatus.REQUEST_TIMEOUT);
                }
                if (error instanceof Error && 'code' in error && error.code === 'INVALID_PAYMENT_METHOD') {
                    throw new common_1.HttpException({
                        code: 'INVALID_PAYMENT_METHOD',
                        message: 'The provided payment method is invalid',
                        details: error.details,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                throw error;
            }
        };
        return descriptor;
    };
}
function HandleAIIntegrationErrors() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (error) {
                if (error instanceof Error && 'code' in error && error.code === 'AI_SERVICE_UNAVAILABLE') {
                    throw new common_1.HttpException({
                        code: 'AI_SERVICE_UNAVAILABLE',
                        message: 'AI service is temporarily unavailable',
                    }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
                }
                if (error instanceof Error && 'code' in error && error.code === 'AI_QUOTA_EXCEEDED') {
                    throw new common_1.HttpException({
                        code: 'AI_QUOTA_EXCEEDED',
                        message: 'AI service quota exceeded',
                    }, common_1.HttpStatus.TOO_MANY_REQUESTS);
                }
                if (error instanceof Error && 'code' in error && error.code === 'INVALID_AI_PROMPT') {
                    throw new common_1.HttpException({
                        code: 'INVALID_AI_PROMPT',
                        message: 'The provided prompt is invalid',
                        details: error.details,
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                if (error instanceof Error && 'code' in error && error.code === 'AI_RESPONSE_TIMEOUT') {
                    throw new common_1.HttpException({
                        code: 'AI_RESPONSE_TIMEOUT',
                        message: 'AI service response timeout',
                    }, common_1.HttpStatus.REQUEST_TIMEOUT);
                }
                throw error;
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=error-handling.decorator.js.map