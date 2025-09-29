import { PrismaService } from '../../prisma/prisma.service';
export declare class InventoryMovementService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        products: {
            id: string;
            name: string;
            sku: string;
        };
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        type: string;
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        quantity: number;
        previousStock: number;
        newStock: number;
        reason: string;
        referenceId: string;
        referenceType: string;
        notes: string;
    }>;
    findByProduct(productId: string, params?: {
        page?: number;
        pageSize?: number;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: ({
            products: {
                id: string;
                name: string;
                sku: string;
            };
            users: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            type: string;
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            reason: string;
            referenceId: string;
            referenceType: string;
            notes: string;
        })[];
    }>;
    findAll(params?: {
        page?: number;
        pageSize?: number;
        productId?: string;
        type?: string;
        userId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
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
            users: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            type: string;
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            reason: string;
            referenceId: string;
            referenceType: string;
            notes: string;
        })[];
    }>;
    getSummary(productId?: string, startDate?: Date, endDate?: Date): Promise<{
        totalMovements: number;
        stockIn: number;
        stockOut: number;
        adjustments: number;
        reserved: number;
        released: number;
        byProduct: Record<string, any>;
    }>;
}
