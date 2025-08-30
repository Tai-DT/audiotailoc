// Simple Mock Server for Audio Tài Lộc Backend Testing
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Loa Tài Lộc Classic',
    slug: 'loa-tai-loc-classic',
    priceCents: 2500000,
    description: 'Loa hifi cao cấp với âm thanh ấm áp',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=400&fit=crop',
    categoryId: '1',
    featured: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Tai nghe Sony WH-1000XM5',
    slug: 'tai-nghe-sony-wh1000xm5',
    priceCents: 8500000,
    description: 'Tai nghe chống ồn cao cấp',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    categoryId: '2',
    featured: true,
    isActive: true
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@audiotailoc.vn',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'John Nguyen',
    email: 'john@example.com',
    role: 'USER',
    createdAt: new Date('2024-01-15')
  }
];

// Health endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    },
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    path: '/api/v1/health',
    method: 'GET'
  });
});

// Products endpoints
app.get('/api/v1/catalog/products', (req, res) => {
  res.json({
    success: true,
    data: {
      items: mockProducts,
      total: mockProducts.length,
      page: 1,
      pageSize: 20
    },
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    path: '/api/v1/catalog/products',
    method: 'GET'
  });
});

// Users endpoints
app.get('/api/v1/users', (req, res) => {
  res.json({
    success: true,
    data: {
      items: mockUsers,
      total: mockUsers.length,
      page: 1,
      pageSize: 20
    },
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    path: '/api/v1/users',
    method: 'GET'
  });
});

// Analytics endpoints
app.get('/api/v1/analytics/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 6,
      totalProducts: 12,
      totalOrders: 7,
      totalRevenue: 27900000,
      averageOrderValue: 3985714,
      conversionRate: 116.67
    },
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    path: '/api/v1/analytics/overview',
    method: 'GET'
  });
});

// Search endpoints
app.get('/api/v1/search/products', (req, res) => {
  const query = req.query.query || '';
  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  res.json({
    success: true,
    data: {
      products: filteredProducts,
      items: filteredProducts,
      total: filteredProducts.length,
      query: query,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredProducts.length,
        totalPages: 1
      }
    },
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString(),
    path: '/api/v1/search/products',
    method: 'GET'
  });
});

// API Documentation
app.get('/docs', (req, res) => {
  res.send(`
    <html>
      <head><title>Audio Tài Lộc API Mock Server</title></head>
      <body>
        <h1>Audio Tài Lộc API Mock Server</h1>
        <p>Mock API server đang chạy trên port ${PORT}</p>
        <h2>Available endpoints:</h2>
        <ul>
          <li><a href="/api/v1/health">GET /api/v1/health</a> - Health check</li>
          <li><a href="/api/v1/catalog/products">GET /api/v1/catalog/products</a> - Products</li>
          <li><a href="/api/v1/users">GET /api/v1/users</a> - Users</li>
          <li><a href="/api/v1/analytics/overview">GET /api/v1/analytics/overview</a> - Analytics</li>
          <li><a href="/api/v1/search/products">GET /api/v1/search/products</a> - Search</li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
});
