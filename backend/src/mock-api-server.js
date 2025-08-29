/*
  Simple mock API server for testing dashboard integration
  Usage: node src/mock-api-server.js
*/

const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());

// Mock data
const mockData = {
  users: [
    { id: '1', email: 'admin@audiotailoc.vn', name: 'Admin User', role: 'ADMIN', createdAt: new Date().toISOString() },
    { id: '2', email: 'user1@example.com', name: 'Nguyễn Văn A', role: 'USER', createdAt: new Date().toISOString() },
    { id: '3', email: 'user2@example.com', name: 'Trần Thị B', role: 'USER', createdAt: new Date().toISOString() },
    { id: '4', email: 'user3@example.com', name: 'Lê Văn C', role: 'USER', createdAt: new Date().toISOString() },
    { id: '5', email: 'user4@example.com', name: 'Phạm Thị D', role: 'USER', createdAt: new Date().toISOString() },
  ],
  products: [
    {
      id: '1',
      slug: 'loa-tai-loc-classic',
      name: 'Loa Tài Lộc Classic',
      description: 'Âm thanh ấm áp, thiết kế cổ điển.',
      priceCents: 1990000,
      imageUrl: 'https://placehold.co/600x400/4f46e5/ffffff?text=Classic+Speaker',
      featured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      slug: 'tai-nghe-tai-loc-pro',
      name: 'Tai nghe Tài Lộc Pro',
      description: 'Chống ồn chủ động, pin 30 giờ.',
      priceCents: 2990000,
      imageUrl: 'https://placehold.co/600x400/059669/ffffff?text=Pro+Headphones',
      featured: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      slug: 'soundbar-tai-loc-5-1',
      name: 'Soundbar Tài Lộc 5.1',
      description: 'Rạp tại gia, âm trường rộng.',
      priceCents: 4990000,
      imageUrl: 'https://placehold.co/600x400/dc2626/ffffff?text=Soundbar+5.1',
      featured: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: '1',
      userId: '2',
      status: 'DELIVERED',
      totalCents: 1990000,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    },
    {
      id: '2',
      userId: '3',
      status: 'PROCESSING',
      totalCents: 2990000,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    {
      id: '3',
      userId: '4',
      status: 'PENDING',
      totalCents: 4990000,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
  ],
  metrics: {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    disk: Math.random() * 100,
    uptime: 3600 + Math.random() * 86400,
    requests: Math.floor(Math.random() * 1000),
    errors: Math.floor(Math.random() * 10),
  }
};

// System Health endpoint
app.get('/api/v2/shutdown/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: mockData.metrics.uptime,
      version: '1.0.0',
      environment: 'development'
    }
  });
});

// System Metrics endpoint
app.get('/api/v2/monitoring/metrics', (req, res) => {
  // Generate dynamic metrics
  mockData.metrics = {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    disk: Math.random() * 100,
    uptime: mockData.metrics.uptime + 60, // Increment uptime
    requests: mockData.metrics.requests + Math.floor(Math.random() * 10),
    errors: mockData.metrics.errors + Math.floor(Math.random() * 2),
  };

  res.json({
    success: true,
    data: {
      system: {
        cpu: { usage: mockData.metrics.cpu, cores: 4 },
        memory: { usage: mockData.metrics.memory, total: 8192, free: 8192 - (mockData.metrics.memory * 81.92) },
        disk: { usage: mockData.metrics.disk, total: 500, free: 500 - (mockData.metrics.disk * 5) }
      },
      application: {
        uptime: mockData.metrics.uptime,
        requests: mockData.metrics.requests,
        errors: mockData.metrics.errors,
        activeConnections: Math.floor(Math.random() * 50)
      },
      timestamp: new Date().toISOString()
    }
  });
});

// Users endpoints
app.get('/api/v2/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search || '';

  let filteredUsers = mockData.users;
  if (search) {
    filteredUsers = mockData.users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = filteredUsers.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredUsers.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  });
});

