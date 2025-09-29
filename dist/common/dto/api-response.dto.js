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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckDto = exports.ErrorResponseDto = exports.PaginatedResponseDto = exports.PaginationDto = exports.ApiResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ApiResponseDto {
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ApiResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message',
        example: 'Operation completed successfully',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Response data',
    }),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Timestamp of the response',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Request ID for tracking',
        example: 'req_1234567890',
    }),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "requestId", void 0);
class PaginationDto {
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
        minimum: 1,
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of items',
        example: 100,
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 10,
    }),
    __metadata("design:type", Number)
], PaginationDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if there is a next page',
        example: true,
    }),
    __metadata("design:type", Boolean)
], PaginationDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if there is a previous page',
        example: false,
    }),
    __metadata("design:type", Boolean)
], PaginationDto.prototype, "hasPrev", void 0);
class PaginatedResponseDto extends ApiResponseDto {
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pagination information',
        type: PaginationDto,
    }),
    (0, class_transformer_1.Type)(() => PaginationDto),
    __metadata("design:type", PaginationDto)
], PaginatedResponseDto.prototype, "pagination", void 0);
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the request was successful',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ErrorResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message',
        example: 'Invalid request parameters',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error code',
        example: 'VALIDATION_ERROR',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "errorCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed error information',
        example: ['Name is required', 'Price must be a positive number'],
    }),
    __metadata("design:type", Array)
], ErrorResponseDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the error',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Request ID for tracking',
        example: 'req_1234567890',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "requestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Path that caused the error',
        example: '/api/v1/catalog/products',
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "path", void 0);
class HealthCheckDto {
}
exports.HealthCheckDto = HealthCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service status',
        example: 'ok',
        enum: ['ok', 'error', 'maintenance'],
    }),
    __metadata("design:type", String)
], HealthCheckDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service uptime in seconds',
        example: 3600,
    }),
    __metadata("design:type", Number)
], HealthCheckDto.prototype, "uptime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Service version',
        example: '1.0.0',
    }),
    __metadata("design:type", String)
], HealthCheckDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Environment',
        example: 'development',
    }),
    __metadata("design:type", String)
], HealthCheckDto.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional info',
    }),
    __metadata("design:type", Object)
], HealthCheckDto.prototype, "info", void 0);
//# sourceMappingURL=api-response.dto.js.map