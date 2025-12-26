import { CheckoutService } from './checkout.service';
declare class CheckoutDto {
    promotionCode?: string;
}
export declare class CheckoutController {
    private readonly checkout;
    constructor(checkout: CheckoutService);
    create(req: any, dto: CheckoutDto): Promise<{
        order: {
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
        };
    }>;
    getByOrderNo(req: any, orderNo: string): Promise<{
        order_items: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            orderId: string;
            productId: string;
            quantity: number;
            price: bigint;
            unitPrice: bigint | null;
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
    } & {
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
}
export {};
