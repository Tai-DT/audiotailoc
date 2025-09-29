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
        items: import("./catalog.service").ProductDto[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    listCategories(): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string;
    }[]>;
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string;
    }>;
    deleteCategory(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    get(id: string): Promise<import("./catalog.service").ProductDto>;
    getBySlug(slug: string): Promise<import("./catalog.service").ProductDto>;
    checkSkuExists(sku: string, excludeId?: string): unknown;
    generateUniqueSku(baseName?: string): unknown;
    create(dto: CreateProductDto): Promise<import("./catalog.service").ProductDto>;
    update(id: string, dto: UpdateProductDto): Promise<import("./catalog.service").ProductDto>;
    remove(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    removeMany(body: DeleteManyDto): Promise<{
        deleted: number;
    }>;
    getTopViewedProducts(limit?: number): unknown;
    getRecentProducts(limit?: number): unknown;
}
export {};