// Products endpoints
app.get('/api/v2/catalog/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const total = mockData.products.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = mockData.products.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      },
      totalCount: total
    }
  });
});

// Orders endpoints
app.get('/api/v2/orders', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const total = mockData.orders.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = mockData.orders.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      },
      totalCount: total
    }
  });
});

// Dashboard stats endpoint
app.get('/api/v2/dashboard/stats', (req, res) => {
  const totalRevenue = mockData.orders.reduce((sum, order) => sum + order.totalCents, 0);
  
  res.json({
    success: true,
    data: {
      totalUsers: mockData.users.length,
      totalProducts: mockData.products.length,
      totalOrders: mockData.orders.length,
      totalRevenue,
      recentOrders: mockData.orders.slice(0, 5),
      systemHealth: {
        status: 'healthy',
        uptime: mockData.metrics.uptime,
        cpu: mockData.metrics.cpu,
        memory: mockData.metrics.memory
      }
    }
  });
});

// Security endpoints
app.get('/api/v2/security/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalThreats: Math.floor(Math.random() * 5),
      blockedRequests: Math.floor(Math.random() * 100),
      failedLogins: Math.floor(Math.random() * 10),
      lastScan: new Date().toISOString(),
      securityLevel: 'HIGH'
    }
  });
});

// Backup endpoints
app.get('/api/v2/backup/info', (req, res) => {
  res.json({
    success: true,
    data: {
      lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      nextBackup: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22 hours from now
      backupSize: '156.7 MB',
      status: 'completed'
    }
  });
});

// API Documentation endpoint
app.get('/api/v2/docs', (req, res) => {
  res.json({
    success: true,
    data: {
      version: 'v2',
      endpoints: [
        { method: 'GET', path: '/api/v2/shutdown/health', description: 'System health check' },
        { method: 'GET', path: '/api/v2/monitoring/metrics', description: 'System metrics' },
        { method: 'GET', path: '/api/v2/users', description: 'List users' },
        { method: 'GET', path: '/api/v2/catalog/products', description: 'List products' },
        { method: 'GET', path: '/api/v2/orders', description: 'List orders' },
        { method: 'GET', path: '/api/v2/dashboard/stats', description: 'Dashboard statistics' },
      ]
    }
  });
});

// Logs endpoint
app.get('/api/v2/logs', (req, res) => {
  const logs = [
    { level: 'INFO', message: 'Application started successfully', timestamp: new Date().toISOString() },
    { level: 'INFO', message: 'Database connection established', timestamp: new Date(Date.now() - 5000).toISOString() },
    { level: 'WARN', message: 'High memory usage detected', timestamp: new Date(Date.now() - 10000).toISOString() },
    { level: 'INFO', message: 'User authentication successful', timestamp: new Date(Date.now() - 15000).toISOString() },
    { level: 'ERROR', message: 'Failed to process payment', timestamp: new Date(Date.now() - 20000).toISOString() },
  ];

  res.json({
    success: true,
    data: {
      logs,
      total: logs.length
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      details: err.message
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      path: req.originalUrl
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${port}`);
  console.log(`📊 Dashboard can connect to: http://localhost:${port}/api/v2`);
  console.log(`🔍 Health check: http://localhost:${port}/api/v2/shutdown/health`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET /api/v2/shutdown/health - System health');
  console.log('  GET /api/v2/monitoring/metrics - System metrics');
  console.log('  GET /api/v2/users - Users list');
  console.log('  GET /api/v2/catalog/products - Products list');
  console.log('  GET /api/v2/orders - Orders list');
  console.log('  GET /api/v2/dashboard/stats - Dashboard stats');
  console.log('  GET /api/v2/security/stats - Security stats');
  console.log('  GET /api/v2/backup/info - Backup info');
  console.log('  GET /api/v2/docs - API documentation');
  console.log('  GET /api/v2/logs - System logs');
});