import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export type ProductDto = {
    id: string;
    slug?: string;
    name: string;
    description?: string | null;
    shortDescription?: string | null;
    priceCents: number;
    originalPriceCents?: number | null;
    imageUrl?: string | null;
    images?: any;
    categoryId?: string | null;
    brand?: string | null;
    model?: string | null;
    sku?: string | null;
    specifications?: any;
    features?: string | null;
    warranty?: string | null;
    weight?: number | null;
    dimensions?: string | null;
    minOrderQuantity?: number;
    maxOrderQuantity?: number | null;
    tags?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
    canonicalUrl?: string | null;
    featured?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    viewCount?: number;
    createdAt: Date;
    updatedAt: Date;
};
export declare class CatalogService {
    private readonly prisma;
    private readonly cache;
    private readonly inMemoryCache;
    private readonly inFlightRequests;
    constructor(prisma: PrismaService, cache: CacheService);
    listProducts(params?: {
        page?: number;
        pageSize?: number;
        q?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: 'createdAt' | 'name' | 'priceCents' | 'price' | 'viewCount';
        sortOrder?: 'asc' | 'desc';
        featured?: boolean;
        isActive?: boolean;
    }): Promise<any>;
    getById(id: string): Promise<ProductDto>;
    getBySlug(slug: string): Promise<ProductDto>;
    checkSkuExists(sku: string, excludeId?: string): Promise<boolean>;
    generateUniqueSku(baseName?: string): Promise<string>;
    create(data: CreateProductDto): Promise<ProductDto>;
    update(id: string, data: UpdateProductDto): Promise<ProductDto>;
    remove(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    listCategories(): Promise<any[]>;
    getCategoryBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
        isActive: boolean;
    }>;
    getCategoryById(id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        imageUrl?: string | null;
        parentId: string | null;
        isActive: boolean;
    }>;
    getProductsByCategory(slug: string, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        items: any[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    createCategory(data: {
        name: string;
        slug: string;
        description?: string;
        imageUrl?: string;
        parentId?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        imageUrl?: string | null;
        parentId: string | null;
    }>;
    updateCategory(id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        imageUrl?: string;
        parentId?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        imageUrl?: string | null;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    removeMany(slugs: string[] | null): Promise<{
        deleted: number;
    }>;
}
