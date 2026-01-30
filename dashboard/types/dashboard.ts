export interface DashboardStats {
    revenue: {
        total: number
        growth: number
        chart: Array<{ date: string; value: number }>
    }
    orders: {
        total: number
        pending: number
        completed: number
        growth: number
        recent: Array<{
            id: string
            customer: string
            amount: number
            status: string
            createdAt: string
        }>
    }
    customers: {
        total: number
        new: number
        growth: number
    }
    products: {
        total: number
        outOfStock: number
        lowStock: number
        topSelling: Array<{
            id: string
            name: string
            sales: number
            revenue: number
            stock: number
        }>
    }
    services: {
        total: number
        active: number
        bookings: number
    }
}

export interface RevenueResponse {
    totalRevenue: number
    revenueGrowth: number
    totalOrders?: number
    averageOrderValue?: number
}

export interface RevenueChartResponse {
    dates: string[]
    values: number[]
}

export interface GrowthMetricsResponse {
    ordersGrowth: number
    customersGrowth: number
}

export interface TopProductResponse {
    id: string
    name: string
    salesCount: number
    revenue: number
    stock: number
}

export interface BookingsResponse {
    bookingsToday: number
}

export interface OrderItem {
    id: string
    productName: string
    productSlug?: string
    productId?: string
    quantity: number
    price: number
    total: number
}

export interface Order {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    totalAmount: number
    totalCents?: number // Optional as it might be mapped from totalAmount
    status: string
    shippingAddress?: string
    shippingCoordinates?: string
    notes?: string
    createdAt: string
    updatedAt: string
    items: OrderItem[]
    user?: {
        name?: string
        email: string
    }
    customer?: {
        name?: string
        email: string
    }
}

export interface Product {
    id: string
    slug: string
    name: string
    description: string
    priceCents: number
    originalPriceCents?: number
    images?: string[]
    imageUrl?: string // For backward compatibility
    categoryId?: string
    brand?: string
    model?: string
    sku?: string
    inventory?: {
        stock: number
        reserved: number
        available: number
        lowStockThreshold: number
    }
    featured: boolean
    isActive: boolean
    isDeleted: boolean
    viewCount: number
    createdAt: string
    updatedAt: string
    price?: number // Optional for compatibility with some views
    stockQuantity?: number // Deprecated: use inventory.stock instead
}

export interface Category {
    id: string
    name: string
    slug: string
}

export interface ProductsResponse {
    items: Product[]
    total: number
    page: number
    pageSize: number
}

export interface OrdersResponse {
    items: Order[]
    total: number
    page: number
    pageSize: number
}

import { Service } from './service'
export { type Service }

export interface User {
    id: string
    name?: string
    email: string
    createdAt: string
    role: string
}