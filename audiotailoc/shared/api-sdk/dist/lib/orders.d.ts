import { HttpClient } from './httpClient';
export interface Order {
    id: string;
    productId: string;
    quantity: number;
}
export declare class OrdersApi {
    private readonly client;
    constructor(client: HttpClient);
    list(): Promise<Order[]>;
    get(orderId: string): Promise<Order>;
}
