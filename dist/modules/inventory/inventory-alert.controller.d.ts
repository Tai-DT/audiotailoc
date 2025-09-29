import { InventoryAlertsService } from './inventory-alert.service';
export declare class InventoryAlertController {
    private readonly inventoryAlertsService;
    constructor(inventoryAlertsService: InventoryAlertsService);
    create(data: {
        productId: string;
        type: string;
        message: string;
        threshold?: number;
        currentStock?: number;
    }): Promise<{
        products: {
            categories: {
                id: string;
                name: string;
            };
            id: string;
            name: string;
            sku: string;
        };
    } & {
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        threshold: number;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date;
    }>;
    findAll(page?: string, pageSize?: string, productId?: string, type?: string, isResolved?: string, startDate?: string, endDate?: string): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: ({
            products: {
                categories: {
                    id: string;
                    name: string;
                };
                id: string;
                name: string;
                sku: string;
            };
        } & {
            message: string;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            threshold: number;
            currentStock: number;
            isResolved: boolean;
            resolvedAt: Date;
        })[];
    }>;
    findByProduct(productId: string, page?: string, pageSize?: string): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: ({
            products: {
                categories: {
                    id: string;
                    name: string;
                };
                id: string;
                name: string;
                sku: string;
            };
        } & {
            message: string;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            threshold: number;
            currentStock: number;
            isResolved: boolean;
            resolvedAt: Date;
        })[];
    }>;
    getActiveAlerts(): Promise<({
        products: {
            categories: {
                id: string;
                name: string;
            };
            id: string;
            name: string;
            sku: string;
        };
    } & {
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        threshold: number;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date;
    })[]>;
    getAlertSummary(): Promise<{
        total: number;
        active: number;
        resolved: number;
        byType: any;
    }>;
    resolve(id: string): Promise<{
        products: {
            id: string;
            name: string;
            sku: string;
        };
    } & {
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        threshold: number;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date;
    }>;
    bulkResolve(data: {
        ids: string[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    checkAndCreateAlerts(data?: {
        productId?: string;
    }): Promise<any[]>;
    delete(id: string): Promise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        threshold: number;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date;
    }>;
    bulkDelete(data: {
        ids: string[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
