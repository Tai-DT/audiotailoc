import { HttpClient, type ApiSdkConfig } from './httpClient'
import { createAuthApi } from './auth'
import { createProductsApi } from './products'
import { createOrdersApi } from './orders'
import { createFilesApi } from './files'

export function createApiSdk(config: ApiSdkConfig) {
  const client = new HttpClient(config)
  return {
    client,
    auth: createAuthApi(client),
    products: createProductsApi(client),
    orders: createOrdersApi(client),
    files: createFilesApi(client),
  }
}