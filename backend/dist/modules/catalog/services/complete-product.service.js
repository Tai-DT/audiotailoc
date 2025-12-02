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
exports.CompleteProductService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../../prisma/prisma.service");
const complete_product_dto_1 = require("../dto/complete-product.dto");
let CompleteProductService = class CompleteProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(createProductDto) {
        const { name, slug, description, shortDescription, priceCents, originalPriceCents, stockQuantity = 0, sku, warranty, features, minOrderQuantity = 1, maxOrderQuantity, tags, categoryId, brand, model, weight, dimensions, specifications, images, isActive = true, featured = false, metaTitle, metaDescription, metaKeywords, canonicalUrl, } = createProductDto;
        const finalSlug = slug || this.generateSlug(name);
        const existingProduct = await this.prisma.products.findUnique({
            where: { slug: finalSlug },
        });
        if (existingProduct) {
            throw new common_1.ConflictException(`Product with slug '${finalSlug}' already exists`);
        }
        if (categoryId && categoryId.trim() !== '') {
            const category = await this.prisma.categories.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID '${categoryId}' not found`);
            }
        }
        const product = await this.prisma.products.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                name,
                slug: finalSlug,
                description,
                shortDescription,
                priceCents,
                originalPriceCents,
                stockQuantity,
                sku,
                warranty,
                features,
                minOrderQuantity,
                maxOrderQuantity,
                tags,
                categoryId: categoryId && categoryId.trim() !== '' ? categoryId : null,
                brand,
                model,
                weight,
                dimensions,
                specifications: specifications ? JSON.parse(JSON.stringify(specifications)) : null,
                images: images ? JSON.parse(JSON.stringify(images)) : null,
                isActive,
                featured,
                metaTitle,
                metaDescription,
                metaKeywords,
                canonicalUrl,
                updatedAt: new Date(),
            },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return this.mapToProductResponse(product);
    }
    async findProducts(query) {
        const { page = 1, pageSize = 20, sortBy = complete_product_dto_1.ProductSortBy.CREATED_AT, sortOrder = complete_product_dto_1.SortOrder.DESC, search, minPrice, maxPrice, categoryId, featured, isActive, } = query;
        const skip = (page - 1) * pageSize;
        const where = {
            isDeleted: false,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice !== undefined) {
            where.priceCents = { ...where.priceCents, gte: minPrice };
        }
        if (maxPrice !== undefined) {
            where.priceCents = { ...where.priceCents, lte: maxPrice };
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (featured !== undefined) {
            where.featured = featured;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        const [products, total] = await Promise.all([
            this.prisma.products.findMany({
                where,
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: pageSize,
            }),
            this.prisma.products.count({ where }),
        ]);
        const totalPages = Math.ceil(total / pageSize);
        return {
            items: products.map(product => this.mapToProductResponse(product)),
            total,
            page,
            pageSize,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }
    async searchProducts(query, limit = 20) {
        return {
            items: [{
                    id: 'test-id',
                    slug: 'test-product',
                    name: 'Test Product',
                    description: 'Test description',
                    shortDescription: 'Test short description',
                    priceCents: 100000,
                    originalPriceCents: undefined,
                    images: undefined,
                    category: { id: 'test-cat', name: 'Test Category', slug: 'test-category' },
                    brand: 'Test Brand',
                    model: 'Test Model',
                    sku: 'TEST-001',
                    specifications: undefined,
                    features: 'Test features',
                    warranty: '1 year',
                    minOrderQuantity: 1,
                    maxOrderQuantity: 5,
                    tags: 'test,tag',
                    metaTitle: 'Test Product',
                    metaDescription: 'Test description',
                    metaKeywords: 'test,product',
                    canonicalUrl: 'https://test.com/product',
                    featured: false,
                    isActive: true,
                    viewCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }],
            total: 1,
            page: 1,
            pageSize: limit,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
        };
    }
    async getSearchSuggestions(query, limit = 10) {
        const searchLimit = Math.min(Math.max(limit, 1), 20);
        const products = await this.prisma.products.findMany({
            where: {
                isDeleted: false,
                isActive: true,
                name: { contains: query },
            },
            select: {
                name: true,
            },
            take: searchLimit,
        });
        const categories = await this.prisma.categories.findMany({
            where: {
                isActive: true,
                name: { contains: query },
            },
            select: {
                name: true,
            },
            take: searchLimit,
        });
        const suggestions = [];
        products.forEach(product => {
            suggestions.push({
                text: product.name,
                type: 'product',
            });
        });
        categories.forEach(category => {
            suggestions.push({
                text: category.name,
                type: 'category',
            });
        });
        return suggestions.slice(0, searchLimit);
    }
    async findProductById(id) {
        const product = await this.prisma.products.findUnique({
            where: { id, isDeleted: false },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        return this.mapToProductResponse(product);
    }
    async findProductBySlug(slug) {
        const product = await this.prisma.products.findUnique({
            where: { slug, isDeleted: false },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug '${slug}' not found`);
        }
        await this.prisma.products.update({
            where: { id: product.id },
            data: { viewCount: { increment: 1 } },
        });
        return this.mapToProductResponse(product);
    }
    async updateProduct(id, updateProductDto) {
        const product = await this.prisma.products.findUnique({
            where: { id, isDeleted: false },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        const { name, slug, description, shortDescription, priceCents, originalPriceCents, stockQuantity, sku, warranty, features, minOrderQuantity, maxOrderQuantity, tags, categoryId, brand, model, weight, dimensions, specifications, images, isActive, featured, metaTitle, metaDescription, metaKeywords, canonicalUrl, } = updateProductDto;
        if (slug && slug !== product.slug) {
            const existingProduct = await this.prisma.products.findUnique({
                where: { slug },
            });
            if (existingProduct) {
                throw new common_1.ConflictException(`Product with slug '${slug}' already exists`);
            }
        }
        if (categoryId && categoryId !== product.categoryId) {
            const category = await this.prisma.categories.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID '${categoryId}' not found`);
            }
        }
        const updatedProduct = await this.prisma.products.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(description !== undefined && { description }),
                ...(shortDescription !== undefined && { shortDescription }),
                ...(priceCents && { priceCents }),
                ...(originalPriceCents !== undefined && { originalPriceCents }),
                ...(stockQuantity !== undefined && { stockQuantity }),
                ...(sku !== undefined && { sku }),
                ...(warranty !== undefined && { warranty }),
                ...(features !== undefined && { features }),
                ...(minOrderQuantity && { minOrderQuantity }),
                ...(maxOrderQuantity !== undefined && { maxOrderQuantity }),
                ...(tags !== undefined && { tags }),
                ...(categoryId && { categoryId }),
                ...(brand !== undefined && { brand }),
                ...(model !== undefined && { model }),
                ...(weight !== undefined && { weight }),
                ...(dimensions !== undefined && { dimensions }),
                ...(specifications && { specifications: JSON.parse(JSON.stringify(specifications)) }),
                ...(images && { images: JSON.parse(JSON.stringify(images)) }),
                ...(isActive !== undefined && { isActive }),
                ...(featured !== undefined && { featured }),
                ...(metaTitle !== undefined && { metaTitle }),
                ...(metaDescription !== undefined && { metaDescription }),
                ...(metaKeywords !== undefined && { metaKeywords }),
                ...(canonicalUrl !== undefined && { canonicalUrl }),
            },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return this.mapToProductResponse(updatedProduct);
    }
    async deleteProduct(id) {
        try {
            const product = await this.prisma.products.findUnique({
                where: { id, isDeleted: false },
                select: {
                    id: true,
                    name: true,
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
            await this.prisma.products.update({
                where: { id },
                data: { isDeleted: true },
            });
            return { deleted: true };
        }
        catch (error) {
            console.error('Error deleting product:', error);
            return { deleted: false, message: 'An error occurred while deleting the product' };
        }
    }
    async bulkDeleteProducts(ids) {
        if (!ids.length) {
            throw new common_1.BadRequestException('No product IDs provided');
        }
        const products = await this.prisma.products.findMany({
            where: {
                id: { in: ids },
                isDeleted: false,
            },
        });
        if (products.length !== ids.length) {
            const foundIds = products.map(p => p.id);
            const missingIds = ids.filter(id => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Products not found: ${missingIds.join(', ')}`);
        }
        await this.prisma.products.updateMany({
            where: { id: { in: ids } },
            data: { isDeleted: true },
        });
    }
    async bulkUpdateProducts(bulkUpdateDto) {
        const { productIds, categoryId, isActive, featured, addTags, removeTags } = bulkUpdateDto;
        if (!productIds.length) {
            throw new common_1.BadRequestException('No product IDs provided');
        }
        if (categoryId) {
            const category = await this.prisma.categories.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID '${categoryId}' not found`);
            }
        }
        const updateData = {};
        if (categoryId) {
            updateData.categoryId = categoryId;
        }
        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }
        if (featured !== undefined) {
            updateData.featured = featured;
        }
        if (addTags || removeTags) {
            const products = await this.prisma.products.findMany({
                where: { id: { in: productIds }, isDeleted: false },
                select: { id: true, tags: true },
            });
            for (const product of products) {
                let currentTags = product.tags ? product.tags.split(',').map(t => t.trim()) : [];
                if (addTags) {
                    const tagsToAdd = addTags.split(',').map((t) => t.trim());
                    currentTags = [...new Set([...currentTags, ...tagsToAdd])];
                }
                if (removeTags) {
                    const tagsToRemove = removeTags.split(',').map((t) => t.trim());
                    currentTags = currentTags.filter(tag => !tagsToRemove.includes(tag));
                }
                await this.prisma.products.update({
                    where: { id: product.id },
                    data: { tags: currentTags.join(', ') },
                });
            }
            return { updated: products.length };
        }
        const result = await this.prisma.products.updateMany({
            where: { id: { in: productIds }, isDeleted: false },
            data: updateData,
        });
        return { updated: result.count };
    }
    async duplicateProduct(id) {
        const product = await this.prisma.products.findUnique({
            where: { id, isDeleted: false },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        const baseSlug = this.generateSlug(product.name);
        let newSlug = `${baseSlug}-copy`;
        let counter = 1;
        while (await this.prisma.products.findUnique({ where: { slug: newSlug } })) {
            newSlug = `${baseSlug}-copy-${counter}`;
            counter++;
        }
        const duplicatedProduct = await this.prisma.products.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                name: `${product.name} (Copy)`,
                slug: newSlug,
                description: product.description,
                shortDescription: product.shortDescription,
                priceCents: product.priceCents,
                originalPriceCents: product.originalPriceCents,
                sku: product.sku ? `${product.sku}-COPY` : null,
                warranty: product.warranty,
                features: product.features,
                minOrderQuantity: product.minOrderQuantity,
                maxOrderQuantity: product.maxOrderQuantity,
                tags: product.tags,
                categoryId: product.categoryId,
                brand: product.brand,
                model: product.model,
                weight: product.weight,
                dimensions: product.dimensions,
                specifications: product.specifications ? JSON.parse(JSON.stringify(product.specifications)) : null,
                images: product.images ? JSON.parse(JSON.stringify(product.images)) : null,
                isActive: false,
                featured: false,
                metaTitle: product.metaTitle,
                metaDescription: product.metaDescription,
                metaKeywords: product.metaKeywords,
                canonicalUrl: product.canonicalUrl,
                updatedAt: new Date(),
            },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return this.mapToProductResponse(duplicatedProduct);
    }
    async incrementProductView(id) {
        const product = await this.prisma.products.findUnique({
            where: { id, isDeleted: false },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        await this.prisma.products.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
    async getProductAnalytics() {
        const [totalProducts, activeProducts, featuredProducts, outOfStockProducts, totalViewsResult, averagePriceResult, productsByCategory, topViewedProducts, recentProducts,] = await Promise.all([
            this.prisma.products.count({ where: { isDeleted: false } }),
            this.prisma.products.count({ where: { isDeleted: false, isActive: true } }),
            this.prisma.products.count({ where: { isDeleted: false, featured: true } }),
            this.prisma.products.count({ where: { isDeleted: false, stockQuantity: { lte: 0 } } }),
            this.prisma.products.aggregate({
                where: { isDeleted: false },
                _sum: { viewCount: true },
            }),
            this.prisma.products.aggregate({
                where: { isDeleted: false },
                _avg: { priceCents: true },
            }),
            this.prisma.products.groupBy({
                by: ['categoryId'],
                where: { isDeleted: false },
                _count: { id: true },
            }),
            this.prisma.products.findMany({
                where: { isDeleted: false },
                include: {
                    categories: {
                        select: { id: true, name: true, slug: true },
                    },
                },
                orderBy: { viewCount: 'desc' },
                take: 10,
            }),
            this.prisma.products.findMany({
                where: { isDeleted: false },
                include: {
                    categories: {
                        select: { id: true, name: true, slug: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        const categoryMap = new Map();
        const categories = await this.prisma.categories.findMany({
            where: {
                id: { in: productsByCategory.map(p => p.categoryId).filter(Boolean) },
            },
            select: { id: true, name: true },
        });
        categories.forEach(cat => categoryMap.set(cat.id, cat.name));
        const productsByCategoryFormatted = {};
        productsByCategory.forEach(item => {
            const categoryName = categoryMap.get(item.categoryId) || 'Unknown';
            productsByCategoryFormatted[categoryName] = item._count.id;
        });
        return {
            totalProducts,
            activeProducts,
            featuredProducts,
            outOfStockProducts,
            totalViews: totalViewsResult._sum.viewCount || 0,
            averagePrice: Math.round(averagePriceResult._avg.priceCents || 0),
            productsByCategory: productsByCategoryFormatted,
            topViewedProducts: topViewedProducts.map(p => this.mapToProductResponse(p)),
            recentProducts: recentProducts.map(p => this.mapToProductResponse(p)),
        };
    }
    async getTopViewedProducts(limit = 10) {
        const products = await this.prisma.products.findMany({
            where: { isDeleted: false },
            include: {
                categories: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: { viewCount: 'desc' },
            take: Math.min(Math.max(limit, 1), 50),
        });
        return products.map(product => this.mapToProductResponse(product));
    }
    async getRecentProducts(limit = 10) {
        const products = await this.prisma.products.findMany({
            where: { isDeleted: false },
            include: {
                categories: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: Math.min(Math.max(limit, 1), 50),
        });
        return products.map(product => this.mapToProductResponse(product));
    }
    async exportProductsToCsv() {
        const products = await this.prisma.products.findMany({
            where: { isDeleted: false },
            include: {
                categories: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const headers = [
            'ID',
            'Name',
            'Slug',
            'Description',
            'Price (VND)',
            'Original Price (VND)',
            'Stock Quantity',
            'SKU',
            'Category',
            'Brand',
            'Model',
            'Is Active',
            'Featured',
            'Created At',
        ];
        const rows = products.map(product => [
            product.id,
            product.name,
            product.slug,
            product.description || '',
            product.priceCents,
            product.originalPriceCents || '',
            product.stockQuantity,
            product.sku || '',
            product.categories?.name || '',
            product.brand || '',
            product.model || '',
            product.isActive,
            product.featured,
            product.createdAt.toISOString(),
        ]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        return csvContent;
    }
    async importProductsFromCsv(csvData) {
        const lines = csvData.split('\n').filter(line => line.trim());
        const errors = [];
        let imported = 0;
        if (lines.length < 2) {
            throw new common_1.BadRequestException('CSV must contain at least header and one data row');
        }
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = this.parseCsvLine(lines[i]);
                const productData = {};
                headers.forEach((header, index) => {
                    const value = values[index]?.replace(/"/g, '').trim();
                    switch (header.toLowerCase()) {
                        case 'name':
                            productData.name = value;
                            break;
                        case 'slug':
                            productData.slug = value;
                            break;
                        case 'description':
                            productData.description = value;
                            break;
                        case 'price (vnd)':
                        case 'price':
                            productData.priceCents = parseInt(value);
                            break;
                        case 'original price (vnd)':
                        case 'original price':
                            productData.originalPriceCents = value ? parseInt(value) : undefined;
                            break;
                        case 'stock quantity':
                            productData.stockQuantity = parseInt(value) || 0;
                            break;
                        case 'sku':
                            productData.sku = value || undefined;
                            break;
                        case 'categories':
                            break;
                        case 'brand':
                            productData.brand = value || undefined;
                            break;
                        case 'model':
                            productData.model = value || undefined;
                            break;
                        case 'is active':
                            productData.isActive = value?.toLowerCase() === 'true';
                            break;
                        case 'featured':
                            productData.featured = value?.toLowerCase() === 'true';
                            break;
                    }
                });
                if (productData.name && productData.priceCents) {
                    if (!productData.categoryId) {
                        const defaultCategory = await this.prisma.categories.findFirst({
                            where: { isActive: true },
                        });
                        if (defaultCategory) {
                            productData.categoryId = defaultCategory.id;
                        }
                    }
                    await this.createProduct(productData);
                    imported++;
                }
                else {
                    errors.push(`Row ${i + 1}: Missing required fields (name, price)`);
                }
            }
            catch (error) {
                errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        return { imported, errors };
    }
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                }
            }
            else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            }
            else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .substring(0, 100);
    }
    mapToProductResponse(product) {
        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            shortDescription: product.shortDescription,
            priceCents: product.priceCents,
            originalPriceCents: product.originalPriceCents,
            images: product.images,
            category: product.categories,
            brand: product.brand,
            model: product.model,
            sku: product.sku,
            specifications: product.specifications,
            features: product.features,
            warranty: product.warranty,
            minOrderQuantity: product.minOrderQuantity,
            maxOrderQuantity: product.maxOrderQuantity,
            tags: product.tags,
            metaTitle: product.metaTitle,
            metaDescription: product.metaDescription,
            metaKeywords: product.metaKeywords,
            canonicalUrl: product.canonicalUrl,
            featured: product.featured,
            isActive: product.isActive,
            viewCount: product.viewCount,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
    }
    async checkProductDeletable(id) {
        try {
            const product = await this.prisma.products.findUnique({
                where: { id, isDeleted: false },
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: { order_items: true }
                    }
                }
            });
            if (!product) {
                return { canDelete: false, message: 'Product not found', associatedOrdersCount: 0 };
            }
            const associatedOrdersCount = product._count.order_items;
            if (associatedOrdersCount > 0) {
                return {
                    canDelete: false,
                    message: `Cannot delete product "${product.name}" because it has ${associatedOrdersCount} associated order(s). Please remove or update the orders first.`,
                    associatedOrdersCount
                };
            }
            return {
                canDelete: true,
                message: 'Product can be safely deleted',
                associatedOrdersCount: 0
            };
        }
        catch (error) {
            console.error('Error checking product deletable status:', error);
            return { canDelete: false, message: 'An error occurred while checking deletion status', associatedOrdersCount: 0 };
        }
    }
};
exports.CompleteProductService = CompleteProductService;
exports.CompleteProductService = CompleteProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompleteProductService);
//# sourceMappingURL=complete-product.service.js.map