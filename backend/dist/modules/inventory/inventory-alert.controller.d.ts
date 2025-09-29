import { InventoryAlertService } from './inventory-alert.service';
export declare class InventoryAlertController {
    private readonly inventoryAlertService;
    constructor(inventoryAlertService: InventoryAlertService);
    create(data: {
        productId: string;
        type: string;
        message: string;
        threshold?: number;
        currentStock?: number;
    }): Promise<{
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
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
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
            message: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
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
            message: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            productId: string;
            threshold: number;
            currentStock: number;
            isResolved: boolean;
            resolvedAt: Date;
        })[];
    }>;
    getActiveAlerts(): Promise<({
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
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
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
        product: {
            id: string;
            name: string;
            sku: string;
        };
    } & {
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        productId: string;
        threshold: number;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date;
    }>;
    bulkResolve(data: {
        ids: string[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    checkAndCreateAlerts(): Promise<any[]>;
    delete(id: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
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
