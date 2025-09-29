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
        items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            imageUrl: string;
            price: number;
            orderId: string;
            unitPrice: number;
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
    } & {
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
