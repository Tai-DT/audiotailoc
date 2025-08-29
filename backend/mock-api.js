// Simple mock API server using Node.js built-in http module
const http = require('http');
const url = require('url');

const PORT = 8000;

// Mock data with current dates
const now = new Date();
const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

const mockData = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@audiotailoc.vn', role: 'ADMIN', createdAt: twoMonthsAgo.toISOString() },
    { id: '2', name: 'John Nguyen', email: 'john@example.com', role: 'USER', createdAt: lastMonth.toISOString() },
    { id: '3', name: 'Maria Tran', email: 'maria@example.com', role: 'USER', createdAt: lastMonth.toISOString() },
    { id: '4', name: 'David Le', email: 'david@example.com', role: 'USER', createdAt: thisMonth.toISOString() },
    { id: '5', name: 'Sarah Pham', email: 'sarah@example.com', role: 'USER', createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '6', name: 'Michael Vo', email: 'michael@example.com', role: 'USER', createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  products: [
    { id: '1', name: 'Loa Tài Lộc Classic', slug: 'loa-tai-loc-classic', priceCents: 2500000, categoryId: '1', featured: true, isActive: true },
    { id: '2', name: 'Tai nghe Sony WH-1000XM5', slug: 'tai-nghe-sony-wh1000xm5', priceCents: 8500000, categoryId: '2', featured: true, isActive: true },
    { id: '3', name: 'Loa Bluetooth JBL', slug: 'loa-bluetooth-jbl', priceCents: 1200000, categoryId: '1', featured: false, isActive: true },
    { id: '4', name: 'Tai nghe Gaming Razer', slug: 'tai-nghe-gaming-razer', priceCents: 3500000, categoryId: '2', featured: false, isActive: true },
    { id: '5', name: 'Loa Soundbar Samsung', slug: 'loa-soundbar-samsung', priceCents: 4200000, categoryId: '1', featured: true, isActive: true },
    { id: '6', name: 'Tai nghe AirPods Pro', slug: 'tai-nghe-airpods-pro', priceCents: 6800000, categoryId: '2', featured: true, isActive: true }
  ],
  categories: [
    { id: '1', name: 'Loa', slug: 'loa', isActive: true },
    { id: '2', name: 'Tai nghe', slug: 'tai-nghe', isActive: true }
  ],
  orders: [
    { id: '1', orderNo: 'ORD-001', userId: '2', totalCents: 2500000, status: 'PAID', createdAt: lastMonth.toISOString() },
    { id: '2', orderNo: 'ORD-002', userId: '3', totalCents: 8500000, status: 'FULFILLED', createdAt: lastMonth.toISOString() },
    { id: '3', orderNo: 'ORD-003', userId: '4', totalCents: 1200000, status: 'PENDING', createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '4', orderNo: 'ORD-004', userId: '2', totalCents: 3500000, status: 'PAID', createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '5', orderNo: 'ORD-005', userId: '5', totalCents: 4200000, status: 'PAID', createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '6', orderNo: 'ORD-006', userId: '6', totalCents: 6800000, status: 'FULFILLED', createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() },
    { id: '7', orderNo: 'ORD-007', userId: '4', totalCents: 1200000, status: 'PENDING', createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() }
  ]
};

