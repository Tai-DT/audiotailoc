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
        id: string;
        orderNo: string;
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
        userId: string;
    }>;
    getOrderForUserByNo(userId: string, orderNo: string): Promise<{
        order_items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            imageUrl: string | null;
            productId: string;
            quantity: number;
            price: bigint;
            orderId: string;
            unitPrice: bigint | null;
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
    } & {
        id: string;
        orderNo: string;
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
        userId: string;
    }>;
}
