import { HttpClient, HttpClientOptions } from './httpClient';
import { AuthApi } from './auth';
import { ProductsApi } from './products';
import { OrdersApi } from './orders';
import { FilesApi } from './files';

export interface SdkOptions extends HttpClientOptions {}

export class AudioTaiLocSdk {
  readonly client: HttpClient;
  readonly auth: AuthApi;
  readonly products: ProductsApi;
  readonly orders: OrdersApi;
  readonly files: FilesApi;

  constructor(options: SdkOptions) {
    this.client = new HttpClient(options);
    this.auth = new AuthApi(this.client);
    this.products = new ProductsApi(this.client);
    this.orders = new OrdersApi(this.client);
    this.files = new FilesApi(this.client);
  }
}