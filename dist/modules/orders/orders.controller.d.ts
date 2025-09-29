import { OrdersService } from './orders.service';
import { ConfigService } from '@nestjs/config';
export declare class OrdersController {
    private readonly orders;
    private readonly config;
    constructor(orders: OrdersService, config: ConfigService);
    list(page?: string, pageSize?: string, status?: string): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: {
            id: string;
            orderNumber: string;
            customerName: any;
            customerEmail: any;
            totalAmount: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            items: any;
        }[];
    }>;
    create(req: any): Promise<any>;
    createLegacy(req: any): Promise<any>;
    get(id: string): Promise<{
        id: string;
        orderNumber: string;
        userId: string;
        status: string;
        customerName: any;
        customerEmail: any;
        customerPhone: any;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalAmount: number;
        shippingAddress: string;
        shippingCoordinates: string;
        promotionCode: string;
        createdAt: Date;
        updatedAt: Date;
        items: any;
        payments: any;
    }>;
    updateStatusLegacy(id: string, status: string): Promise<{
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
    updateStatus(id: string, payload: {
        status: string;
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
