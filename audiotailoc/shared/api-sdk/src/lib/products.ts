import { HttpClient } from './httpClient';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export class ProductsApi {
  constructor(private readonly client: HttpClient) {}

  list() {
    return this.client.request<Product[]>(`/products`);
  }

  get(productId: string) {
    return this.client.request<Product>(`/products/${productId}`);
  }
}