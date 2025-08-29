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

      // Fetch analytics overview first
      const overviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/overview`);
      
      if (!overviewRes.ok) {
        throw new Error(`API error: ${overviewRes.status}`);
      }
      
      const overview = await overviewRes.json();
      
      // Fetch recent orders for display
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`);
      let recentOrders: any[] = [];
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        recentOrders = ordersData.data || [];
      }

      setData({
        totalProducts: overview.totalProducts || 0,
        totalOrders: overview.totalOrders || 0,
        totalUsers: overview.totalUsers || 0,
        totalRevenue: overview.totalRevenue || 0,
        recentOrders: recentOrders.slice(0, 5),
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
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

