import { HttpClient } from './httpClient'

export type ListQuery = {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Array<{ key: string; op: 'eq' | 'ne' | 'contains' | 'in' | 'gte' | 'lte' | 'between'; value: any }>
}

export type ListResponse<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  createdAt: string
  updatedAt: string
}

export function createProductsApi(client: HttpClient) {
  return {
    async list(query: ListQuery = {}): Promise<ListResponse<Product>> {
      const qs = new URLSearchParams()
      if (query.page) qs.set('page', String(query.page))
      if (query.pageSize) qs.set('pageSize', String(query.pageSize))
      if (query.sortBy) qs.set('sortBy', query.sortBy)
      if (query.sortOrder) qs.set('sortOrder', query.sortOrder)
      if (query.filters) qs.set('filters', JSON.stringify(query.filters))
      return client.get(`/products?${qs.toString()}`)
    },
    async get(id: string): Promise<Product> {
      return client.get(`/products/${id}`)
    },
    async create(payload: Partial<Product>): Promise<Product> {
      return client.post(`/products`, payload)
    },
    async update(id: string, payload: Partial<Product>): Promise<Product> {
      return client.put(`/products/${id}`, payload)
    },
    async delete(id: string): Promise<void> {
      return client.delete(`/products/${id}`)
    },
  }
}