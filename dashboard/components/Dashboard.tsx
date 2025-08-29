import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye, Package, Activity, Zap } from 'lucide-react';

interface DashboardProps {
  healthData: any;
  productsData: any;
  categoriesData: any;
  aiCapabilities: any;
}

const Dashboard: React.FC<DashboardProps> = ({ healthData, productsData, categoriesData, aiCapabilities }) => {
  // Process products data for charts
  const products = productsData?.data?.items || [];
  const categories = categoriesData?.data || [];

  // Calculate category distribution
  const categoryStats = categories.map((category: any) => {
    const categoryProducts = products.filter((product: any) => product.categoryId === category.id);
    return {
      name: category.name,
      value: categoryProducts.length,
      totalViews: categoryProducts.reduce((sum: number, product: any) => sum + (product.viewCount || 0), 0),
      totalRevenue: categoryProducts.reduce((sum: number, product: any) => sum + (product.priceCents || 0), 0) / 100
    };
  });

  // Top products by views
  const topProducts = [...products]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)
    .map(product => ({
      name: product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name,
      views: product.viewCount || 0,
      price: (product.priceCents || 0) / 100000, // Convert to millions VND
      featured: product.featured
    }));

  // Price range distribution
  const priceRanges = [
    { range: 'Dưới 1 triệu', min: 0, max: 1000000, count: 0 },
    { range: '1-5 triệu', min: 1000000, max: 5000000, count: 0 },
    { range: '5-10 triệu', min: 5000000, max: 10000000, count: 0 },
    { range: '10-20 triệu', min: 10000000, max: 20000000, count: 0 },
    { range: 'Trên 20 triệu', min: 20000000, max: Infinity, count: 0 }
  ];

  products.forEach((product: any) => {
    const price = product.priceCents || 0;
    const range = priceRanges.find(r => price >= r.min && price < r.max);
    if (range) range.count++;
  });

  // AI capabilities for display
  const aiFeatures = aiCapabilities?.data?.capabilities || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audio Tài Lộc Dashboard</h1>
          <p className="text-gray-600">Theo dõi hiệu suất và dữ liệu thực từ hệ thống</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                {categories.length} danh mục
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng view</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Lượt xem sản phẩm
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giá trị kho</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(products.reduce((sum: number, p: any) => sum + (p.priceCents || 0), 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                Tổng giá trị (VND)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Features</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiFeatures.length}</div>
              <p className="text-xs text-muted-foreground">
                Tính năng AI active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="ai">AI Features</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products by Views */}
              <Card>
                <CardHeader>
                  <CardTitle>Top sản phẩm theo lượt xem</CardTitle>
                  <CardDescription>Sản phẩm được quan tâm nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Product List */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách sản phẩm</CardTitle>
                  <CardDescription>Tất cả sản phẩm trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {products.slice(0, 8).map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-500">{(product.priceCents / 100000).toFixed(0)}K VND</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.featured && <Badge variant="secondary">Nổi bật</Badge>}
                          <span className="text-xs text-gray-500">{product.viewCount} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố danh mục</CardTitle>
                  <CardDescription>Số lượng sản phẩm theo danh mục</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê danh mục</CardTitle>
                  <CardDescription>Chi tiết từng danh mục</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((category: any, index: number) => (
                      <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <h4 className="font-medium text-sm">{category.name}</h4>
                            <p className="text-xs text-gray-500">{category.value} sản phẩm</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{category.totalViews.toLocaleString()} views</p>
                          <p className="text-xs text-gray-500">{category.totalRevenue.toFixed(1)}M VND</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Range Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố giá sản phẩm</CardTitle>
                  <CardDescription>Thống kê theo khoảng giá</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priceRanges}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Tình trạng hệ thống</CardTitle>
                  <CardDescription>Thông tin sức khỏe backend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Trạng thái</span>
                      <Badge variant={healthData?.data?.status === 'ok' ? 'default' : 'destructive'}>
                        {healthData?.data?.status || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Thời gian phản hồi</span>
                      <span className="text-sm font-medium">
                        {healthData?.data?.requests?.averageResponseTime || 0}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tổng requests</span>
                      <span className="text-sm font-medium">
                        {healthData?.data?.requests?.total || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lỗi hệ thống</span>
                      <span className="text-sm font-medium">
                        {healthData?.data?.errors?.total || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Features Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tính năng AI</CardTitle>
                <CardDescription>Các tính năng trí tuệ nhân tạo được kích hoạt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiFeatures.map((feature: any) => (
                    <div key={feature.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{feature.description}</h4>
                        <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                          {feature.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{feature.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {feature.models?.map((model: string) => (
                          <Badge key={model} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;