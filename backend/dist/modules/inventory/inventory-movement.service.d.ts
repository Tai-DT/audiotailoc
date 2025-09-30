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
    findByProduct(productId: string, params?: {
        page?: number;
        pageSize?: number;
    }): Promise<{
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
