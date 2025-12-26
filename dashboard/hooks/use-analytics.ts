"use client"

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export interface AnalyticsOverview {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  newCustomers: number
  conversionRate: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
}

export interface AnalyticsTrend {
  date: string
  revenue: number
  orders: number
  customers: number
}

export interface TopService {
  id: string
  name: string
  bookings: number
  revenue: number
}

export interface TopProduct {
  id: string
  name: string
  sold: number
  revenue: number
}

export interface UserActivity {
  pageViews: number
  sessions: number
  avgSessionDuration: number
  bounceRate: number
}

export interface AnalyticsFilters {
  dateRange: '7days' | '30days' | '90days' | '1year' | 'custom';
  startDate?: string;
  endDate?: string;
  category?: string;
  productId?: string;
  serviceId?: string;
  userId?: string;
  status?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  dateRange: string;
  filters?: AnalyticsFilters;
}

export function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [trends, setTrends] = useState<AnalyticsTrend[]>([])
  const [topServices, setTopServices] = useState<TopService[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const normalizeOverview = (raw: unknown): AnalyticsOverview => {
    const data = raw as Partial<AnalyticsOverview> | null | undefined
    return {
      totalRevenue: Number(data?.totalRevenue ?? 0),
      totalOrders: Number(data?.totalOrders ?? 0),
      totalCustomers: Number(data?.totalCustomers ?? 0),
      newCustomers: Number(data?.newCustomers ?? 0),
      conversionRate: Number(data?.conversionRate ?? 0),
      revenueGrowth: Number(data?.revenueGrowth ?? 0),
      ordersGrowth: Number(data?.ordersGrowth ?? 0),
      customersGrowth: Number(data?.customersGrowth ?? 0),
    }
  }

  // Fetch overview statistics
  const fetchOverview = useCallback(async (dateRange: string = '7days') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.get(`/analytics/overview?range=${dateRange}`)
      
      setOverview(normalizeOverview(response.data))
    } catch (err) {
      const errorMessage = 'Không thể tải dữ liệu tổng quan'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch trends data
  const fetchTrends = useCallback(async (dateRange: string = '7days') => {
    try {
      const response = await apiClient.get(`/analytics/trends?range=${dateRange}`)
      
      const data = response.data as unknown
      setTrends(Array.isArray(data) ? (data as AnalyticsTrend[]) : [])
    } catch (err) {
      toast.error('Không thể tải dữ liệu xu hướng')
    }
  }, [])

  // Fetch top services
  const fetchTopServices = useCallback(async () => {
    try {
      const response = await apiClient.get('/analytics/top-services?limit=5')
      
      const data = response.data as unknown
      setTopServices(Array.isArray(data) ? (data as TopService[]) : [])
    } catch (err) {
      toast.error('Không thể tải dữ liệu dịch vụ')
    }
  }, [])

  // Fetch top products
  const fetchTopProducts = useCallback(async () => {
    try {
      const response = await apiClient.get('/analytics/top-products?limit=5')
      
      const data = response.data as unknown
      setTopProducts(Array.isArray(data) ? (data as TopProduct[]) : [])
    } catch (err) {
      toast.error('Không thể tải dữ liệu sản phẩm')
    }
  }, [])

  // Fetch user activity
  const fetchUserActivity = useCallback(async (dateRange: string = '7days') => {
    try {
      const response = await apiClient.get(`/analytics/user-activity?range=${dateRange}`)
      
      const raw = response.data as Partial<UserActivity> | null
      if (raw && typeof raw === 'object') {
        setUserActivity({
          pageViews: Number(raw.pageViews ?? 0),
          sessions: Number(raw.sessions ?? 0),
          avgSessionDuration: Number(raw.avgSessionDuration ?? 0),
          bounceRate: Number(raw.bounceRate ?? 0),
        })
      } else {
        setUserActivity(null)
      }
    } catch (err) {
      toast.error('Không thể tải dữ liệu hoạt động người dùng')
    }
  }, [])


  return {
    // State
    overview,
    trends,
    topServices,
    topProducts,
    userActivity,
    loading,
    error,

    // Actions
    fetchOverview,
    fetchTrends,
    fetchTopServices,
    fetchTopProducts,
    fetchUserActivity,

    // Utilities
    refresh: fetchOverview
  }
}
