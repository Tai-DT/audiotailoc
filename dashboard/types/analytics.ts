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