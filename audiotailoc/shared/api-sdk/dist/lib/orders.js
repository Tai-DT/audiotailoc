export class OrdersApi {
    constructor(client) {
        this.client = client;
    }
    list() {
        return this.client.request(`/orders`);
    }
    get(orderId) {
        return this.client.request(`/orders/${orderId}`);
    }
}
//# sourceMappingURL=orders.js.map