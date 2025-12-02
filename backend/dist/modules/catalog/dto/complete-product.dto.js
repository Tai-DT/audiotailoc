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
exports.ImportResultDto = exports.ProductSearchSuggestionDto = exports.BulkUpdateProductsDto = exports.ProductAnalyticsDto = exports.ProductListResponseDto = exports.ProductResponseDto = exports.ProductListQueryDto = exports.UpdateProductDto = exports.CreateProductDto = exports.ProductSpecificationDto = exports.SortOrder = exports.ProductSortBy = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var ProductSortBy;
(function (ProductSortBy) {
    ProductSortBy["CREATED_AT"] = "createdAt";
    ProductSortBy["NAME"] = "name";
    ProductSortBy["PRICE"] = "price";
    ProductSortBy["UPDATED_AT"] = "updatedAt";
    ProductSortBy["VIEW_COUNT"] = "viewCount";
})(ProductSortBy || (exports.ProductSortBy = ProductSortBy = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class ProductSpecificationDto {
}
exports.ProductSpecificationDto = ProductSpecificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification key',
        example: 'Power Output',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], ProductSpecificationDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specification value',
        example: '100W RMS',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], ProductSpecificationDto.prototype, "value", void 0);
class CreateProductDto {
    constructor() {
        this.minOrderQuantity = 1;
        this.isActive = true;
        this.featured = false;
    }
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Premium Audio Cable',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product slug (auto-generated if not provided)',
        example: 'premium-audio-cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === null ? undefined : value)),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product description',
        example: 'High-quality audio cable for professional use',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short description',
        example: 'Premium quality audio cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateProductDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product price in cents',
        example: 299000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "priceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original price in cents (for discounts)',
        example: 399000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "originalPriceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SKU (Stock Keeping Unit)',
        example: 'AUDIO-CABLE-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty information',
        example: '12 months',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "warranty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product features (comma-separated)',
        example: 'High quality, Durable, Warranty included',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity',
        example: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "minOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum order quantity',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "maxOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product tags (comma-separated)',
        example: 'audio,cable,premium',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand name',
        example: 'AudioTech',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'AT-1000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateProductDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product weight in grams',
        example: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product dimensions (LxWxH)',
        example: '20x10x5 cm',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product specifications',
        type: [ProductSpecificationDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductSpecificationDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product images URLs',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is product active',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is product featured',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta title for SEO',
        example: 'Premium Audio Cable - High Quality Audio Equipment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta description for SEO',
        example: 'Buy premium audio cable for professional audio equipment. High quality, durable, and affordable.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta keywords for SEO',
        example: 'audio cable, premium audio, professional equipment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaKeywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Canonical URL',
        example: 'https://audiotailoc.com/products/premium-audio-cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "canonicalUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Stock quantity',
        example: 100,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stockQuantity", void 0);
class UpdateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product name',
        example: 'Premium Audio Cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product slug',
        example: 'premium-audio-cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product description',
        example: 'High-quality audio cable for professional use',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short description',
        example: 'Premium quality audio cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product price in cents',
        example: 299000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "priceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original price in cents (for discounts)',
        example: 399000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "originalPriceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SKU (Stock Keeping Unit)',
        example: 'AUDIO-CABLE-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty information',
        example: '12 months',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "warranty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product features (comma-separated)',
        example: 'High quality, Durable, Warranty included',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum order quantity',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "minOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum order quantity',
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "maxOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product tags (comma-separated)',
        example: 'audio,cable,premium',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand name',
        example: 'AudioTech',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product model',
        example: 'AT-1000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product weight in grams',
        example: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product dimensions (LxWxH)',
        example: '20x10x5 cm',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product specifications',
        type: [ProductSpecificationDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductSpecificationDto),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product images URLs',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(10),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is product active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is product featured',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta title for SEO',
        example: 'Premium Audio Cable - High Quality Audio Equipment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta description for SEO',
        example: 'Buy premium audio cable for professional audio equipment. High quality, durable, and affordable.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta keywords for SEO',
        example: 'audio cable, premium audio, professional equipment',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "metaKeywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Canonical URL',
        example: 'https://audiotailoc.com/products/premium-audio-cable',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "canonicalUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Stock quantity',
        example: 100,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "stockQuantity", void 0);
class ProductListQueryDto {
    constructor() {
        this.page = 1;
        this.pageSize = 20;
        this.sortBy = ProductSortBy.CREATED_AT;
        this.sortOrder = SortOrder.DESC;
    }
}
exports.ProductListQueryDto = ProductListQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number (starts from 1)',
        example: 1,
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProductListQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProductListQueryDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort by field',
        example: 'createdAt',
        enum: ProductSortBy,
        default: ProductSortBy.CREATED_AT,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ProductSortBy),
    __metadata("design:type", String)
], ProductListQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'desc',
        enum: SortOrder,
        default: SortOrder.DESC,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], ProductListQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query',
        example: 'wireless speaker',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductListQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID filter',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductListQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], ProductListQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by featured status',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], ProductListQueryDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum price in cents',
        example: 100000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductListQueryDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum price in cents',
        example: 500000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductListQueryDto.prototype, "maxPrice", void 0);
