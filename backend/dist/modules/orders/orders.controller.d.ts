import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    list(page?: string, pageSize?: string, status?: string): Promise<{
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
    create(createOrderDto: {
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        shippingAddress: string;
        shippingCoordinates?: {
            lat: number;
            lng: number;
        };
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        notes?: string;
    }): Promise<any>;
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
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
    update(id: string, updateOrderDto: {
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        shippingAddress?: string;
        shippingCoordinates?: {
            lat: number;
            lng: number;
        };
        notes?: string;
        items?: Array<{
            productId: string;
            quantity: number;
            unitPrice?: number;
            name?: string;
        }>;
    }): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
