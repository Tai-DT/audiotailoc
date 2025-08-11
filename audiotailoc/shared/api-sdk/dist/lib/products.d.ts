import { HttpClient } from './httpClient';
export interface Product {
    id: string;
    name: string;
    price: number;
}
export declare class ProductsApi {
    private readonly client;
    constructor(client: HttpClient);
    list(): Promise<Product[]>;
    get(productId: string): Promise<Product>;
}
