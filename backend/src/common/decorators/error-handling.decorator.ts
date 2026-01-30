import { HttpException, HttpStatus } from '@nestjs/common';

export interface CustomErrorOptions {
  code?: string;
  message?: string;
  details?: any;
  statusCode?: HttpStatus;
}

export function CustomError(options: CustomErrorOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }

        // Create structured error response
        const statusCode = options.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
          code: options.code || 'INTERNAL_ERROR',
          message:
            options.message ||
            (error instanceof Error ? error.message : 'An unexpected error occurred'),
          details: options.details || undefined,
          originalError: error instanceof Error ? error.message : 'Unknown error',
        };

        throw new HttpException(errorResponse, statusCode);
      }
    };

    return descriptor;
  };
}

export function HandleDatabaseErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // Handle Prisma errors
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
          throw new HttpException(
            {
              code: 'DUPLICATE_ENTRY',
              message: 'A record with this information already exists',
              details: { fields: (error as any).meta?.target },
            },
            HttpStatus.CONFLICT,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
          throw new HttpException(
            {
              code: 'RECORD_NOT_FOUND',
              message: 'The requested record was not found',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'P2003') {
          throw new HttpException(
            {
              code: 'FOREIGN_KEY_CONSTRAINT',
              message: 'Cannot delete record due to existing references',
              details: { field: (error as any).meta?.field_name },
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // Handle MongoDB errors
        if (error instanceof Error && error.name === 'ValidationError') {
          throw new HttpException(
            {
              code: 'VALIDATION_ERROR',
              message: 'Data validation failed',
              details: (error as any).errors,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (error instanceof Error && error.name === 'CastError') {
          throw new HttpException(
            {
              code: 'INVALID_ID',
              message: 'Invalid ID format',
              details: { value: (error as any).value, path: (error as any).path },
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 11000) {
          throw new HttpException(
            {
              code: 'DUPLICATE_KEY',
              message: 'Duplicate key error',
              details: { key: Object.keys((error as any).keyValue)[0] },
            },
            HttpStatus.CONFLICT,
          );
        }

        // Re-throw if not a database error
        throw error;
      }
    };

    return descriptor;
  };
}

export function HandlePaymentErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // Handle payment gateway errors
        if (error instanceof Error && 'code' in error && error.code === 'PAYMENT_DECLINED') {
          throw new HttpException(
            {
              code: 'PAYMENT_DECLINED',
              message: 'Payment was declined by the payment processor',
              details: (error as any).details,
            },
            HttpStatus.PAYMENT_REQUIRED,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'INSUFFICIENT_FUNDS') {
          throw new HttpException(
            {
              code: 'INSUFFICIENT_FUNDS',
              message: 'Insufficient funds for this transaction',
            },
            HttpStatus.PAYMENT_REQUIRED,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'PAYMENT_TIMEOUT') {
          throw new HttpException(
            {
              code: 'PAYMENT_TIMEOUT',
              message: 'Payment processing timed out',
            },
            HttpStatus.REQUEST_TIMEOUT,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'INVALID_PAYMENT_METHOD') {
          throw new HttpException(
            {
              code: 'INVALID_PAYMENT_METHOD',
              message: 'The provided payment method is invalid',
              details: (error as any).details,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // Re-throw if not a payment error
        throw error;
      }
    };

    return descriptor;
  };
}

export function HandleAIIntegrationErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // Handle AI service errors
        if (error instanceof Error && 'code' in error && error.code === 'AI_SERVICE_UNAVAILABLE') {
          throw new HttpException(
            {
              code: 'AI_SERVICE_UNAVAILABLE',
              message: 'AI service is temporarily unavailable',
            },
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'AI_QUOTA_EXCEEDED') {
          throw new HttpException(
            {
              code: 'AI_QUOTA_EXCEEDED',
              message: 'AI service quota exceeded',
            },
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'INVALID_AI_PROMPT') {
          throw new HttpException(
            {
              code: 'INVALID_AI_PROMPT',
              message: 'The provided prompt is invalid',
              details: (error as any).details,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (error instanceof Error && 'code' in error && error.code === 'AI_RESPONSE_TIMEOUT') {
          throw new HttpException(
            {
              code: 'AI_RESPONSE_TIMEOUT',
              message: 'AI service response timeout',
            },
            HttpStatus.REQUEST_TIMEOUT,
          );
        }

        // Re-throw if not an AI error
        throw error;
      }
    };

    return descriptor;
  };
}
