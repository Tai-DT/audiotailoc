import { PrismaService } from '../../prisma/prisma.service';
import { InventoryMovementService } from './inventory-movement.service';
import { InventoryAlertsService } from './inventory-alert.service';
export declare class InventoryService {
    private readonly prisma;
    private readonly inventoryMovementService;
    private readonly inventoryAlertsService;
    constructor(prisma: PrismaService, inventoryMovementService: InventoryMovementService, inventoryAlertsService: InventoryAlertsService);
    private ensureInventoryRecords;
    list(params: {
        page?: number;
        pageSize?: number;
        lowStockOnly?: boolean;
    }): Promise<{
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
    adjust(productId: string, delta: {
        stockDelta?: number;
        reservedDelta?: number;
        lowStockThreshold?: number;
        stock?: number;
        reserved?: number;
        reason?: string;
        referenceId?: string;
        referenceType?: string;
        userId?: string;
        notes?: string;
    }): Promise<{
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
