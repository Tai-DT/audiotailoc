import { InventoryMovementService } from './inventory-movement.service';
export declare class InventoryMovementController {
    private readonly inventoryMovementService;
    constructor(inventoryMovementService: InventoryMovementService);
    create(data: {
        productId: string;
        type: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        reason?: string;
        referenceId?: string;
        referenceType?: string;
        userId?: string;
        notes?: string;
    }): unknown;
    findAll(page?: string, pageSize?: string, productId?: string, type?: string, userId?: string, startDate?: string, endDate?: string): unknown;
    findByProduct(productId: string, page?: string, pageSize?: string): unknown;
    getSummary(productId?: string, startDate?: string, endDate?: string): unknown;
}
