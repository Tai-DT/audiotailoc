"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiListEndpoint = ApiListEndpoint;
exports.ApiGetByIdEndpoint = ApiGetByIdEndpoint;
exports.ApiCreateEndpoint = ApiCreateEndpoint;
exports.ApiUpdateEndpoint = ApiUpdateEndpoint;
exports.ApiDeleteEndpoint = ApiDeleteEndpoint;
exports.ApiFileUploadEndpoint = ApiFileUploadEndpoint;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_constants_1 = require("./swagger.constants");
function ApiListEndpoint(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description || `Retrieve a paginated list of ${options.itemName.toLowerCase()}`,
        }),
        (0, swagger_1.ApiQuery)({
            name: 'page',
            required: false,
            description: 'Page number',
            example: 1,
            schema: { type: 'integer', minimum: 1, default: 1 },
        }),
        (0, swagger_1.ApiQuery)({
            name: 'pageSize',
            required: false,
            description: 'Items per page',
            example: 10,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        }),
        (0, swagger_1.ApiQuery)({
            name: 'q',
            required: false,
            description: 'Search query',
            example: 'search term',
            schema: { type: 'string' },
        }),
        (0, swagger_1.ApiQuery)({
            name: 'sortBy',
            required: false,
            description: 'Sort field',
            example: 'createdAt',
            schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'name'] },
        }),
        (0, swagger_1.ApiQuery)({
            name: 'sortOrder',
            required: false,
            description: 'Sort order',
            example: 'desc',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        }),
        (0, swagger_1.ApiResponse)({
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
        (0, swagger_1.ApiResponse)({
            status: 400,
            description: 'Invalid query parameters',
            schema: {
                example: swagger_constants_1.ErrorExamples.VALIDATION,
            },
        }),
    ];
    if (options.authRequired) {
        decorators.push((0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiResponse)({
            status: 401,
            description: 'Authentication required',
            schema: { example: swagger_constants_1.ErrorExamples.UNAUTHORIZED },
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiGetByIdEndpoint(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description || `Retrieve a specific ${options.itemName.toLowerCase()} by ID`,
        }),
        (0, swagger_1.ApiParam)({
            name: options.paramName || 'id',
            description: `${options.itemName} unique identifier`,
            example: 'item_123',
        }),
        (0, swagger_1.ApiResponse)({
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
        (0, swagger_1.ApiResponse)({
            status: 404,
            description: `${options.itemName} not found`,
            schema: { example: swagger_constants_1.ErrorExamples.NOT_FOUND },
        }),
    ];
    if (options.authRequired) {
        decorators.push((0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiResponse)({
            status: 401,
            description: 'Authentication required',
            schema: { example: swagger_constants_1.ErrorExamples.UNAUTHORIZED },
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiCreateEndpoint(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description || `Create a new ${options.itemName.toLowerCase()}`,
        }),
        (0, swagger_1.ApiBody)({ type: options.dtoType }),
        (0, swagger_1.ApiResponse)({
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
        (0, swagger_1.ApiResponse)({
            status: 400,
            description: 'Invalid request data',
            schema: { example: swagger_constants_1.ErrorExamples.VALIDATION },
        }),
        (0, swagger_1.ApiBearerAuth)('JWT-auth'),
        (0, swagger_1.ApiResponse)({
            status: 401,
            description: 'Authentication required',
            schema: { example: swagger_constants_1.ErrorExamples.UNAUTHORIZED },
        }),
    ];
    if (options.adminOnly) {
        decorators.push((0, swagger_1.ApiResponse)({
            status: 403,
            description: 'Admin access required',
            schema: { example: swagger_constants_1.ErrorExamples.FORBIDDEN },
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiUpdateEndpoint(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description || `Update an existing ${options.itemName.toLowerCase()}`,
        }),
        (0, swagger_1.ApiParam)({
            name: options.paramName || 'id',
            description: `${options.itemName} unique identifier`,
            example: 'item_123',
        }),
        (0, swagger_1.ApiBody)({ type: options.dtoType }),
        (0, swagger_1.ApiResponse)({
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
        (0, swagger_1.ApiResponse)({
            status: 400,
            description: 'Invalid request data',
            schema: { example: swagger_constants_1.ErrorExamples.VALIDATION },
        }),
        (0, swagger_1.ApiResponse)({
            status: 404,
            description: `${options.itemName} not found`,
            schema: { example: swagger_constants_1.ErrorExamples.NOT_FOUND },
        }),
        (0, swagger_1.ApiBearerAuth)('JWT-auth'),
        (0, swagger_1.ApiResponse)({
            status: 401,
            description: 'Authentication required',
            schema: { example: swagger_constants_1.ErrorExamples.UNAUTHORIZED },
        }),
    ];
    if (options.adminOnly) {
        decorators.push((0, swagger_1.ApiResponse)({
            status: 403,
            description: 'Admin access required',
            schema: { example: swagger_constants_1.ErrorExamples.FORBIDDEN },
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiDeleteEndpoint(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description || `Delete a ${options.itemName.toLowerCase()}`,
        }),
        (0, swagger_1.ApiParam)({
            name: options.paramName || 'id',
            description: `${options.itemName} unique identifier`,
            example: 'item_123',
        }),
        (0, swagger_1.ApiResponse)({
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
        (0, swagger_1.ApiResponse)({
            status: 404,
            description: `${options.itemName} not found`,
            schema: { example: swagger_constants_1.ErrorExamples.NOT_FOUND },
        }),
        (0, swagger_1.ApiBearerAuth)('JWT-auth'),
        (0, swagger_1.ApiResponse)({
            status: 401,
            description: 'Authentication required',
            schema: { example: swagger_constants_1.ErrorExamples.UNAUTHORIZED },
        }),
    ];
    if (options.adminOnly) {
        decorators.push((0, swagger_1.ApiResponse)({
            status: 403,
            description: 'Admin access required',
            schema: { example: swagger_constants_1.ErrorExamples.FORBIDDEN },
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiFileUploadEndpoint(options) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            summary: options.summary,
            description: options.description || 'Upload file(s) to the server',
        }),
        (0, swagger_1.ApiConsumes)('multipart/form-data'),
        (0, swagger_1.ApiProduces)('application/json'),
        (0, swagger_1.ApiBody)({
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
        (0, swagger_1.ApiResponse)({
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
        (0, swagger_1.ApiResponse)({
            status: 400,
            description: 'Invalid file or file too large',
            schema: { example: swagger_constants_1.ErrorExamples.VALIDATION },
        }),
    ];
    if (options.authRequired) {
        decorators.push((0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiResponse)({
            status: 401,
            description: 'Authentication required',
            schema: { example: swagger_constants_1.ErrorExamples.UNAUTHORIZED },
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=swagger.decorators.js.map