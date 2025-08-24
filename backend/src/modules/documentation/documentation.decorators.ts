import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiBearerAuth,
  ApiSecurity,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiHeader,
  ApiConsumes,
  ApiProduces,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

// Common response schemas
export const ApiStandardResponses = {
  success: (description = 'Operation successful', schema?: any) =>
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: schema || { type: 'object' },
          _api: {
            type: 'object',
            properties: {
              version: { type: 'string', example: 'v2' },
              deprecated: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),

  created: (description = 'Resource created successfully', schema?: any) =>
    ApiCreatedResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: schema || { type: 'object' },
          _api: {
            type: 'object',
            properties: {
              version: { type: 'string', example: 'v2' },
              deprecated: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),

  noContent: (description = 'Operation completed successfully') =>
    ApiNoContentResponse({ description }),

  badRequest: (description = 'Invalid request data') =>
    ApiBadRequestResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Validation failed' },
              details: { type: 'object' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),

  unauthorized: (description = 'Authentication required') =>
    ApiUnauthorizedResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Authentication required' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),

  forbidden: (description = 'Insufficient permissions') =>
    ApiForbiddenResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'FORBIDDEN' },
              message: { type: 'string', example: 'Insufficient permissions' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),

  notFound: (description = 'Resource not found') =>
    ApiNotFoundResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: 'Resource not found' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),

  conflict: (description = 'Resource conflict') =>
    ApiConflictResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'CONFLICT' },
              message: { type: 'string', example: 'Resource already exists' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),

  tooManyRequests: (description = 'Rate limit exceeded') =>
    ApiTooManyRequestsResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' },
              message: { type: 'string', example: 'Too many requests' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),

  internalServerError: (description = 'Internal server error') =>
    ApiInternalServerErrorResponse({
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'INTERNAL_ERROR' },
              message: { type: 'string', example: 'Internal server error' },
              timestamp: { type: 'string', format: 'date-time' },
              path: { type: 'string' },
              correlationId: { type: 'string' },
            },
          },
        },
      },
    }),
};

// Authentication decorators
export const ApiAuth = (version: string = 'v2') => {
  if (version === 'v1') {
    return applyDecorators(
      ApiSecurity('api-key'),
      ApiHeader({
        name: 'x-api-key',
        description: 'API Key for authentication',
        required: true,
        schema: { type: 'string', example: 'your-api-key-here' },
      }),
    );
  }

  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiHeader({
      name: 'authorization',
      description: 'JWT access token',
      required: true,
      schema: { type: 'string', example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    }),
    version === 'v2' ? ApiHeader({
      name: 'x-refresh-token',
      description: 'JWT refresh token (optional)',
      required: false,
      schema: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    }) : () => {},
  );
};

// Common API endpoint decorators
export const ApiStandardList = (resource: string, itemSchema: any) => {
  return applyDecorators(
    ApiOperation({
      summary: `Get ${resource} list`,
      description: `Retrieve a paginated list of ${resource}`,
    }),
    ApiStandardResponses.success(
      `List of ${resource} retrieved successfully`,
      {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: itemSchema,
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 20 },
              total: { type: 'integer', example: 150 },
              totalPages: { type: 'integer', example: 8 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
        },
      }
    ),
    ApiStandardResponses.badRequest(),
    ApiStandardResponses.unauthorized(),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Page number (1-based)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Items per page',
      example: 20,
    }),
    ApiQuery({
      name: 'sortBy',
      type: String,
      required: false,
      description: 'Sort field',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      type: String,
      required: false,
      description: 'Sort order',
      enum: ['asc', 'desc'],
      example: 'desc',
    }),
  );
};

export const ApiStandardGet = (resource: string, itemSchema: any) => {
  return applyDecorators(
    ApiOperation({
      summary: `Get ${resource} by ID`,
      description: `Retrieve a specific ${resource} by its ID`,
    }),
    ApiStandardResponses.success(
      `${resource} retrieved successfully`,
      itemSchema
    ),
    ApiStandardResponses.notFound(`${resource} not found`),
    ApiStandardResponses.unauthorized(),
    ApiParam({
      name: 'id',
      type: String,
      description: `${resource} ID`,
      example: '123',
    }),
  );
};

