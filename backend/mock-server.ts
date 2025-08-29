// Mock API endpoints to test dashboard integration without Prisma
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS for dashboard
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));

app.use(express.json());

// Mock data
const mockData = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@audiotailoc.vn', role: 'ADMIN', createdAt: new Date('2024-01-01') },
    { id: '2', name: 'John Nguyen', email: 'john@example.com', role: 'USER', createdAt: new Date('2024-01-15') },
    { id: '3', name: 'Maria Tran', email: 'maria@example.com', role: 'USER', createdAt: new Date('2024-02-01') },
    { id: '4', name: 'David Le', email: 'david@example.com', role: 'USER', createdAt: new Date('2024-02-10') }
  ],
  products: [
    { id: '1', name: 'Loa Tài Lộc Classic', slug: 'loa-tai-loc-classic', priceCents: 2500000, categoryId: '1', featured: true, isActive: true },
    { id: '2', name: 'Tai nghe Sony WH-1000XM5', slug: 'tai-nghe-sony-wh1000xm5', priceCents: 8500000, categoryId: '2', featured: true, isActive: true },
    { id: '3', name: 'Loa Bluetooth JBL', slug: 'loa-bluetooth-jbl', priceCents: 1200000, categoryId: '1', featured: false, isActive: true },
    { id: '4', name: 'Tai nghe Gaming Razer', slug: 'tai-nghe-gaming-razer', priceCents: 3500000, categoryId: '2', featured: false, isActive: true }
  ],
  categories: [
    { id: '1', name: 'Loa', slug: 'loa', isActive: true },
    { id: '2', name: 'Tai nghe', slug: 'tai-nghe', isActive: true }
  ],
  orders: [
    { id: '1', orderNo: 'ORD-001', userId: '2', totalCents: 2500000, status: 'PAID', createdAt: new Date('2024-01-20') },
    { id: '2', orderNo: 'ORD-002', userId: '3', totalCents: 8500000, status: 'FULFILLED', createdAt: new Date('2024-02-05') },
    { id: '3', orderNo: 'ORD-003', userId: '4', totalCents: 1200000, status: 'PENDING', createdAt: new Date('2024-02-15') },
    { id: '4', orderNo: 'ORD-004', userId: '2', totalCents: 3500000, status: 'PAID', createdAt: new Date('2024-02-20') }
  ]
};

// API Routes for Dashboard Integration

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'development',
    version: '1.0.0'
  });
});

// Analytics endpoints
app.get('/api/v1/analytics/overview', (req, res) => {
  const totalUsers = mockData.users.length;
  const totalProducts = mockData.products.length;
  const totalOrders = mockData.orders.length;
  const totalRevenue = mockData.orders.reduce((sum, order) => sum + order.totalCents, 0);
  const activeProducts = mockData.products.filter(p => p.isActive).length;
  
  res.json({
    totalUsers,
    totalProducts,
    activeProducts,
    totalOrders,
    totalRevenue,
    revenueFormatted: new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(totalRevenue),
    metrics: {
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      conversion: Math.round((totalOrders / totalUsers) * 100 * 100) / 100
    }
  });
});

// Users endpoints
app.get('/api/v1/users', (req, res) => {
  res.json({
    data: mockData.users,
    meta: {
      total: mockData.users.length,
      page: 1,
      limit: 10
    }
  });
});

app.get('/api/v1/users/stats', (req, res) => {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  const thisMonthUsers = mockData.users.filter(u => new Date(u.createdAt) >= thisMonth).length;
  const lastMonthUsers = mockData.users.filter(u => {
    const created = new Date(u.createdAt);
    return created >= lastMonth && created < thisMonth;
  }).length;
  
  res.json({
    total: mockData.users.length,
    thisMonth: thisMonthUsers,
    lastMonth: lastMonthUsers,
    growth: lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0,
    byRole: {
      ADMIN: mockData.users.filter(u => u.role === 'ADMIN').length,
      USER: mockData.users.filter(u => u.role === 'USER').length
    }
  });
});

// Products endpoints
app.get('/api/v1/catalog/products', (req, res) => {
  res.json({
    data: mockData.products,
    meta: {
      total: mockData.products.length,
      page: 1,
      limit: 10
    }
  });
});

app.get('/api/v1/catalog/categories', (req, res) => {
  res.json({
    data: mockData.categories,
    meta: {
      total: mockData.categories.length,
      page: 1,
      limit: 10
    }
  });
});

// Orders endpoints
app.get('/api/v1/orders', (req, res) => {
  const ordersWithDetails = mockData.orders.map(order => ({
    ...order,
    user: mockData.users.find(u => u.id === order.userId)
  }));
  
  res.json({
    data: ordersWithDetails,
    meta: {
      total: mockData.orders.length,
      page: 1,
      limit: 10
    }
  });
});

app.get('/api/v1/orders/stats', (req, res) => {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const thisMonthOrders = mockData.orders.filter(o => new Date(o.createdAt) >= thisMonth);
  const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalCents, 0);
  
  const statusCounts = mockData.orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  res.json({
    total: mockData.orders.length,
    thisMonth: thisMonthOrders.length,
    thisMonthRevenue,
    totalRevenue: mockData.orders.reduce((sum, order) => sum + order.totalCents, 0),
    byStatus: statusCounts,
    recent: mockData.orders.slice(-5).reverse()
  });
});

// Revenue analytics
app.get('/api/v1/analytics/revenue', (req, res) => {
  const monthlyData = [];
  const currentDate = new Date();
  
  // Generate last 6 months of data
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthOrders = mockData.orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getFullYear() === date.getFullYear() && 
             orderDate.getMonth() === date.getMonth();
    });
    
    monthlyData.push({
      month: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
      revenue: monthOrders.reduce((sum, order) => sum + order.totalCents, 0),
      orders: monthOrders.length
    });
  }
  
  res.json({
    monthlyData,
    totalRevenue: mockData.orders.reduce((sum, order) => sum + order.totalCents, 0),
    averageOrderValue: mockData.orders.length > 0 ? 
      mockData.orders.reduce((sum, order) => sum + order.totalCents, 0) / mockData.orders.length : 0
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Backend API running on http://localhost:${PORT}`);
  console.log(`📚 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`📊 Analytics: http://localhost:${PORT}/api/v1/analytics/overview`);
  console.log(`👥 Users: http://localhost:${PORT}/api/v1/users`);
  console.log(`📦 Products: http://localhost:${PORT}/api/v1/catalog/products`);
  console.log(`🛒 Orders: http://localhost:${PORT}/api/v1/orders`);
  console.log('');
  console.log('✅ Ready for dashboard integration testing!');
});

export default app;