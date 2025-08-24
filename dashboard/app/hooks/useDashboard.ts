import { useState, useEffect, useMemo } from 'react';

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    totalCents?: number;
    createdAt: string;
    status?: string;
  }>;
}

interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel for better performance
      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog/products?pageSize=1`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?pageSize=1`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?pageSize=1`),
      ]);

      // Process results
      const totalProducts = productsRes.status === 'fulfilled'
        ? (await productsRes.value.json()).totalCount || 0
        : 0;

      const totalOrders = ordersRes.status === 'fulfilled'
        ? (await ordersRes.value.json()).totalCount || 0
        : 0;

      const totalUsers = usersRes.status === 'fulfilled'
        ? (await usersRes.value.json()).totalCount || 0
        : 0;

      // Fetch recent orders for revenue calculation
      const recentOrdersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?pageSize=100`
      );

      let totalRevenue = 0;
      let recentOrders: any[] = [];

      if (recentOrdersRes.ok) {
        const ordersData = await recentOrdersRes.json();
        recentOrders = ordersData.items || [];
        totalRevenue = recentOrders.reduce((sum: number, order: any) =>
          sum + (order.totalCents || 0), 0
        );
      }

      setData({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders: recentOrders.slice(0, 5),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Hook for real-time dashboard updates
export function useRealtimeDashboard() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { lastUpdate };
}

