import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionService } from '../promotions/promotion.service';
import { MailService } from '../notifications/mail.service';
export declare class CheckoutService {
    private readonly prisma;
    private readonly cart;
    private readonly promos;
    private readonly mail;
    constructor(prisma: PrismaService, cart: CartService, promos: PromotionService, mail: MailService);
    createOrder(userId: string, params: {
        promotionCode?: string;
        shippingAddress?: any;
    }): Promise<{
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
    getOrderForUserByNo(userId: string, orderNo: string): Promise<{
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
}
