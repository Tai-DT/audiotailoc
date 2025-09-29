/// <reference types="node" />
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    list(page?: string, pageSize?: string, status?: string): any;
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
    get(id: string): unknown;
    updateStatus(id: string, status: string): unknown;
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
    delete(id: string): unknown;
}
