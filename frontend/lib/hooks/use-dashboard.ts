import { useQuery } from '@tanstack/react-query';
import { apiClient, handleApiResponse } from '../api';
import { DashboardOverview, SalesAnalytics, CustomerAnalytics, BusinessKPIs } from '../types';

export const dashboardQueryKeys = {
  overview: ['dashboard', 'overview'] as const,
  sales: ['dashboard', 'sales'] as const,
  customers: ['dashboard', 'customers'] as const,
  kpis: ['dashboard', 'kpis'] as const,
};

export const useDashboardOverview = (period: string = 'today') => {
  return useQuery({
    queryKey: [...dashboardQueryKeys.overview, period],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/overview', { params: { period } });
      return handleApiResponse<DashboardOverview>(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSalesAnalytics = (period: string = 'month') => {
  return useQuery({
    queryKey: [...dashboardQueryKeys.sales, period],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/analytics/sales', { params: { period } });
      return handleApiResponse<SalesAnalytics>(response);
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useCustomerAnalytics = (period: string = 'month') => {
  return useQuery({
    queryKey: [...dashboardQueryKeys.customers, period],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/analytics/customers', { params: { period } });
      return handleApiResponse<CustomerAnalytics>(response);
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useBusinessKPIs = () => {
  return useQuery({
    queryKey: dashboardQueryKeys.kpis,
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/kpis');
      return handleApiResponse<BusinessKPIs>(response);
    },
    staleTime: 15 * 60 * 1000,
  });
};