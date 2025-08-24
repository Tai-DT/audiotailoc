"use client"

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    quantity: number;
    growth: number;
  }>;
  salesByPeriod: Array<{
    period: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  customerLifetimeValue: number;
  averageOrdersPerCustomer: number;
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  topCustomers: Array<{
    id: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: Date;
  }>;
}

interface InventoryMetrics {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  averageInventoryTurnover: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    quantitySold: number;
    revenue: number;
    stockLevel: number;
  }>;
  slowMovingProducts: Array<{
    id: string;
    name: string;
    daysSinceLastSale: number;
    stockLevel: number;
    value: number;
  }>;
}

interface BusinessKPIs {
  monthlyRecurringRevenue: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  churnRate: number;
  netPromoterScore: number;
  averageResponseTime: number;
  orderFulfillmentRate: number;
  returnRate: number;
  profitMargin: number;
  marketingROI: number;
}

interface DashboardData {
  sales: SalesMetrics;
  customers: CustomerMetrics;
  inventory: InventoryMetrics;
  kpis: BusinessKPIs;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
    value?: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '↗️';
    if (growth < 0) return '↘️';
    return '➡️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không thể tải dữ liệu dashboard</p>
        <Button onClick={loadDashboardData} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Tổng quan về hiệu suất kinh doanh</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
            <option value="1y">1 năm qua</option>
          </select>
          
          <Button onClick={loadDashboardData} variant="outline">
            Làm mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Tổng quan' },
            { id: 'sales', name: 'Bán hàng' },
            { id: 'customers', name: 'Khách hàng' },
            { id: 'inventory', name: 'Kho hàng' },
            { id: 'kpis', name: 'KPIs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.sales.totalRevenue)}</div>
                <div className={`text-sm ${getGrowthColor(data.sales.revenueGrowth)}`}>
                  {getGrowthIcon(data.sales.revenueGrowth)} {formatPercentage(data.sales.revenueGrowth)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.sales.totalOrders)}</div>
                <div className={`text-sm ${getGrowthColor(data.sales.orderGrowth)}`}>
                  {getGrowthIcon(data.sales.orderGrowth)} {formatPercentage(data.sales.orderGrowth)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.customers.totalCustomers)}</div>
                <div className="text-sm text-gray-600">
                  {formatNumber(data.customers.newCustomers)} khách mới
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Giá trị đơn hàng TB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.sales.averageOrderValue)}</div>
                <div className="text-sm text-gray-600">
                  Tỷ lệ chuyển đổi: {formatPercentage(data.sales.conversionRate)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    {activity.value && (
                      <Badge variant="secondary">
                        {formatCurrency(activity.value)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.sales.topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          Đã bán: {formatNumber(product.quantity)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        <p className={`text-sm ${getGrowthColor(product.growth)}`}>
                          {getGrowthIcon(product.growth)} {formatPercentage(product.growth)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Period */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.sales.salesByPeriod.map((period) => (
                    <div key={period.period} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{period.period}</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(period.orders)} đơn hàng
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(period.revenue)}</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(period.customers)} khách hàng
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle>Phân khúc khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.customers.customerSegments.map((segment) => (
                    <div key={segment.segment} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{segment.segment}</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(segment.count)} khách hàng ({formatPercentage(segment.percentage)})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(segment.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Chỉ số khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tỷ lệ giữ chân khách hàng:</span>
                    <span className="font-medium">{formatPercentage(data.customers.customerRetentionRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá trị trọn đời khách hàng:</span>
                    <span className="font-medium">{formatCurrency(data.customers.customerLifetimeValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số đơn hàng TB/khách:</span>
                    <span className="font-medium">{data.customers.averageOrdersPerCustomer.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.inventory.totalProducts)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Sắp hết hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(data.inventory.lowStockProducts)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Hết hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatNumber(data.inventory.outOfStockProducts)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tỷ lệ hoàn thành đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(data.kpis.orderFulfillmentRate)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tỷ lệ trả hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(data.kpis.returnRate)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Biên lợi nhuận</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(data.kpis.profitMargin)}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
