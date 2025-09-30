import { PrismaService } from '../../prisma/prisma.service';
import { InventoryMovementService } from './inventory-movement.service';
import { InventoryAlertService } from './inventory-alert.service';
export declare class InventoryService {
    private readonly prisma;
    private readonly inventoryMovementService;
    private readonly inventoryAlertService;
    constructor(prisma: PrismaService, inventoryMovementService: InventoryMovementService, inventoryAlertService: InventoryAlertService);
    list(params: {
        page?: number;
        pageSize?: number;
        lowStockOnly?: boolean;
    }): Promise<{
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
                priceCents: number;
                imageUrl: string;
                categoryId: string;
                sku: string;
                isActive: boolean;
                isDeleted: boolean;
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
                sku: string;
                isActive: boolean;
                isDeleted: boolean;
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