function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJSON(res, data, statusCode = 200) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`${method} ${path}`);

  // Health Check
  if (path === '/api/v1/health') {
    sendJSON(res, { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: 'development',
      version: '1.0.0'
    });
    return;
  }

  // Analytics Overview
  if (path === '/api/v1/analytics/overview') {
    const totalUsers = mockData.users.length;
    const totalProducts = mockData.products.length;
    const totalOrders = mockData.orders.length;
    const totalRevenue = mockData.orders.reduce((sum, order) => sum + order.totalCents, 0);
    const activeProducts = mockData.products.filter(p => p.isActive).length;
    
    sendJSON(res, {
      totalUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      revenueFormatted: formatCurrency(totalRevenue),
      metrics: {
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        conversion: Math.round((totalOrders / totalUsers) * 100 * 100) / 100
      }
    });
    return;
  }

  // Users
  if (path === '/api/v1/users') {
    sendJSON(res, {
      data: mockData.users,
      meta: {
        total: mockData.users.length,
        page: 1,
        limit: 10
      }
    });
    return;
  }

  // User Stats
  if (path === '/api/v1/users/stats') {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    const thisMonthUsers = mockData.users.filter(u => new Date(u.createdAt) >= thisMonth).length;
    const lastMonthUsers = mockData.users.filter(u => {
      const created = new Date(u.createdAt);
      return created >= lastMonth && created < thisMonth;
    }).length;
    
    sendJSON(res, {
      total: mockData.users.length,
      thisMonth: thisMonthUsers,
      lastMonth: lastMonthUsers,
      growth: lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0,
      byRole: {
        ADMIN: mockData.users.filter(u => u.role === 'ADMIN').length,
        USER: mockData.users.filter(u => u.role === 'USER').length
      }
    });
    return;
  }

  // Products
  if (path === '/api/v1/catalog/products') {
    sendJSON(res, {
      data: mockData.products,
      meta: {
        total: mockData.products.length,
        page: 1,
        limit: 10
      }
    });
    return;
  }

  // Categories
  if (path === '/api/v1/catalog/categories') {
    sendJSON(res, {
      data: mockData.categories,
      meta: {
        total: mockData.categories.length,
        page: 1,
        limit: 10
      }
    });
    return;
  }

  // Orders
  if (path === '/api/v1/orders') {
    const ordersWithDetails = mockData.orders.map(order => ({
      ...order,
      user: mockData.users.find(u => u.id === order.userId)
    }));
    
    sendJSON(res, {
      data: ordersWithDetails,
      meta: {
        total: mockData.orders.length,
        page: 1,
        limit: 10
      }
    });
    return;
  }

  // Order Stats
  if (path === '/api/v1/orders/stats') {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const thisMonthOrders = mockData.orders.filter(o => new Date(o.createdAt) >= thisMonth);
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalCents, 0);
    
    const statusCounts = mockData.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    sendJSON(res, {
      total: mockData.orders.length,
      thisMonth: thisMonthOrders.length,
      thisMonthRevenue,
      totalRevenue: mockData.orders.reduce((sum, order) => sum + order.totalCents, 0),
      byStatus: statusCounts,
      recent: mockData.orders.slice(-5).reverse()
    });
    return;
  }

  // Revenue Analytics
  if (path === '/api/v1/analytics/revenue') {
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
    
    sendJSON(res, {
      monthlyData,
      totalRevenue: mockData.orders.reduce((sum, order) => sum + order.totalCents, 0),
      averageOrderValue: mockData.orders.length > 0 ? 
        mockData.orders.reduce((sum, order) => sum + order.totalCents, 0) / mockData.orders.length : 0
    });
    return;
  }

  // 404 for unknown routes
  sendJSON(res, { 
    error: 'Not Found', 
    message: `Route ${path} not found`,
    availableRoutes: [
      '/api/v1/health',
      '/api/v1/analytics/overview',
      '/api/v1/users',
      '/api/v1/users/stats',
      '/api/v1/catalog/products',
      '/api/v1/catalog/categories',
      '/api/v1/orders',
      '/api/v1/orders/stats',
      '/api/v1/analytics/revenue'
    ]
  }, 404);
});

server.listen(PORT, () => {
  console.log(`🚀 Mock Backend API running on http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Available API Endpoints:');
  console.log(`📚 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`📊 Analytics: http://localhost:${PORT}/api/v1/analytics/overview`);
  console.log(`💰 Revenue: http://localhost:${PORT}/api/v1/analytics/revenue`);
  console.log(`👥 Users: http://localhost:${PORT}/api/v1/users`);
  console.log(`📈 User Stats: http://localhost:${PORT}/api/v1/users/stats`);
  console.log(`📦 Products: http://localhost:${PORT}/api/v1/catalog/products`);
  console.log(`🏷️  Categories: http://localhost:${PORT}/api/v1/catalog/categories`);
  console.log(`🛒 Orders: http://localhost:${PORT}/api/v1/orders`);
  console.log(`📈 Order Stats: http://localhost:${PORT}/api/v1/orders/stats`);
  console.log('');
  console.log('✅ Ready for dashboard integration testing!');
  console.log('🌐 CORS enabled for dashboard access');
});