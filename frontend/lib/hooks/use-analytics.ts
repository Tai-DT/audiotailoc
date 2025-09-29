'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, handleApiResponse } from '@/lib/api';
import type { DashboardOverview, CustomerAnalytics, InventoryAnalytics } from '@/lib/types';

// Types
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  newUsers: number;
  newOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface SalesAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByPeriod: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersByRole: Record<string, number>;
}

export interface ProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  productsByCategory: Record<string, number>;
}

export interface RealtimeMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  lastUpdated: string;
}

interface RecentActivities {
  orders: Array<{
    id: string;
    orderNo: string;
    totalCents: number;
    status: string;
    createdAt: string;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

export interface BusinessKPIs {
  revenue: {
    current: number;
    target: number;
    growth: number;
  };
  orders: {
    current: number;
    target: number;
    growth: number;
  };
  customers: {
    acquisition: number;
    retention: number;
    satisfaction: number;
  };
  operational: {
    fulfillmentTime: number;
    returnRate: number;
    supportTickets: number;
  };
}

// Admin Dashboard Hooks
export function useDashboardStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['admin', 'dashboard', startDate, endDate],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD, {
        params: { startDate, endDate },
      });
      return handleApiResponse<{
        overview: DashboardStats;
        recentActivities: RecentActivities;
        period: { startDate: string; endDate: string };
      }>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserStats(days = 30) {
  return useQuery({
    queryKey: ['admin', 'stats', 'users', days],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_USERS, {
        params: { days },
      });
      return handleApiResponse<UserAnalytics>(response);
    },
  });
}

export function useOrderStats(days = 30) {
  return useQuery({
    queryKey: ['admin', 'stats', 'orders', days],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_ORDERS, {
        params: { days },
      });
      return handleApiResponse<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
        ordersByStatus: Record<string, number>;
      }>(response);
    },
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: ['admin', 'stats', 'products'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_PRODUCTS);
      return handleApiResponse<ProductAnalytics>(response);
    },
  });
}

// Analytics Hooks
export function useAnalyticsDashboard(filters?: {
  startDate?: string;
  endDate?: string;
  productIds?: string[];
  categoryIds?: string[];
}) {
  return useQuery({
    queryKey: ['analytics', 'dashboard', filters],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, {
        params: filters,
      });
      return handleApiResponse<DashboardOverview>(response);
    },
  });
}

export function useSalesAnalytics(filters?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['analytics', 'sales', filters],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.SALES, {
        params: filters,
      });
      return handleApiResponse<SalesAnalytics>(response);
    },
  });
}

export function useCustomerAnalytics(filters?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['analytics', 'customers', filters],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/customers', {
        params: filters,
      });
      return handleApiResponse<CustomerAnalytics>(response);
    },
  });
}

export function useInventoryAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'inventory'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.INVENTORY);
      return handleApiResponse<InventoryAnalytics>(response);
    },
  });
}

export function useBusinessKPIs(filters?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['analytics', 'kpis', filters],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.KPIS, {
        params: filters,
      });
      return handleApiResponse<BusinessKPIs>(response);
    },
  });
}

// Real-time Analytics
export function useRealtimeSales() {
  return useQuery({
    queryKey: ['analytics', 'realtime', 'sales'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.REALTIME_SALES);
      return handleApiResponse<RealtimeMetrics>(response);
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 0, // Always considered stale for real-time updates
  });
}

export function useRealtimeOrders() {
  return useQuery({
    queryKey: ['analytics', 'realtime', 'orders'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.REALTIME_ORDERS);
      return handleApiResponse<{
        todayOrders: number;
        todayRevenue: number;
        averageOrderValue: number;
        lastUpdated: string;
      }>(response);
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}