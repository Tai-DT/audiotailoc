import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { mockProducts, mockCategories, mockUsers } from './mock-data';

const app = express();
const PORT = 3010;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Simple logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// Global prefix
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Audio Tài Lộc API (Mock Mode)'
  });
});

// Auth endpoints
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  
  // In a real app, we'd check password hash
  const validPasswords: Record<string, string> = {
    'admin@audiotailoc.com': 'admin123',
    'user@example.com': 'user123'
  };
  
  if (validPasswords[email as string] !== password) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  
  // Mock JWT token
  const token = `mock.jwt.token.${user.id}`;
  
  res.json({
    accessToken: token,
    refreshToken: `refresh.${token}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const userId = token.split('.').pop(); // Extract user ID from mock token
  
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
});

// Categories endpoints
router.get('/catalog/categories', (req, res) => {
  res.json(mockCategories);
});

// Products endpoints
router.get('/catalog/products', (req, res) => {
  const { page = 1, limit = 12, categoryId, search } = req.query;
  let products = [...mockProducts];
  
  // Filter by category
  if (categoryId) {
    products = products.filter(p => p.categoryId === categoryId);
  }
  
  // Filter by search
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    items: paginatedProducts,
    total: products.length,
    page: pageNum,
    pageSize: limitNum
  });
});

router.get('/catalog/products/:slug', (req, res) => {
  const { slug } = req.params;
  const product = mockProducts.find(p => p.slug === slug);
  
  if (!product) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }
  
  res.json(product);
});

// Cart endpoints (simplified)
let mockCarts = new Map();

router.get('/cart', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ items: [], subtotalCents: 0 });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const userId = token.split('.').pop();
  
  const cart = mockCarts.get(userId) || { items: [], subtotalCents: 0 };
  res.json(cart);
});

router.post('/cart/items', (req, res) => {
  const { slug, quantity = 1 } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const userId = token.split('.').pop();
  
  const product = mockProducts.find(p => p.slug === slug);
  if (!product) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }
  
  let cart: any = mockCarts.get(userId) || { items: [], subtotalCents: 0 };
  
  const existingItem = cart.items.find((item: any) => item.productId === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      id: `item_${Date.now()}`,
      cartId: `cart_${userId}`,
      productId: product.id,
      quantity,
      unitPrice: product.priceCents,
      product: {
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl
      }
    });
  }
  
  // Recalculate subtotal
  cart.subtotalCents = cart.items.reduce((total: number, item: any) => 
    total + (item.unitPrice * item.quantity), 0
  );
  
  mockCarts.set(userId, cart);
  res.json({ message: 'Đã thêm vào giỏ hàng', cart });
});

// File upload mock
router.post('/files/upload', (req, res) => {
  // Mock file upload response
  res.json({
    key: `mock_${Date.now()}.jpg`,
    url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'
  });
});

// Apply router with prefix
app.use('/api/v1', router);

// Also add the endpoints without prefix for compatibility
app.use('/', router);

// Swagger documentation mock
app.get('/docs', (req, res) => {
  res.send(`
    <html>
      <head><title>Audio Tài Lộc API Documentation</title></head>
      <body>
        <h1>Audio Tài Lộc API Documentation</h1>
        <p>API is running in mock mode for demonstration.</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li>GET /api/v1/health - Health check</li>
          <li>POST /api/v1/auth/login - Login</li>
          <li>GET /api/v1/auth/me - Get current user</li>
          <li>GET /api/v1/catalog/categories - Get categories</li>
          <li>GET /api/v1/catalog/products - Get products</li>
          <li>GET /api/v1/catalog/products/:slug - Get product by slug</li>
          <li>GET /api/v1/cart - Get cart</li>
          <li>POST /api/v1/cart/add - Add to cart</li>
          <li>POST /api/v1/files/upload - Upload file</li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Audio Tài Lộc API (Mock Mode) is running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌍 Environment: Mock Development Mode`);
});