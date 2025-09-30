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
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        product: {
            id: string;
            name: string;
            sku: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        type: string;
        reason: string | null;
        productId: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        referenceId: string | null;
        referenceType: string | null;
        notes: string | null;
    }>;
    findAll(page?: string, pageSize?: string, productId?: string, type?: string, userId?: string, startDate?: string, endDate?: string): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
            product: {
                category: {
                    id: string;
                    name: string;
                };
                id: string;
                name: string;
                sku: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            type: string;
            reason: string | null;
            productId: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            referenceId: string | null;
            referenceType: string | null;
            notes: string | null;
        })[];
    }>;
    findByProduct(productId: string, page?: string, pageSize?: string): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
            product: {
                id: string;
                name: string;
                sku: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            type: string;
            reason: string | null;
            productId: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            referenceId: string | null;
            referenceType: string | null;
            notes: string | null;
        })[];
    }>;
    getSummary(productId?: string, startDate?: string, endDate?: string): Promise<{
        totalMovements: number;
        stockIn: number;
        stockOut: number;
        adjustments: number;
        reserved: number;
        released: number;
        byProduct: Record<string, any>;
    }>;
}
