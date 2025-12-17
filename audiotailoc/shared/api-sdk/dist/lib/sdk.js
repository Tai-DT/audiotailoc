import { HttpClient } from './httpClient';
import { AuthApi } from './auth';
import { ProductsApi } from './products';
import { OrdersApi } from './orders';
import { FilesApi } from './files';
export class AudioTaiLocSdk {
    constructor(options) {
        this.client = new HttpClient(options);
        this.auth = new AuthApi(this.client);
        this.products = new ProductsApi(this.client);
        this.orders = new OrdersApi(this.client);
        this.files = new FilesApi(this.client);
    }
}
//# sourceMappingURL=sdk.js.map