import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

// Common error responses
export const ApiErrorResponses = () =>
  applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input parameters',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'BAD_REQUEST' },
              message: { type: 'string', example: 'Invalid request parameters' },
              details: { type: 'object' },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products' },
              correlationId: { type: 'string', example: 'req_123456789_abc123' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Authentication required' },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'FORBIDDEN' },
              message: { type: 'string', example: 'Insufficient permissions' },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Resource not found',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: 'Resource not found' },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products/123' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 422,
      description: 'Unprocessable Entity - Validation failed',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Validation failed' },
              errors: {
                type: 'array',
                items: { type: 'string' },
                example: ['name: must not be empty', 'price: must be a positive number'],
              },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - Rate limit exceeded',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' },
              message: { type: 'string', example: 'Too many requests, please try again later' },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'INTERNAL_ERROR' },
              message: { type: 'string', example: 'Internal server error' },
              timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              path: { type: 'string', example: '/api/v1/products' },
              correlationId: { type: 'string', example: 'req_123456789_abc123' },
            },
          },
        },
      },
    }),
  );

// Standard success response decorators
export const ApiStandardResponse = <TModel extends Type<any>>(
  model: TModel,
  description: string,
  isArray = false,
) =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              }
            : { $ref: getSchemaPath(model) },
          _api: {
            type: 'object',
            properties: {
              version: { type: 'string', example: 'v1' },
              deprecated: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),
  );

export const ApiStandardListResponse = <TModel extends Type<any>>(
  model: TModel,
  description: string,
) =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number', example: 1 },
                  pageSize: { type: 'number', example: 20 },
                  total: { type: 'number', example: 100 },
                  totalPages: { type: 'number', example: 5 },
                  hasNext: { type: 'boolean', example: true },
                  hasPrev: { type: 'boolean', example: false },
                },
              },
              filters: {
                type: 'object',
                properties: {
                  applied: { type: 'object' },
                  available: { type: 'object' },
                },
              },
            },
          },
          _api: {
            type: 'object',
            properties: {
              version: { type: 'string', example: 'v1' },
              deprecated: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),
  );

export const ApiStandardCreatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description: string,
) =>
  applyDecorators(
    ApiResponse({
      status: 201,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { $ref: getSchemaPath(model) },
          _api: {
            type: 'object',
            properties: {
              version: { type: 'string', example: 'v1' },
              deprecated: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),
  );

export const ApiStandardDeleteResponse = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Resource deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              deleted: { type: 'boolean', example: true },
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            },
          },
          _api: {
            type: 'object',
            properties: {
              version: { type: 'string', example: 'v1' },
              deprecated: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),
  );

// Pagination query decorators
export const ApiPaginationQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (starts from 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      description: 'Number of items per page (max 100)',
      example: 20,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Field to sort by',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort order',
      example: 'desc',
    }),
  );

// Search query decorators
export const ApiSearchQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: 'Search query string',
      example: 'audio equipment',
    }),
    ApiQuery({
      name: 'category',
      required: false,
      type: String,
      description: 'Filter by category',
      example: 'electronics',
    }),
    ApiQuery({
      name: 'minPrice',
      required: false,
      type: Number,
      description: 'Minimum price filter',
      example: 100,
    }),
    ApiQuery({
      name: 'maxPrice',
      required: false,
      type: Number,
      description: 'Maximum price filter',
      example: 1000,
    }),
    ApiQuery({
      name: 'featured',
      required: false,
      type: Boolean,
      description: 'Filter featured products only',
      example: true,
    }),
  );

// Authentication decorators
export const ApiAuthRequired = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Valid JWT token required',
    }),
  );

export const ApiAdminRequired = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Valid JWT token required',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Admin privileges required',
    }),
  );

