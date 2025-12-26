import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CatalogController {
    private readonly catalog;
    constructor(catalog: CatalogService);
    listCategories(): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
    }[]>;
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
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        slug: string;
        name: string;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    checkSkuExists(sku: string, excludeId?: string): Promise<boolean>;
    generateUniqueSku(baseName?: string): Promise<string>;
}
