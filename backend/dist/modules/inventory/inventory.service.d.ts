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
    }): unknown;
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
    }): unknown;
    delete(productId: string): unknown;
    syncWithProducts(): unknown;
}
