import { HttpClient } from './httpClient'
import type { ListQuery, ListResponse } from './products'

export type Order = {
  id: string
  code: string
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'FULFILLED'
  total: number
  createdAt: string
  updatedAt: string
}

export function createOrdersApi(client: HttpClient) {
  return {
    async list(query: ListQuery = {}): Promise<ListResponse<Order>> {
      const qs = new URLSearchParams()
      if (query.page) qs.set('page', String(query.page))
      if (query.pageSize) qs.set('pageSize', String(query.pageSize))
      if (query.sortBy) qs.set('sortBy', query.sortBy)
      if (query.sortOrder) qs.set('sortOrder', query.sortOrder)
      if (query.filters) qs.set('filters', JSON.stringify(query.filters))
      return client.get(`/orders?${qs.toString()}`)
    },
    async get(id: string): Promise<Order> {
      return client.get(`/orders/${id}`)
    },
    async updateStatus(id: string, status: Order['status']): Promise<Order> {
      return client.post(`/orders/${id}/status`, { status })
    },
    async fulfill(id: string): Promise<Order> {
      return client.post(`/orders/${id}/fulfill`)
    },
    async refund(id: string): Promise<Order> {
      return client.post(`/orders/${id}/refund`)
    },
  }
}