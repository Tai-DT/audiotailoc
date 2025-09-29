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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../caching/cache.service");
const PRODUCT_CACHE_TAG = 'catalog:products';
const CATEGORY_CACHE_TAG = 'catalog:categories';
let CatalogService = class CatalogService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async listProducts(params = {}) {
        const page = Math.max(1, Math.floor(params.page ?? 1));
        const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
        const where = {};
        if (params.q) {
            where.OR = [
                { name: { contains: params.q, mode: 'insensitive' } },
                { description: { contains: params.q, mode: 'insensitive' } },
            ];
        }
        if (typeof params.minPrice === 'number')
            where.priceCents = { ...(where.priceCents || {}), gte: params.minPrice };
        if (typeof params.maxPrice === 'number')
            where.priceCents = { ...(where.priceCents || {}), lte: params.maxPrice };
        if (typeof params.featured === 'boolean')
            where.featured = params.featured;
        const orderByField = (params.sortBy === 'price' ? 'priceCents' : params.sortBy === 'viewCount' ? 'viewCount' : params.sortBy) ?? 'createdAt';
        const orderDirection = params.sortOrder ?? 'desc';
        const cacheKey = `products:list:${JSON.stringify({ where, page, pageSize, orderByField, orderDirection })}`;
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        const [total, rawItems] = await this.prisma.$transaction([
            this.prisma.products.count({ where }),
            this.prisma.products.findMany({
                where,
                orderBy: { [orderByField]: orderDirection },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        const items = rawItems.map(item => ({
            ...item,
            priceCents: Number(item.priceCents),
            originalPriceCents: item.originalPriceCents ? Number(item.originalPriceCents) : null,
            images: (typeof item.images === 'string') ? JSON.parse(item.images) : item.images,
            specifications: (typeof item.specifications === 'string') ? JSON.parse(item.specifications) : item.specifications,
        }));
        const result = { items, total, page, pageSize };
        await this.cache.set(cacheKey, result, { ttl: 60, tags: [PRODUCT_CACHE_TAG] });
        return result;
    }
    async getById(id) {
        const product = await this.prisma.products.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        let parsedImages = product.images;
        let parsedSpecifications = product.specifications;
        if (typeof product.images === 'string') {
            try {
                parsedImages = JSON.parse(product.images);
            }
            catch (error) {
                console.error('Error parsing images:', error);
            }
        }
        if (typeof product.specifications === 'string') {
            try {
                parsedSpecifications = JSON.parse(product.specifications);
            }
            catch (error) {
                console.error('Error parsing specifications:', error);
            }
        }
        return {
            ...product,
            priceCents: Number(product.priceCents),
            originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
            images: parsedImages,
            specifications: parsedSpecifications,
        };
    }
    async getBySlug(slug) {
        const product = await this.prisma.products.findUnique({ where: { slug } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return {
            ...product,
            priceCents: Number(product.priceCents),
            originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
            images: (typeof product.images === 'string') ? JSON.parse(product.images) : product.images,
            specifications: (typeof product.specifications === 'string') ? JSON.parse(product.specifications) : product.specifications,
        };
    }
    async checkSkuExists(sku, excludeId) {
        const where = { sku };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        const count = await this.prisma.products.count({ where });
        return count > 0;
    }
    async generateUniqueSku(baseName) {
        const base = baseName ? baseName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8) : 'PROD';
        let sku = base;
        let counter = 1;
        while (await this.checkSkuExists(sku)) {
            sku = `${base}-${counter.toString().padStart(3, '0')}`;
            counter++;
            if (counter > 999) {
                sku = `${base}-${Date.now().toString().slice(-6)}`;
                break;
            }
        }
        return sku;
    }
    async create(data) {
        if (data.priceCents <= 0) {
            throw new Error('Price must be greater than 0');
        }
        let slug = data.slug;
        if (!slug) {
            slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/ +/g, '-')
                .replace(/-+/g, '-')
                .trim();
            if (slug) {
                const existing = await this.prisma.products.findUnique({ where: { slug } });
                if (existing) {
                    let counter = 1;
                    let uniqueSlug = `${slug}-${counter}`;
                    while (await this.prisma.products.findUnique({ where: { slug: uniqueSlug } })) {
                        counter++;
                        uniqueSlug = `${slug}-${counter}`;
                    }
                    slug = uniqueSlug;
                }
            }
        }
        else {
            const existed = await this.prisma.products.findUnique({ where: { slug: data.slug } });
            if (existed) {
                throw new Error('Product with this slug already exists');
            }
        }
        const productData = {
            slug: slug,
            name: data.name,
            description: data.description,
            shortDescription: data.shortDescription || data.description?.substring(0, 200),
            priceCents: data.priceCents,
            originalPriceCents: data.originalPriceCents || data.priceCents,
            imageUrl: data.images?.[0] || null,
            images: data.images ? JSON.stringify(data.images) : null,
            categoryId: data.categoryId,
            brand: data.brand,
            model: data.model,
            sku: data.sku,
            specifications: data.specifications ? JSON.stringify(data.specifications) : null,
            features: data.features,
            warranty: data.warranty,
            weight: data.weight,
            dimensions: data.dimensions,
            stockQuantity: data.stockQuantity || 0,
            maxStock: data.maxStock,
            minOrderQuantity: data.minOrderQuantity || 1,
            maxOrderQuantity: data.maxOrderQuantity,
            tags: data.tags,
            metaTitle: data.metaTitle || data.name,
            metaDescription: data.metaDescription || data.description?.substring(0, 160),
            metaKeywords: data.metaKeywords,
            canonicalUrl: data.canonicalUrl,
            featured: data.featured || false,
            isActive: data.isActive ?? true,
        };
        const product = await this.prisma.products.create({ data: productData });
        await this.cache.invalidateByTags([PRODUCT_CACHE_TAG]);
        return {
            ...product,
            priceCents: Number(product.priceCents),
            originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
            images: (typeof product.images === 'string') ? JSON.parse(product.images) : product.images,
            specifications: (typeof product.specifications === 'string') ? JSON.parse(product.specifications) : product.specifications,
        };
    }
    async update(id, data) {
        const existingProduct = await this.prisma.products.findUnique({ where: { id } });
        if (!existingProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.description !== undefined) {
            updateData.description = data.description;
            updateData.shortDescription = data.description?.substring(0, 200);
        }
        if (data.priceCents !== undefined)
            updateData.priceCents = data.priceCents;
        if (data.originalPriceCents !== undefined)
            updateData.originalPriceCents = data.originalPriceCents;
        if (data.images !== undefined) {
            updateData.imageUrl = data.images?.[0] || null;
            updateData.images = data.images ? JSON.stringify(data.images) : null;
        }
        if (data.imageUrl !== undefined) {
            updateData.imageUrl = data.imageUrl;
            if (data.imageUrl) {
                updateData.images = JSON.stringify([data.imageUrl]);
            }
            else {
                updateData.images = null;
            }
        }
        if (data.categoryId !== undefined)
            updateData.categoryId = data.categoryId;
        if (data.brand !== undefined)
            updateData.brand = data.brand;
        if (data.model !== undefined)
            updateData.model = data.model;
        if (data.sku !== undefined)
            updateData.sku = data.sku;
        if (data.specifications !== undefined) {
            updateData.specifications = data.specifications ? JSON.stringify(data.specifications) : null;
        }
        if (data.features !== undefined)
            updateData.features = data.features;
        if (data.warranty !== undefined)
            updateData.warranty = data.warranty;
        if (data.weight !== undefined)
            updateData.weight = data.weight;
        if (data.dimensions !== undefined)
            updateData.dimensions = data.dimensions;
        if (data.stockQuantity !== undefined)
            updateData.stockQuantity = data.stockQuantity;
        if (data.maxStock !== undefined)
            updateData.maxStock = data.maxStock;
        if (data.minOrderQuantity !== undefined)
            updateData.minOrderQuantity = data.minOrderQuantity;
        if (data.maxOrderQuantity !== undefined)
            updateData.maxOrderQuantity = data.maxOrderQuantity;
        if (data.tags !== undefined)
            updateData.tags = data.tags;
        if (data.metaTitle !== undefined)
            updateData.metaTitle = data.metaTitle;
        if (data.metaDescription !== undefined)
            updateData.metaDescription = data.metaDescription;
        if (data.metaKeywords !== undefined)
            updateData.metaKeywords = data.metaKeywords;
        if (data.canonicalUrl !== undefined)
            updateData.canonicalUrl = data.canonicalUrl;
        if (data.featured !== undefined)
            updateData.featured = data.featured;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        const product = await this.prisma.products.update({
            where: { id },
            data: updateData
        });
        await this.cache.invalidateByTags([PRODUCT_CACHE_TAG]);
        return {
            ...product,
            priceCents: Number(product.priceCents),
            originalPriceCents: product.originalPriceCents ? Number(product.originalPriceCents) : null,
            images: (typeof product.images === 'string') ? JSON.parse(product.images) : product.images,
            specifications: (typeof product.specifications === 'string') ? JSON.parse(product.specifications) : product.specifications,
        };
    }
    async remove(id) {
        try {
            const product = await this.prisma.products.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { order_items: true }
                    }
                }
            });
            if (!product) {
                return { deleted: false, message: 'Product not found' };
            }
            if (product._count.order_items > 0) {
                return {
                    deleted: false,
                    message: `Cannot delete product "${product.name}" because it has ${product._count.order_items} associated order(s). Please remove or update the orders first.`
                };
            }
            await this.prisma.inventory.deleteMany({
                where: { productId: id }
            });
            const res = await this.prisma.products.deleteMany({ where: { id } });
            await this.cache.invalidateByTags([PRODUCT_CACHE_TAG]);
            return { deleted: (res.count ?? 0) > 0 };
        }
        catch (error) {
            console.error('Error deleting product:', error);
            return { deleted: false, message: 'An error occurred while deleting the product' };
        }
    }
    async listCategories() {
        const key = 'categories:list';
        const cached = await this.cache.get(key);
        if (cached)
            return cached;
        const items = await this.prisma.categories.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { products: true } },
            },
        });
        const result = items.map(item => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            parentId: item.parentId,
            description: item.description ?? null,
            isActive: item.isActive,
            productCount: item._count?.products ?? 0,
        }));
        await this.cache.set(key, result, { ttl: 300, tags: [CATEGORY_CACHE_TAG] });
        return result;
    }
    async getCategoryById(id) {
        const category = await this.prisma.categories.findUnique({
            where: { id },
            include: {
                _count: { select: { products: true } },
            },
        });
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return {
            id: category.id,
            slug: category.slug,
            name: category.name,
            parentId: category.parentId,
            description: category.description ?? null,
            isActive: category.isActive,
            productCount: category._count?.products ?? 0,
        };
    }
    async createCategory(data) {
        let slug = data.slug;
        if (!slug) {
            slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }
        const existing = await this.prisma.categories.findUnique({ where: { slug } });
        if (existing) {
            let counter = 1;
            let uniqueSlug = `${slug}-${counter}`;
            while (await this.prisma.categories.findUnique({ where: { slug: uniqueSlug } })) {
                counter++;
                uniqueSlug = `${slug}-${counter}`;
            }
            slug = uniqueSlug;
        }
        const category = await this.prisma.categories.create({
            data: {
                name: data.name,
                slug,
                parentId: data.parentId,
                isActive: data.isActive ?? true,
                description: data.description,
            },
        });
        await this.cache.invalidateByTags([CATEGORY_CACHE_TAG]);
        return {
            id: category.id,
            slug: category.slug,
            name: category.name,
            parentId: category.parentId,
            description: category.description ?? null,
            isActive: category.isActive,
            productCount: 0,
        };
    }
    async updateCategory(id, data) {
        const existingCategory = await this.prisma.categories.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw new Error(`Category with id ${id} not found`);
        }
        if (data.slug) {
            const existing = await this.prisma.categories.findFirst({
                where: { slug: data.slug, id: { not: id } },
            });
            if (existing) {
                throw new Error('Category with this slug already exists');
            }
        }
        const category = await this.prisma.categories.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.slug && { slug: data.slug }),
                ...(data.parentId !== undefined && { parentId: data.parentId }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                ...(data.description !== undefined && { description: data.description }),
            },
            include: { _count: { select: { products: true } } },
        });
        await this.cache.invalidateByTags([CATEGORY_CACHE_TAG]);
        return {
            id: category.id,
            slug: category.slug,
            name: category.name,
            parentId: category.parentId,
            description: category.description ?? null,
            isActive: category.isActive,
            productCount: category._count?.products ?? 0,
        };
    }
    async deleteCategory(id) {
        try {
            const [productCount, subcategoryCount] = await Promise.all([
                this.prisma.products.count({ where: { categoryId: id } }),
                this.prisma.categories.count({ where: { parentId: id } }),
            ]);
            if (productCount > 0) {
                throw new Error(`Cannot delete category because it has ${productCount} associated product(s). Please remove or reassign the products first.`);
            }
            if (subcategoryCount > 0) {
                throw new Error(`Cannot delete category because it has ${subcategoryCount} subcategory(ies). Please remove or reassign the subcategories first.`);
            }
            await this.prisma.categories.delete({ where: { id } });
            await this.cache.invalidateByTags([CATEGORY_CACHE_TAG]);
            return { deleted: true };
        }
        catch (error) {
            console.error('Error deleting category:', error);
            return { deleted: false, message: error instanceof Error ? error.message : 'An error occurred while deleting the category' };
        }
    }
    async removeMany(slugs) {
        if (!slugs || slugs.length === 0)
            return { deleted: 0 };
        const res = await this.prisma.products.deleteMany({ where: { slug: { in: slugs } } });
        await this.cache.invalidateByTags([PRODUCT_CACHE_TAG]);
        return { deleted: res.count };
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cache_service_1.CacheService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map