import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../caching/cache.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    list(params: {
        page?: number;
        pageSize?: number;
        status?: string;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: {
            id: string;
            orderNumber: string;
            customerName: any;
            customerEmail: any;
            totalAmount: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            items: any;
        }[];
    }>;
    get(id: string): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        status: string;
        customerName: any;
        customerEmail: any;
        customerPhone: any;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalAmount: number;
        shippingAddress: string;
        shippingCoordinates: string;
        promotionCode: string;
        createdAt: Date;
        updatedAt: Date;
        items: any;
        payments: any;
    }>;
    updateStatus(id: string, status: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNo: string;
        userId: string;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalCents: number;
        shippingAddress: string;
        shippingCoordinates: string;
        promotionCode: string;
    }>;
    create(orderData: any): Promise<any>;
    update(id: string, updateData: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
