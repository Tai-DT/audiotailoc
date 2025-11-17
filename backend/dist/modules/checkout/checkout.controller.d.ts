import { CheckoutService } from './checkout.service';
declare class ShippingAddressDto {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    goongPlaceId?: string;
}
declare class CheckoutDto {
    promotionCode?: string;
    shippingAddress: ShippingAddressDto;
}
export declare class CheckoutController {
    private readonly checkout;
    constructor(checkout: CheckoutService);
    create(req: any, dto: CheckoutDto): Promise<{
        id: string;
        orderNo: string;
        totalCents: number;
        status: string;
        shippingAddress: string;
    }>;
    createLegacy(req: any, dto: CheckoutDto): Promise<{
        order: {
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
        };
    }>;
    getByOrderNo(req: any, orderNo: string): Promise<{
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
export {};