class ProductResponseDto {
}
exports.ProductResponseDto = ProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product ID',
        example: 'product-uuid',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product slug',
        example: 'premium-audio-cable',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Premium Audio Cable',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product description',
        example: 'High-quality audio cable for professional use',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Short description',
        example: 'Premium quality audio cable',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product price in cents',
        example: 299000,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "priceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original price in cents',
        example: 399000,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "originalPriceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SKU',
        example: 'AUDIO-CABLE-001',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warranty',
        example: '12 months',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "warranty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Features',
        example: 'High quality, Durable, Warranty included',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum order quantity',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "minOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum order quantity',
        example: 10,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "maxOrderQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags',
        example: 'audio,cable,premium',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category information',
        type: Object,
    }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand',
        example: 'AudioTech',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Model',
        example: 'AT-1000',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Weight in grams',
        example: 500,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dimensions',
        example: '20x10x5 cm',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specifications',
        type: [ProductSpecificationDto],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Images URLs',
        type: [String],
    }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Is featured',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'View count',
        example: 150,
    }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "viewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Created at',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated at',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta title',
        example: 'Premium Audio Cable - High Quality Audio Equipment',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta description',
        example: 'Buy premium audio cable for professional audio equipment',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Meta keywords',
        example: 'audio cable, premium audio, professional equipment',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "metaKeywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Canonical URL',
        example: 'https://audiotailoc.com/products/premium-audio-cable',
    }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "canonicalUrl", void 0);
class ProductListResponseDto {
}
exports.ProductListResponseDto = ProductListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of products',
        type: [ProductResponseDto],
    }),
    __metadata("design:type", Array)
], ProductListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of products',
        example: 150,
    }),
    __metadata("design:type", Number)
], ProductListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProductListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page size',
        example: 20,
    }),
    __metadata("design:type", Number)
], ProductListResponseDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total pages',
        example: 8,
    }),
    __metadata("design:type", Number)
], ProductListResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Has next page',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ProductListResponseDto.prototype, "hasNext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Has previous page',
        example: false,
    }),
    __metadata("design:type", Boolean)
], ProductListResponseDto.prototype, "hasPrev", void 0);
class ProductAnalyticsDto {
}
exports.ProductAnalyticsDto = ProductAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of products',
        example: 150,
    }),
    __metadata("design:type", Number)
], ProductAnalyticsDto.prototype, "totalProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of active products',
        example: 120,
    }),
    __metadata("design:type", Number)
], ProductAnalyticsDto.prototype, "activeProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of featured products',
        example: 15,
    }),
    __metadata("design:type", Number)
], ProductAnalyticsDto.prototype, "featuredProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of out of stock products',
        example: 5,
    }),
    __metadata("design:type", Number)
], ProductAnalyticsDto.prototype, "outOfStockProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total view count',
        example: 15420,
    }),
    __metadata("design:type", Number)
], ProductAnalyticsDto.prototype, "totalViews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average price',
        example: 250000,
    }),
    __metadata("design:type", Number)
], ProductAnalyticsDto.prototype, "averagePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Products by category',
        example: { 'audio-cables': 25, speakers: 30 },
    }),
    __metadata("design:type", Object)
], ProductAnalyticsDto.prototype, "productsByCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top viewed products',
        type: [ProductResponseDto],
    }),
    __metadata("design:type", Array)
], ProductAnalyticsDto.prototype, "topViewedProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recent products',
        type: [ProductResponseDto],
    }),
    __metadata("design:type", Array)
], ProductAnalyticsDto.prototype, "recentProducts", void 0);
class BulkUpdateProductsDto {
}
exports.BulkUpdateProductsDto = BulkUpdateProductsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product IDs to update',
        type: [String],
        example: ['product-id-1', 'product-id-2'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkUpdateProductsDto.prototype, "productIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update active status',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], BulkUpdateProductsDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update featured status',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], BulkUpdateProductsDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Add tags (comma-separated)',
        example: 'new-tag,another-tag',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdateProductsDto.prototype, "addTags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Remove tags (comma-separated)',
        example: 'old-tag',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdateProductsDto.prototype, "removeTags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update category ID',
        example: 'new-category-id',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkUpdateProductsDto.prototype, "categoryId", void 0);
class ProductSearchSuggestionDto {
}
exports.ProductSearchSuggestionDto = ProductSearchSuggestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Suggestion text',
        example: 'Wireless Speaker',
    }),
    __metadata("design:type", String)
], ProductSearchSuggestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Suggestion type',
        enum: ['product', 'category', 'brand'],
        example: 'product',
    }),
    __metadata("design:type", String)
], ProductSearchSuggestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product count for this suggestion',
        example: 25,
    }),
    __metadata("design:type", Number)
], ProductSearchSuggestionDto.prototype, "count", void 0);
class ImportResultDto {
}
exports.ImportResultDto = ImportResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of products imported',
        example: 10,
    }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "imported", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Import errors',
        type: [String],
        example: ['Row 2: Missing name', 'Row 5: Invalid price'],
    }),
    __metadata("design:type", Array)
], ImportResultDto.prototype, "errors", void 0);
//# sourceMappingURL=complete-product.dto.js.map