export class ProductsApi {
    constructor(client) {
        this.client = client;
    }
    list() {
        return this.client.request(`/products`);
    }
    get(productId) {
        return this.client.request(`/products/${productId}`);
    }
}
//# sourceMappingURL=products.js.map