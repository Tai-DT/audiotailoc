import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionService } from '../promotions/promotion.service';
export declare class CheckoutService {
    private readonly prisma;
    private readonly cart;
    private readonly promos;
    constructor(prisma: PrismaService, cart: CartService, promos: PromotionService);
    createOrder(userId: string, params: {
        promotionCode?: string;
        shippingAddress?: any;
    }): Promise<void>;
    getOrderForUserByNo(userId: string, orderNo: string): Promise<{
        order_items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            productId: string;
            quantity: number;
            price: bigint;
            orderId: string;
            unitPrice: bigint;
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