// Complete endpoint decorators
export const ApiStandardList = <TModel extends Type<any>>(
  resource: string,
  model: TModel,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
    includeSearch?: boolean;
    includePagination?: boolean;
  },
) => {
  const decorators = [
    ApiOperation({
      summary: `List ${resource}`,
      description: `Retrieve a paginated list of ${resource} with optional filtering and sorting`,
    }),
    ApiStandardListResponse(model, `List of ${resource} retrieved successfully`),
    ApiErrorResponses(),
  ];

  if (options?.includePagination !== false) {
    decorators.push(ApiPaginationQuery());
  }

  if (options?.includeSearch) {
    decorators.push(ApiSearchQuery());
  }

  if (options?.requireAdmin) {
    decorators.push(ApiAdminRequired());
  } else if (options?.requireAuth) {
    decorators.push(ApiAuthRequired());
  }

  return applyDecorators(...decorators);
};

export const ApiStandardGet = <TModel extends Type<any>>(
  resource: string,
  model: TModel,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
) => {
  const decorators = [
    ApiOperation({
      summary: `Get ${resource}`,
      description: `Retrieve a single ${resource} by ID`,
    }),
    ApiParam({
      name: 'id',
      description: `${resource} ID`,
      type: String,
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiStandardResponse(model, `${resource} retrieved successfully`),
    ApiErrorResponses(),
  ];

  if (options?.requireAdmin) {
    decorators.push(ApiAdminRequired());
  } else if (options?.requireAuth) {
    decorators.push(ApiAuthRequired());
  }

  return applyDecorators(...decorators);
};

export const ApiStandardCreate = <TModel extends Type<any>, TDto extends Type<any>>(
  resource: string,
  dto: TDto,
  model: TModel,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
) => {
  const decorators = [
    ApiOperation({
      summary: `Create ${resource}`,
      description: `Create a new ${resource}`,
    }),
    ApiBody({
      type: dto,
      description: `${resource} data`,
    }),
    ApiStandardCreatedResponse(model, `${resource} created successfully`),
    ApiErrorResponses(),
  ];

  if (options?.requireAdmin) {
    decorators.push(ApiAdminRequired());
  } else if (options?.requireAuth) {
    decorators.push(ApiAuthRequired());
  }

  return applyDecorators(...decorators);
};

export const ApiStandardUpdate = <TDto extends Type<any>>(
  resource: string,
  dto: TDto,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
) => {
  const decorators = [
    ApiOperation({
      summary: `Update ${resource}`,
      description: `Update an existing ${resource}`,
    }),
    ApiParam({
      name: 'id',
      description: `${resource} ID`,
      type: String,
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: dto,
      description: `Updated ${resource} data`,
    }),
    ApiResponse({
      status: 200,
      description: `${resource} updated successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              updated: { type: 'boolean', example: true },
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            },
          },
        },
      },
    }),
    ApiErrorResponses(),
  ];

  if (options?.requireAdmin) {
    decorators.push(ApiAdminRequired());
  } else if (options?.requireAuth) {
    decorators.push(ApiAuthRequired());
  }

  return applyDecorators(...decorators);
};

export const ApiStandardDelete = (
  resource: string,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
) => {
  const decorators = [
    ApiOperation({
      summary: `Delete ${resource}`,
      description: `Delete an existing ${resource}`,
    }),
    ApiParam({
      name: 'id',
      description: `${resource} ID`,
      type: String,
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiStandardDeleteResponse(),
    ApiErrorResponses(),
  ];

  if (options?.requireAdmin) {
    decorators.push(ApiAdminRequired());
  } else if (options?.requireAuth) {
    decorators.push(ApiAuthRequired());
  }

  return applyDecorators(...decorators);
};

// Bulk operations decorators
export const ApiBulkOperation = (
  operation: string,
  resource: string,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
) => {
  const decorators = [
    ApiOperation({
      summary: `Bulk ${operation} ${resource}`,
      description: `Perform ${operation} operation on multiple ${resource}`,
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: `Array of ${resource} IDs`,
            example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e89b-12d3-a456-426614174001'],
          },
        },
        required: ['ids'],
      },
    }),
    ApiResponse({
      status: 200,
      description: `Bulk ${operation} completed successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              processed: { type: 'number', example: 5 },
              successful: { type: 'number', example: 4 },
              failed: { type: 'number', example: 1 },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiErrorResponses(),
  ];

  if (options?.requireAdmin) {
    decorators.push(ApiAdminRequired());
  } else if (options?.requireAuth) {
    decorators.push(ApiAuthRequired());
  }

  return applyDecorators(...decorators);
};