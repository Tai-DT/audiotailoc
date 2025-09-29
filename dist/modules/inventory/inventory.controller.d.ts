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
        items: {
            id: string;
            productId: string;
            stock: number;
            reserved: number;
            lowStockThreshold: number;
            createdAt: Date;
            updatedAt: Date;
            product: any;
        }[];
    } | {
        total: number;
        page: number;
        pageSize: number;
        items: ({
            products: {
                categories: {
                    id: string;
                    name: string;
                    slug: string;
                };
                id: string;
                name: string;
                slug: string;
                imageUrl: string;
                categoryId: string;
                isActive: boolean;
                isDeleted: boolean;
                priceCents: bigint;
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
        products: {
            name: string;
            sku: string;
        };
        id: string;
        updatedAt: Date;
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
            products: {
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
