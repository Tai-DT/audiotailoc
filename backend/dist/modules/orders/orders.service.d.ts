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
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            orderId: string;
            productId: string;
            quantity: number;
        }[];
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: string | null;
            orderId: string;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            intentId: string | null;
        }[];
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNo: string;
        userId: string | null;
        discountCents: number;
        shippingCents: number;
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNo: string;
        userId: string | null;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalCents: number;
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
    }>;
    create(orderData: any): Promise<any>;
    update(id: string, updateData: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
