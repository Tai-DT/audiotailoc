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
        total: number;
        page: number;
        pageSize: number;
        items: ({
            product: {
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
                id: string;
                name: string;
                slug: string;
                isActive: boolean;
                isDeleted: boolean;
                priceCents: number;
                imageUrl: string;
                categoryId: string;
                sku: string;
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
    }>;
    adjust(productId: string, dto: AdjustDto): Promise<{
        product: {
            name: string;
            sku: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        stock: number;
        reserved: number;
        lowStockThreshold: number;
    }>;
    delete(productId: string): Promise<{
        message: string;
        productId: string;
        productName: string;
        sku: string;
    }>;
    syncWithProducts(): Promise<{
        syncedProducts: number;
        orphanedInventoriesCount: number;
        createdInventories: any[];
        orphanedInventoriesList: ({
            product: {
                name: string;
                isActive: boolean;
                isDeleted: boolean;
                sku: string;
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
    }>;
}
export {};
