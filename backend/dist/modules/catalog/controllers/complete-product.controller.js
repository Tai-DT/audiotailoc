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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CompleteProductController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../../auth/jwt.guard");
const admin_or_key_guard_1 = require("../../auth/admin-or-key.guard");
const complete_product_service_1 = require("../services/complete-product.service");
const complete_product_dto_1 = require("../dto/complete-product.dto");
let CompleteProductController = CompleteProductController_1 = class CompleteProductController {
    constructor(catalogService) {
        this.catalogService = catalogService;
        this.logger = new common_1.Logger(CompleteProductController_1.name);
    }
    async create(createProductDto) {
        return this.catalogService.createProduct(createProductDto);
    }
    async findAll(query) {
        return this.catalogService.findProducts(query);
    }
    async search(query) {
        const searchTerm = query.search || query.q;
        this.logger.debug(`search called with query="${searchTerm}"`);
        return this.catalogService.searchProducts(query);
    }
    async getSuggestions(query, limit) {
        return this.catalogService.getSearchSuggestions(query, limit);
    }
    async getRecentPublic(limit) {
        return this.catalogService.getRecentProducts(Math.min(limit || 10, 20));
    }
    async getTopViewedPublic(limit) {
        return this.catalogService.getTopViewedProducts(Math.min(limit || 10, 20));
    }
    async getOverviewPublic() {
        const analytics = await this.catalogService.getProductAnalytics();
        return {
            totalProducts: analytics.totalProducts,
            featuredProducts: analytics.featuredProducts,
            categoriesCount: Object.keys(analytics.productsByCategory || {}).length,
            recentProducts: await this.catalogService.getRecentProducts(5),
        };
    }
    async findOne(id) {
        return this.catalogService.findProductById(id);
    }
    async findBySlug(slug) {
        return this.catalogService.findProductBySlug(slug);
    }
    async update(id, updateProductDto) {
        return this.catalogService.updateProduct(id, updateProductDto);
    }
    async remove(id) {
        return this.catalogService.deleteProduct(id);
    }
    async checkDeletable(id) {
        return this.catalogService.checkProductDeletable(id);
    }
    async bulkDelete(ids) {
        return this.catalogService.bulkDeleteProducts(ids);
    }
    async bulkUpdate(bulkUpdateDto) {
        return this.catalogService.bulkUpdateProducts(bulkUpdateDto);
    }
    async duplicate(id) {
        return this.catalogService.duplicateProduct(id);
    }
    async incrementView(id) {
        return this.catalogService.incrementProductView(id);
    }
    async getAnalytics() {
        return this.catalogService.getProductAnalytics();
    }
    async getTopViewed(limit) {
        return this.catalogService.getTopViewedProducts(limit);
    }
    async getRecent(limit) {
        return this.catalogService.getRecentProducts(limit);
    }
    async exportCsv() {
        return this.catalogService.exportProductsToCsv();
    }
    async importCsv(csvData) {
        return this.catalogService.importProductsFromCsv(csvData);
    }
};
exports.CompleteProductController = CompleteProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new product',
        description: 'Create a new product with full specifications, SEO, and inventory management',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Product created successfully',
        type: complete_product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Product with this slug already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get products list',
        description: 'Get paginated list of products with advanced filtering and sorting',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Products retrieved successfully',
        type: complete_product_dto_1.ProductListResponseDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (starts from 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        type: Number,
        description: 'Items per page (1-100)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: complete_product_dto_1.ProductSortBy,
        description: 'Sort field',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        enum: complete_product_dto_1.SortOrder,
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: false,
        type: String,
        description: 'Search query',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minPrice',
        required: false,
        type: Number,
        description: 'Minimum price in cents',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxPrice',
        required: false,
        type: Number,
        description: 'Maximum price in cents',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'categoryId',
        required: false,
        type: String,
        description: 'Filter by category ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'brand',
        required: false,
        type: String,
        description: 'Filter by brand',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'featured',
        required: false,
        type: Boolean,
        description: 'Filter by featured status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filter by active status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'inStock',
        required: false,
        type: Boolean,
        description: 'Filter by stock availability',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'tags',
        required: false,
        type: String,
        description: 'Filter by tags (comma-separated)',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_product_dto_1.ProductListQueryDto]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({
        summary: 'Search products',
        description: 'Advanced product search with fuzzy matching and relevance scoring',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Search results retrieved successfully',
        type: complete_product_dto_1.ProductListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_product_dto_1.ProductListQueryDto]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get search suggestions',
        description: 'Get autocomplete suggestions for search queries',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Suggestions retrieved successfully',
        type: [complete_product_dto_1.ProductSearchSuggestionDto],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: true,
        type: String,
        description: 'Partial search query',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum suggestions (1-20)',
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getSuggestions", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get recently added products (Public)',
        description: 'Get recently added products for public access',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of products to return (1-20)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Recent products retrieved successfully',
        type: [complete_product_dto_1.ProductResponseDto],
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getRecentPublic", null);
__decorate([
    (0, common_1.Get)('top-viewed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get top viewed products (Public)',
        description: 'Get most viewed products for public access',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of products to return (1-20)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Top viewed products retrieved successfully',
        type: [complete_product_dto_1.ProductResponseDto],
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getTopViewedPublic", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product overview (Public)',
        description: 'Get basic product overview for public access',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product overview retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalProducts: { type: 'number' },
                featuredProducts: { type: 'number' },
                categoriesCount: { type: 'number' },
                recentProducts: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ProductResponseDto' },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getOverviewPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by ID',
        description: 'Get detailed product information by ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product retrieved successfully',
        type: complete_product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by slug',
        description: 'Get detailed product information by URL slug',
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Product slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product retrieved successfully',
        type: complete_product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update product',
        description: 'Update product information with partial data',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product updated successfully',
        type: complete_product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Product with this slug already exists',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete product',
        description: 'Soft delete a product (mark as deleted)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Product deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/deletable'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if product can be deleted',
        description: 'Check if a product can be safely deleted (no associated orders)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Product deletion status',
        schema: {
            type: 'object',
            properties: {
                canDelete: { type: 'boolean' },
                message: { type: 'string' },
                associatedOrdersCount: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "checkDeletable", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk delete products',
        description: 'Soft delete multiple products at once',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'ids',
        required: true,
        type: [String],
        description: 'Array of product IDs to delete',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Products deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Patch)('bulk'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk update products',
        description: 'Update multiple products with the same changes',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Products updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_product_dto_1.BulkUpdateProductsDto]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Duplicate product',
        description: 'Create a copy of an existing product',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID to duplicate',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Product duplicated successfully',
        type: complete_product_dto_1.ProductResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Post)(':id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Increment product view count',
        description: 'Increment the view count for a product (used for analytics)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Product ID',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'View count incremented successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Product not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "incrementView", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product analytics',
        description: 'Get comprehensive analytics for products',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Analytics retrieved successfully',
        type: complete_product_dto_1.ProductAnalyticsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/top-viewed'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get top viewed products',
        description: 'Get most viewed products for analytics',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of products to return (1-50)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Top viewed products retrieved successfully',
        type: [complete_product_dto_1.ProductResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getTopViewed", null);
__decorate([
    (0, common_1.Get)('analytics/recent'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get recently added products',
        description: 'Get recently added products for analytics',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of products to return (1-50)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Recent products retrieved successfully',
        type: [complete_product_dto_1.ProductResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Export products to CSV',
        description: 'Export products data to CSV format',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'CSV export generated successfully',
        content: {
            'text/csv': {
                schema: {
                    type: 'string',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Post)('import/csv'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Import products from CSV',
        description: 'Import products data from CSV format',
    }),
    (0, swagger_1.ApiBody)({
        description: 'CSV data as string',
        schema: {
            type: 'object',
            properties: {
                csvData: {
                    type: 'string',
                    description: 'CSV content',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Products imported successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid CSV format',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized - Admin access required',
    }),
    __param(0, (0, common_1.Body)('csvData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompleteProductController.prototype, "importCsv", null);
exports.CompleteProductController = CompleteProductController = CompleteProductController_1 = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('catalog/products'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [complete_product_service_1.CompleteProductService])
], CompleteProductController);
//# sourceMappingURL=complete-product.controller.js.map