import { TestDatabaseService } from './modules/testing/test-database.service';
import { TestHelpersService } from './modules/testing/test-helpers.service';
import { MockServicesService } from './modules/testing/mock-services.service';

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.TESTING_MOCK_SERVICES = 'true';

  console.log('🧪 Test environment initialized');
});

// Global test teardown
afterAll(async () => {
  console.log('🧪 Test environment cleanup completed');
});

// Test timeout for async operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Only show errors that are not expected in tests
    if (!args[0]?.includes?.('Test warning') && !args[0]?.includes?.('Test error')) {
      originalConsoleError(...args);
    }
  };

  console.warn = (...args: any[]) => {
    // Only show warnings that are not expected in tests
    if (!args[0]?.includes?.('Test warning')) {
      originalConsoleWarn(...args);
    }
  };
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  generateTestEmail: () => `test${Date.now()}${Math.random().toString(36).substring(7)}@example.com`,

  generateTestPhone: () => `0${Math.floor(Math.random() * 900000000 + 100000000)}`,

  generateTestId: (prefix: string = 'test') => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`,

  // Mock implementation for common test patterns
  mockPrismaClient: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    order: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },

  mockRedisClient: {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
    quit: jest.fn().mockResolvedValue('OK'),
  },
};

// Test data factories
global.testFactories = {
  createUserData: (overrides = {}) => ({
    email: global.testUtils.generateTestEmail(),
    password: 'hashedpassword123',
    name: 'Test User',
    phone: global.testUtils.generateTestPhone(),
    isActive: true,
    role: 'USER',
    emailVerified: false,
    ...overrides,
  }),

  createProductData: (overrides = {}) => ({
    name: `Test Product ${Date.now()}`,
    description: 'This is a test product',
    price: 100000,
    originalPrice: 120000,
    stock: 10,
    categoryId: 'test-category',
    images: ['https://example.com/image1.jpg'],
    isActive: true,
    isFeatured: false,
    seoTitle: `Test Product ${Date.now()}`,
    seoDescription: 'Test product description',
    ...overrides,
  }),

  createOrderData: (userId: string, productIds: string[] = [], overrides = {}) => ({
    userId,
    total: productIds.length * 100000,
    status: 'PENDING',
    paymentMethod: 'VNPAY',
    shippingAddress: '123 Test Street, Test City',
    shippingPhone: global.testUtils.generateTestPhone(),
    shippingName: 'Test User',
    ...overrides,
  }),

  createPaymentData: (overrides = {}) => ({
    amount: 100000,
    orderId: global.testUtils.generateTestId('order'),
    paymentMethod: 'VNPAY',
    description: 'Test payment',
    returnUrl: 'http://localhost:3000/payment/callback',
    ...overrides,
  }),
};

// Environment setup for tests
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Database test settings
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/audiotailoc_test';

// Redis test settings
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379/1';

// External service test settings
process.env.VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || 'test_tmn_code';
process.env.VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'test_hash_secret';
process.env.VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn';

// Email service test settings
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'test@example.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'test_password';

// AI service test settings
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test_gemini_api_key';

// File storage test settings
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'test_cloud_name';
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'test_api_key';
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'test_api_secret';

// Webhook test settings
process.env.WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'test_webhook_secret';

// Logging test settings
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error';
process.env.LOG_DIR = process.env.LOG_DIR || './logs';

// Security test settings
process.env.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || '8'; // Lower for faster tests
process.env.RATE_LIMIT_TTL = process.env.RATE_LIMIT_TTL || '60';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '1000';

// Cache test settings
process.env.CACHE_TTL = process.env.CACHE_TTL || '300';
process.env.CACHE_ENABLED = process.env.CACHE_ENABLED || 'false'; // Disable cache by default in tests

console.log('🧪 Test environment configured');
console.log(`📊 Database: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
console.log(`🔴 Redis: ${process.env.REDIS_URL ? '✅ Configured' : '❌ Not configured'}`);
console.log(`📧 Email: ${process.env.SMTP_USER ? '✅ Configured' : '❌ Not configured'}`);
console.log(`🤖 AI: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
