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
            customerName: string;
            customerEmail: string;
            totalAmount: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            items: {
                id: string;
                productId: string;
                productSlug: any;
                productName: string;
                quantity: number;
                price: number;
                total: number;
            }[];
        }[];
    }>;
    get(id: string): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        status: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        shippingAddress: string;
        shippingCoordinates: string;
        promotionCode: string;
        createdAt: Date;
        updatedAt: Date;
        items: {
            id: string;
            productId: string;
            productSlug: string;
            productName: string;
            quantity: number;
            price: number;
            total: number;
            product: {
                id: string;
                name: string;
                slug: string;
            };
        }[];
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            provider: string;
            amountCents: number;
            metadata: string;
            intentId: string;
            transactionId: string;
        }[];
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