export const ApiStandardCreate = (resource: string, createSchema: any, responseSchema?: any) => {
  return applyDecorators(
    ApiOperation({
      summary: `Create new ${resource}`,
      description: `Create a new ${resource}`,
    }),
    ApiStandardResponses.created(
      `${resource} created successfully`,
      responseSchema || createSchema
    ),
    ApiStandardResponses.badRequest('Invalid request data'),
    ApiStandardResponses.unauthorized(),
    ApiBody({
      type: createSchema,
      description: `${resource} data`,
    }),
  );
};

export const ApiStandardUpdate = (resource: string, updateSchema: any) => {
  return applyDecorators(
    ApiOperation({
      summary: `Update ${resource}`,
      description: `Update an existing ${resource}`,
    }),
    ApiStandardResponses.success(
      `${resource} updated successfully`,
      updateSchema
    ),
    ApiStandardResponses.badRequest('Invalid request data'),
    ApiStandardResponses.unauthorized(),
    ApiStandardResponses.notFound(`${resource} not found`),
    ApiParam({
      name: 'id',
      type: String,
      description: `${resource} ID`,
      example: '123',
    }),
    ApiBody({
      type: updateSchema,
      description: `${resource} update data`,
    }),
  );
};

export const ApiStandardDelete = (resource: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Delete ${resource}`,
      description: `Delete an existing ${resource}`,
    }),
    ApiStandardResponses.noContent(`${resource} deleted successfully`),
    ApiStandardResponses.unauthorized(),
    ApiStandardResponses.notFound(`${resource} not found`),
    ApiParam({
      name: 'id',
      type: String,
      description: `${resource} ID`,
      example: '123',
    }),
  );
};

// File upload decorators
export const ApiFileUpload = (description = 'File upload', maxSize = '10MB') => {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload file',
      description,
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: `File to upload (max size: ${maxSize})`,
          },
        },
      },
    }),
    ApiStandardResponses.success('File uploaded successfully', {
      type: 'object',
      properties: {
        fileId: { type: 'string', example: 'file_123' },
        url: { type: 'string', example: 'https://storage.example.com/files/file_123' },
        filename: { type: 'string', example: 'uploaded-file.jpg' },
        size: { type: 'integer', example: 1024 },
        type: { type: 'string', example: 'image/jpeg' },
      },
    }),
    ApiStandardResponses.badRequest('Invalid file or file too large'),
    ApiStandardResponses.unauthorized(),
  );
};

// Search endpoint decorator
export const ApiSearch = (resource: string, searchSchema?: any) => {
  return applyDecorators(
    ApiOperation({
      summary: `Search ${resource}`,
      description: `Search ${resource} with filters and pagination`,
    }),
    ApiStandardResponses.success(
      `Search results for ${resource}`,
      {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: searchSchema || { type: 'object' },
          },
          total: { type: 'integer', example: 150 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          totalPages: { type: 'integer', example: 8 },
        },
      }
    ),
    ApiStandardResponses.badRequest('Invalid search parameters'),
    ApiQuery({
      name: 'q',
      type: String,
      required: false,
      description: 'Search query',
      example: 'laptop',
    }),
    ApiQuery({
      name: 'category',
      type: String,
      required: false,
      description: 'Category filter',
      example: 'electronics',
    }),
    ApiQuery({
      name: 'minPrice',
      type: Number,
      required: false,
      description: 'Minimum price',
      example: 100000,
    }),
    ApiQuery({
      name: 'maxPrice',
      type: Number,
      required: false,
      description: 'Maximum price',
      example: 500000,
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Page number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Items per page',
      example: 20,
    }),
  );
};

// AI-powered endpoint decorator
export const ApiAIEndpoint = (operation: string, description?: string) => {
  return applyDecorators(
    ApiOperation({
      summary: operation,
      description: description || `AI-powered ${operation.toLowerCase()}`,
    }),
    ApiStandardResponses.success(
      'AI operation completed successfully',
      {
        type: 'object',
        properties: {
          result: { type: 'string', description: 'AI-generated result' },
          tokens: { type: 'integer', description: 'Tokens used', example: 150 },
          model: { type: 'string', description: 'AI model used', example: 'gemini-1.5-flash' },
          confidence: { type: 'number', description: 'Confidence score', example: 0.95 },
        },
      }
    ),
    ApiStandardResponses.badRequest('Invalid AI request parameters'),
    ApiStandardResponses.unauthorized(),
    ApiStandardResponses.tooManyRequests('AI service quota exceeded'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'Input prompt for AI',
            example: 'Generate a product description for a smartphone',
          },
          model: {
            type: 'string',
            description: 'AI model to use',
            example: 'gemini-1.5-flash',
          },
          temperature: {
            type: 'number',
            description: 'Creativity level (0.0 - 1.0)',
            example: 0.7,
            minimum: 0,
            maximum: 1,
          },
          maxTokens: {
            type: 'integer',
            description: 'Maximum tokens to generate',
            example: 500,
            minimum: 1,
            maximum: 4096,
          },
        },
        required: ['prompt'],
      },
    }),
  );
};

// Payment endpoint decorator
export const ApiPaymentEndpoint = (operation: string) => {
  return applyDecorators(
    ApiOperation({
      summary: operation,
      description: `Payment ${operation.toLowerCase()}`,
    }),
    ApiStandardResponses.success(
      'Payment operation completed successfully',
      {
        type: 'object',
        properties: {
          paymentId: { type: 'string', example: 'pay_123' },
          transactionId: { type: 'string', example: 'txn_456' },
          amount: { type: 'number', example: 150000 },
          currency: { type: 'string', example: 'VND' },
          method: { type: 'string', example: 'VNPAY' },
          status: { type: 'string', example: 'COMPLETED' },
          paymentUrl: { type: 'string', example: 'https://payment.example.com/pay/123' },
        },
      }
    ),
    ApiStandardResponses.badRequest('Invalid payment data'),
    ApiStandardResponses.unauthorized(),
    ApiStandardResponses.tooManyRequests('Payment service rate limit exceeded'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'Payment amount',
            example: 150000,
            minimum: 1000,
          },
          currency: {
            type: 'string',
            description: 'Currency code',
            example: 'VND',
            enum: ['VND', 'USD', 'EUR'],
          },
          method: {
            type: 'string',
            description: 'Payment method',
            example: 'VNPAY',
            enum: ['VNPAY', 'MOMO', 'PAYOS', 'BANK_TRANSFER'],
          },
          description: {
            type: 'string',
            description: 'Payment description',
            example: 'Order payment',
          },
          returnUrl: {
            type: 'string',
            description: 'Return URL after payment',
            example: 'https://audiotailoc.com/payment/callback',
          },
        },
        required: ['amount', 'method'],
      },
    }),
  );
};

// Monitoring endpoint decorator
export const ApiMonitoringEndpoint = (operation: string) => {
  return applyDecorators(
    ApiOperation({
      summary: operation,
      description: `System ${operation.toLowerCase()}`,
    }),
    ApiStandardResponses.success(
      'Monitoring data retrieved successfully',
      {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 3600 },
          memory: {
            type: 'object',
            properties: {
              used: { type: 'number', example: 128 },
              total: { type: 'number', example: 512 },
              percentage: { type: 'number', example: 25 },
            },
          },
          metrics: { type: 'object' },
        },
      }
    ),
    ApiStandardResponses.unauthorized(),
    ApiHeader({
      name: 'x-api-key',
      description: 'API key for monitoring endpoints',
      required: false,
      schema: { type: 'string' },
    }),
  );
};

// Backup endpoint decorator
export const ApiBackupEndpoint = (operation: string) => {
  return applyDecorators(
    ApiOperation({
      summary: operation,
      description: `Backup ${operation.toLowerCase()}`,
    }),
    ApiStandardResponses.success(
      'Backup operation completed successfully',
      {
        type: 'object',
        properties: {
          backupId: { type: 'string', example: 'backup_123' },
          type: { type: 'string', example: 'full', enum: ['full', 'incremental', 'files'] },
          size: { type: 'number', example: 1024000 },
          duration: { type: 'number', example: 300 },
          path: { type: 'string', example: '/backups/database/backup_123.sql' },
          checksum: { type: 'string', example: 'abc123...' },
          compressed: { type: 'boolean', example: true },
          encrypted: { type: 'boolean', example: false },
        },
      }
    ),
    ApiStandardResponses.badRequest('Invalid backup parameters'),
    ApiStandardResponses.unauthorized(),
    ApiStandardResponses.internalServerError('Backup operation failed'),
  );
};

// Version-specific decorators
export const ApiV1Endpoint = (deprecated: boolean = true) => {
  return applyDecorators(
    ApiTags('V1 (Legacy)'),
    deprecated ? ApiOperation({
      summary: 'Deprecated endpoint',
      description: 'This endpoint is deprecated. Please use v2 endpoints.',
      deprecated: true,
    }) : () => {},
    ApiHeader({
      name: 'x-api-version',
      description: 'API version',
      required: false,
      schema: { type: 'string', example: 'v1' },
    }),
  );
};

export const ApiV2Endpoint = () => {
  return applyDecorators(
    ApiTags('V2 (Latest)'),
    ApiHeader({
      name: 'x-api-version',
      description: 'API version',
      required: false,
      schema: { type: 'string', example: 'v2' },
    }),
    ApiHeader({
      name: 'x-correlation-id',
      description: 'Request correlation ID',
      required: false,
      schema: { type: 'string', example: 'req_123456789_abc123' },
    }),
  );
};

// Common schema definitions
export const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'user_123' },
    email: { type: 'string', format: 'email', example: 'user@example.com' },
    name: { type: 'string', example: 'John Doe' },
    phone: { type: 'string', example: '0123456789' },
    role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
    isActive: { type: 'boolean', example: true },
    emailVerified: { type: 'boolean', example: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'prod_123' },
    name: { type: 'string', example: 'Wireless Headphones' },
    description: { type: 'string', example: 'High-quality wireless headphones' },
    price: { type: 'number', example: 150000 },
    originalPrice: { type: 'number', example: 180000 },
    stock: { type: 'integer', example: 50 },
    categoryId: { type: 'string', example: 'cat_456' },
    images: {
      type: 'array',
      items: { type: 'string' },
      example: ['https://example.com/image1.jpg'],
    },
    isActive: { type: 'boolean', example: true },
    isFeatured: { type: 'boolean', example: false },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const OrderSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'order_123' },
    userId: { type: 'string', example: 'user_456' },
    total: { type: 'number', example: 300000 },
    status: {
      type: 'string',
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      example: 'PENDING'
    },
    paymentMethod: {
      type: 'string',
      enum: ['VNPAY', 'MOMO', 'PAYOS', 'BANK_TRANSFER'],
      example: 'VNPAY'
    },
    shippingAddress: { type: 'string', example: '123 Main St, City' },
    shippingPhone: { type: 'string', example: '0123456789' },
    shippingName: { type: 'string', example: 'John Doe' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const CategorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'cat_123' },
    name: { type: 'string', example: 'Electronics' },
    slug: { type: 'string', example: 'electronics' },
    description: { type: 'string', example: 'Electronic devices and accessories' },
    image: { type: 'string', example: 'https://example.com/category.jpg' },
    isActive: { type: 'boolean', example: true },
    sortOrder: { type: 'integer', example: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

// Export all decorators
export * from '@nestjs/swagger';
