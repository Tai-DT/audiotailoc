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

export function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [trends, setTrends] = useState<AnalyticsTrend[]>([])
  const [topServices, setTopServices] = useState<TopService[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch overview statistics
  const fetchOverview = useCallback(async (dateRange: string = '7days') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.get(`/analytics/overview?range=${dateRange}`)
      
      if (response.data) {
        setOverview(response.data)
      }
    } catch (err) {
      const errorMessage = 'Không thể tải dữ liệu tổng quan'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error fetching overview:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch trends data
  const fetchTrends = useCallback(async (dateRange: string = '7days') => {
    try {
      const response = await apiClient.get(`/analytics/trends?range=${dateRange}`)
      
      if (response.data) {
        setTrends(response.data)
      }
    } catch (err) {
      console.error('Error fetching trends:', err)
      toast.error('Không thể tải dữ liệu xu hướng')
    }
  }, [])

  // Fetch top services
  const fetchTopServices = useCallback(async () => {
    try {
      const response = await apiClient.get('/analytics/top-services?limit=5')
      
      if (response.data) {
        setTopServices(response.data)
      }
    } catch (err) {
      console.error('Error fetching top services:', err)
      toast.error('Không thể tải dữ liệu dịch vụ')
    }
  }, [])

  // Fetch top products
  const fetchTopProducts = useCallback(async () => {
    try {
      const response = await apiClient.get('/analytics/top-products?limit=5')
      
      if (response.data) {
        setTopProducts(response.data)
      }
    } catch (err) {
      console.error('Error fetching top products:', err)
      toast.error('Không thể tải dữ liệu sản phẩm')
    }
  }, [])

  // Fetch user activity
  const fetchUserActivity = useCallback(async (dateRange: string = '7days') => {
    try {
      const response = await apiClient.get(`/analytics/user-activity?range=${dateRange}`)
      
      if (response.data) {
        setUserActivity(response.data)
      }
    } catch (err) {
      console.error('Error fetching user activity:', err)
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
