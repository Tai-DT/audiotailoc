import { InventoryService } from './inventory.service';
declare class ListQueryDto {
    page?: number;
    pageSize?: number;
    lowStockOnly?: string;
}
declare class AdjustDto {
    stockDelta?: number;
    reservedDelta?: number;
    lowStockThreshold?: number;
    stock?: number;
    reserved?: number;
}
export declare class InventoryController {
    private readonly inventory;
    constructor(inventory: InventoryService);
    list(q: ListQueryDto): Promise<{
        items: ({
            products: {
                model: string | null;
                tags: string | null;
                description: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                isDeleted: boolean;
                slug: string;
                shortDescription: string | null;
                priceCents: bigint;
                originalPriceCents: bigint | null;
                imageUrl: string | null;
                images: string | null;
                categoryId: string | null;
                brand: string | null;
                sku: string | null;
                specifications: string | null;
                features: string | null;
                warranty: string | null;
                weight: number | null;
                dimensions: string | null;
                minOrderQuantity: number;
                maxOrderQuantity: number | null;
                maxStock: number | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                canonicalUrl: string | null;
                featured: boolean;
                isActive: boolean;
                viewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            stock: number;
            reserved: number;
            lowStockThreshold: number;
        })[];
        meta: {
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    adjust(productId: string, dto: AdjustDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        stock: number;
        reserved: number;
        lowStockThreshold: number;
    }>;
    delete(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        stock: number;
        reserved: number;
        lowStockThreshold: number;
    }>;
}
export {};
