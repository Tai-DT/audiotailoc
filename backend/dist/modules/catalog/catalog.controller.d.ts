import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
declare class DeleteManyDto {
    ids?: string[];
}
export declare class CatalogController {
    private readonly catalog;
    constructor(catalog: CatalogService);
    list(query: any): Promise<{
        items: any;
        pagination: {
            total: any;
            page: any;
            pageSize: any;
        };
        data?: undefined;
    } | {
        data: any[];
        pagination: {
            total: number;
            page: number;
            pageSize: number;
        };
        items?: undefined;
    }>;
    searchProducts(q: string, limit?: number): Promise<{
        data: any;
        pagination: {
            total: any;
            page: any;
            pageSize: any;
        };
    }>;
    get(id: string): Promise<import("./catalog.service").ProductDto>;
    getBySlug(slug: string): Promise<import("./catalog.service").ProductDto>;
    checkSkuExists(sku: string, excludeId?: string): Promise<boolean>;
    generateUniqueSku(baseName?: string): Promise<string>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        imageUrl?: string | null;
        parentId: string | null;
    }>;
    listCategories(): Promise<any[]>;
    getCategoryAlias(slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
        isActive: boolean;
    }>;
    getCategoryBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
        isActive: boolean;
    }>;
    getProductsByCategory(slug: string, page?: number, limit?: number): Promise<{
        items: any[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
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
    updateCategoryById(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        imageUrl?: string | null;
        parentId: string | null;
    }>;
    deleteCategoryById(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    create(dto: CreateProductDto): Promise<import("./catalog.service").ProductDto>;
    update(id: string, dto: UpdateProductDto): Promise<import("./catalog.service").ProductDto>;
    remove(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    removeMany(body: DeleteManyDto): Promise<{
        deleted: number;
    }>;
    getTopViewedProducts(limit?: number): Promise<{
        data: any;
        pagination: {
            total: any;
            page: any;
            pageSize: any;
        };
    }>;
    getRecentProducts(limit?: number): Promise<{
        data: any;
        pagination: {
            total: any;
            page: any;
            pageSize: any;
        };
    }>;
}
export {};
