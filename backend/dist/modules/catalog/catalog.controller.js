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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const catalog_service_1 = require("./catalog.service");
const class_validator_1 = require("class-validator");
const jwt_guard_1 = require("../auth/jwt.guard");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
class DeleteManyDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DeleteManyDto.prototype, "ids", void 0);
let CatalogController = class CatalogController {
    constructor(catalog) {
        this.catalog = catalog;
    }
    list(query) {
        const { page, pageSize, q, minPrice, maxPrice, sortBy, sortOrder, featured, search } = query;
        return this.catalog.listProducts({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 20,
            q: search || q,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            sortBy: sortBy || 'createdAt',
            sortOrder: sortOrder || 'desc',
            featured: featured === 'true' ? true : undefined
        });
    }
    listCategories() {
        return this.catalog.listCategories();
    }
    getCategoryBySlug(slug) {
        return this.catalog.getCategoryBySlug(slug);
    }
    getProductsByCategory(slug, page, limit) {
        return this.catalog.getProductsByCategory(slug, { page, limit });
    }
    createCategory(dto) {
        return this.catalog.createCategory(dto);
    }
    updateCategory(id, dto) {
        return this.catalog.updateCategory(id, dto);
    }
    deleteCategory(id) {
        return this.catalog.deleteCategory(id);
    }
    searchProducts(q, limit) {
        const limitNum = Math.min(parseInt(limit?.toString() || '20'), 50);
        return this.catalog.listProducts({
            page: 1,
            pageSize: limitNum,
            q: q || '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    }
    get(id) {
        return this.catalog.getById(id);
    }
    getBySlug(slug) {
        return this.catalog.getBySlug(slug);
    }
    async checkSkuExists(sku, excludeId) {
        return this.catalog.checkSkuExists(sku, excludeId);
    }
    async generateUniqueSku(baseName) {
        return this.catalog.generateUniqueSku(baseName);
    }
    create(dto) {
        return this.catalog.create(dto);
    }
    update(id, dto) {
        return this.catalog.update(id, dto);
    }
    remove(id) {
        return this.catalog.remove(id);
    }
    removeMany(body) {
        return this.catalog.removeMany(body?.ids ?? []);
    }
    async getTopViewedProducts(limit) {
        try {
            const limitNum = Math.min(parseInt(limit?.toString() || '10'), 50);
            return await this.catalog.listProducts({
                page: 1,
                pageSize: limitNum,
                sortBy: 'viewCount',
                sortOrder: 'desc'
            });
        }
        catch (error) {
            console.error('Error fetching top-viewed products:', error);
            return {
                items: [],
                total: 0,
                page: 1,
                pageSize: Math.min(parseInt(limit?.toString() || '10'), 50),
            };
        }
    }
    async getRecentProducts(limit) {
        const limitNum = Math.min(parseInt(limit?.toString() || '10'), 50);
        return this.catalog.listProducts({
            page: 1,
            pageSize: limitNum,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Get)('products'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "listCategories", null);
__decorate([
    (0, common_1.Get)('categories/slug/:slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get category by slug',
        description: 'Get detailed category information by slug',
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Category slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Category retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "getCategoryBySlug", null);
__decorate([
    (0, common_1.Get)('categories/slug/:slug/products'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get products by category slug',
        description: 'Get paginated products for a specific category',
    }),
    (0, swagger_1.ApiParam)({
        name: 'slug',
        description: 'Category slug',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Products retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Category not found',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('categories'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "createCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('products/search'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('products/slug/:slug'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "getBySlug", null);
__decorate([
    (0, common_1.Get)('products/check-sku/:sku'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    __param(0, (0, common_1.Param)('sku')),
    __param(1, (0, common_1.Query)('excludeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "checkSkuExists", null);
__decorate([
    (0, common_1.Get)('generate-sku'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    __param(0, (0, common_1.Query)('baseName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "generateUniqueSku", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('products'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Patch)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteManyDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "removeMany", null);
__decorate([
    (0, common_1.Get)('products/analytics/top-viewed'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getTopViewedProducts", null);
__decorate([
    (0, common_1.Get)('products/analytics/recent'),
    (0, common_1.UseGuards)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getRecentProducts", null);
exports.CatalogController = CatalogController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('catalog'),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map