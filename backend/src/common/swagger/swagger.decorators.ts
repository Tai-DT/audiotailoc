import { applyDecorators, Type } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam, 
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiProduces
} from '@nestjs/swagger';
import { ErrorExamples } from './swagger.constants';

/**
 * Decorator để tạo documentation hoàn chỉnh cho list endpoints
 */
export function ApiListEndpoint(options: {
  summary: string;
  description?: string;
  itemName: string;
  authRequired?: boolean;
}) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description || `Retrieve a paginated list of ${options.itemName.toLowerCase()}`,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number',
      example: 1,
      schema: { type: 'integer', minimum: 1, default: 1 },
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      description: 'Items per page',
      example: 10,
      schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    }),
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Search query',
      example: 'search term',
      schema: { type: 'string' },
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description: 'Sort field',
      example: 'createdAt',
      schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'name'] },
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      description: 'Sort order',
      example: 'desc',
      schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
    }),
    ApiResponse({
      status: 200,
      description: `${options.itemName} list retrieved successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: `${options.itemName} list retrieved successfully` },
          data: {
            type: 'array',
            items: { type: 'object' },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              pageSize: { type: 'number', example: 10 },
              total: { type: 'number', example: 100 },
              totalPages: { type: 'number', example: 10 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid query parameters',
      schema: {
        example: ErrorExamples.VALIDATION,
      },
    }),
  ];

  if (options.authRequired) {
    decorators.push(
      ApiBearerAuth('JWT-auth'),
      ApiResponse({
        status: 401,
        description: 'Authentication required',
        schema: { example: ErrorExamples.UNAUTHORIZED },
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Decorator để tạo documentation cho get by ID endpoints
 */
export function ApiGetByIdEndpoint(options: {
  summary: string;
  description?: string;
  itemName: string;
  paramName?: string;
  authRequired?: boolean;
}) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description || `Retrieve a specific ${options.itemName.toLowerCase()} by ID`,
    }),
    ApiParam({
      name: options.paramName || 'id',
      description: `${options.itemName} unique identifier`,
      example: 'item_123',
    }),
    ApiResponse({
      status: 200,
      description: `${options.itemName} retrieved successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: `${options.itemName} retrieved successfully` },
          data: { type: 'object' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: `${options.itemName} not found`,
      schema: { example: ErrorExamples.NOT_FOUND },
    }),
  ];

  if (options.authRequired) {
    decorators.push(
      ApiBearerAuth('JWT-auth'),
      ApiResponse({
        status: 401,
        description: 'Authentication required',
        schema: { example: ErrorExamples.UNAUTHORIZED },
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Decorator để tạo documentation cho create endpoints
 */
export function ApiCreateEndpoint(options: {
  summary: string;
  description?: string;
  itemName: string;
  dtoType: Type<any>;
  adminOnly?: boolean;
}) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description || `Create a new ${options.itemName.toLowerCase()}`,
    }),
    ApiBody({ type: options.dtoType }),
    ApiResponse({
      status: 201,
      description: `${options.itemName} created successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: `${options.itemName} created successfully` },
          data: { type: 'object' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request data',
      schema: { example: ErrorExamples.VALIDATION },
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: 401,
      description: 'Authentication required',
      schema: { example: ErrorExamples.UNAUTHORIZED },
    }),
  ];

  if (options.adminOnly) {
    decorators.push(
      ApiResponse({
        status: 403,
        description: 'Admin access required',
        schema: { example: ErrorExamples.FORBIDDEN },
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Decorator để tạo documentation cho update endpoints
 */
export function ApiUpdateEndpoint(options: {
  summary: string;
  description?: string;
  itemName: string;
  dtoType: Type<any>;
  paramName?: string;
  adminOnly?: boolean;
}) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description || `Update an existing ${options.itemName.toLowerCase()}`,
    }),
    ApiParam({
      name: options.paramName || 'id',
      description: `${options.itemName} unique identifier`,
      example: 'item_123',
    }),
    ApiBody({ type: options.dtoType }),
    ApiResponse({
      status: 200,
      description: `${options.itemName} updated successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: `${options.itemName} updated successfully` },
          data: { type: 'object' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request data',
      schema: { example: ErrorExamples.VALIDATION },
    }),
    ApiResponse({
      status: 404,
      description: `${options.itemName} not found`,
      schema: { example: ErrorExamples.NOT_FOUND },
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: 401,
      description: 'Authentication required',
      schema: { example: ErrorExamples.UNAUTHORIZED },
    }),
  ];

  if (options.adminOnly) {
    decorators.push(
      ApiResponse({
        status: 403,
        description: 'Admin access required',
        schema: { example: ErrorExamples.FORBIDDEN },
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Decorator để tạo documentation cho delete endpoints
 */
export function ApiDeleteEndpoint(options: {
  summary: string;
  description?: string;
  itemName: string;
  paramName?: string;
  adminOnly?: boolean;
}) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description || `Delete a ${options.itemName.toLowerCase()}`,
    }),
    ApiParam({
      name: options.paramName || 'id',
      description: `${options.itemName} unique identifier`,
      example: 'item_123',
    }),
    ApiResponse({
      status: 200,
      description: `${options.itemName} deleted successfully`,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: `${options.itemName} deleted successfully` },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: `${options.itemName} not found`,
      schema: { example: ErrorExamples.NOT_FOUND },
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: 401,
      description: 'Authentication required',
      schema: { example: ErrorExamples.UNAUTHORIZED },
    }),
  ];

  if (options.adminOnly) {
    decorators.push(
      ApiResponse({
        status: 403,
        description: 'Admin access required',
        schema: { example: ErrorExamples.FORBIDDEN },
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Decorator để tạo documentation cho file upload endpoints
 */
export function ApiFileUploadEndpoint(options: {
  summary: string;
  description?: string;
  fileTypes?: string[];
  maxSize?: string;
  authRequired?: boolean;
}) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description || 'Upload file(s) to the server',
    }),
    ApiConsumes('multipart/form-data'),
    ApiProduces('application/json'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: `File to upload ${options.fileTypes ? `(${options.fileTypes.join(', ')})` : ''}${options.maxSize ? `, max size: ${options.maxSize}` : ''}`,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'File uploaded successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'File uploaded successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'file_123' },
              filename: { type: 'string', example: 'image.jpg' },
              url: { type: 'string', example: 'https://example.com/files/image.jpg' },
              size: { type: 'number', example: 1024000 },
              mimeType: { type: 'string', example: 'image/jpeg' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid file or file too large',
      schema: { example: ErrorExamples.VALIDATION },
    }),
  ];

  if (options.authRequired) {
    decorators.push(
      ApiBearerAuth('JWT-auth'),
      ApiResponse({
        status: 401,
        description: 'Authentication required',
        schema: { example: ErrorExamples.UNAUTHORIZED },
      })
    );
  }

  return applyDecorators(...decorators);
}
