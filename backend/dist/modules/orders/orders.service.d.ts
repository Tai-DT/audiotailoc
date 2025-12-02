import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { CacheService } from '../caching/cache.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly mail;
    private readonly cache;
    constructor(prisma: PrismaService, mail: MailService, cache: CacheService);
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
        totalCents: number;
        subtotalCents: number;
        order_items: {
            price: number;
            unitPrice: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            imageUrl: string | null;
            orderId: string;
            productId: string;
            quantity: number;
        }[];
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            intentId: string | null;
            provider: string;
            amountCents: number;
            transactionId: string | null;
            metadata: string | null;
        }[];
        id: string;
        orderNo: string;
        userId: string;
        discountCents: number;
        shippingCents: number;
        status: string;
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        orderNo: string;
        userId: string;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalCents: number;
        status: string;
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(orderData: any): Promise<any>;
    update(id: string, updateData: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
