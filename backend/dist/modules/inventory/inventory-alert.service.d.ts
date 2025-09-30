import { PrismaService } from '../../prisma/prisma.service';
export declare class InventoryAlertService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        threshold: number | null;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date | null;
    }>;
    findAll(params?: {
        page?: number;
        pageSize?: number;
        productId?: string;
        type?: string;
        isResolved?: boolean;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
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
            threshold: number | null;
            currentStock: number;
            isResolved: boolean;
            resolvedAt: Date | null;
        })[];
    }>;
    findByProduct(productId: string, params?: {
        page?: number;
        pageSize?: number;
    }): Promise<{
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
            threshold: number | null;
            currentStock: number;
            isResolved: boolean;
            resolvedAt: Date | null;
        })[];
    }>;
    resolve(id: string, _userId?: string): Promise<{
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
        threshold: number | null;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date | null;
    }>;
    bulkResolve(ids: string[], _userId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
        threshold: number | null;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date | null;
    })[]>;
    getAlertSummary(): Promise<{
        total: number;
        active: number;
        resolved: number;
        byType: any;
    }>;
    checkAndCreateAlerts(): Promise<any[]>;
    delete(id: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        productId: string;
        threshold: number | null;
        currentStock: number;
        isResolved: boolean;
        resolvedAt: Date | null;
    }>;
    bulkDelete(ids: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
