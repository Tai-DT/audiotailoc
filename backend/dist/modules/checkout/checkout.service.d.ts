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
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
    }>;
    getOrderForUserByNo(userId: string, orderNo: string): Promise<{
        order_items: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            price: bigint;
            orderId: string;
            productId: string;
            quantity: number;
            unitPrice: bigint | null;
        }[];
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            metadata: string | null;
            orderId: string;
            intentId: string | null;
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
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
    }>;
}
