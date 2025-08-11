import { HttpClient } from './httpClient';

export interface Order {
  id: string;
  productId: string;
  quantity: number;
}

export class OrdersApi {
  constructor(private readonly client: HttpClient) {}

  list() {
    return this.client.request<Order[]>(`/orders`);
  }

  get(orderId: string) {
    return this.client.request<Order>(`/orders/${orderId}`);
  }
}