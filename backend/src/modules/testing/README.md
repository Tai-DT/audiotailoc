# Comprehensive Testing Framework

Advanced testing framework with unit tests, integration tests, E2E tests, and comprehensive test utilities for Audio Tài Lộc backend.

## Features

### ✅ **Implemented:**
- **Unit Tests** - Service and controller testing with mocks
- **Integration Tests** - Database and external service testing
- **E2E Tests** - Full API endpoint testing
- **Test Database** - Isolated test data management
- **Mock Services** - External service simulation
- **Test Helpers** - JWT tokens, test data generation
- **Performance Testing** - Load and performance testing utilities
- **Coverage Reporting** - Detailed test coverage analysis

### 📋 **Test Types Supported:**

1. **Unit Tests** - Individual functions and classes
2. **Integration Tests** - Service interactions and database operations
3. **E2E Tests** - Complete API workflows
4. **Performance Tests** - Load and stress testing
5. **Contract Tests** - API contract validation
6. **Security Tests** - Security vulnerability testing

## Quick Start

### 1. **Run All Tests**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- users.service.spec.ts

# Run E2E tests only
npm run test:e2e
```

### 2. **Test Structure**
```bash
src/
├── modules/
│   ├── users/
│   │   ├── users.service.spec.ts      # Unit tests
│   │   └── users.controller.spec.ts   # Controller tests
│   └── testing/                      # Test infrastructure
│       ├── test-database.service.ts  # Database test utilities
│       ├── test-helpers.service.ts   # Test data & tokens
│       ├── mock-services.service.ts  # External service mocks
│       └── README.md
test/
├── auth.e2e-spec.ts                  # E2E tests
├── products.e2e-spec.ts             # E2E tests
└── performance/                      # Performance tests
```

### 3. **Basic Unit Test**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TestDatabaseService } from '../testing/test-database.service';

describe('UsersService', () => {
  let service: UsersService;
  let testDatabase: TestDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, TestDatabaseService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    testDatabase = module.get<TestDatabaseService>(TestDatabaseService);
  });

  afterEach(async () => {
    await testDatabase.cleanupTestData();
  });

  it('should create a user', async () => {
    const userData = global.testFactories.createUserData();
    const result = await service.createUser(userData);

    expect(result.email).toBe(userData.email);
  });
});
```

## Test Database Management

### Creating Test Data
```typescript
// Create individual entities
const user = await testDatabase.createTestUser({
  email: 'test@example.com',
  name: 'Test User'
});

const product = await testDatabase.createTestProduct({
  name: 'Test Product',
  price: 100000,
  categoryId: user.id
});

// Create complete test dataset
const { userIds, productIds } = await testDatabase.createTestDataset({
  users: 3,
  categories: 2,
  products: 5,
  orders: 2
});
```

### Database Health Checks
```typescript
// Check if database is available
const isHealthy = await testDatabase.checkDatabaseHealth();

// Get test data counts
const counts = await testDatabase.getTestDataCounts();
console.log(`Users: ${counts.users}, Products: ${counts.products}`);
```

## Mock Services

### External Service Mocking
```typescript
// Enable mock services
mockServices.setMockEnabled(true);

// Mock payment gateway
const paymentResult = await mockServices.mockPaymentGateway('create_payment_url', {
  amount: 100000,
  orderId: 'order_123'
});

// Custom mock response
mockServices.setMockResponse('payment_gateway', 'verify_payment', {
  success: true,
  status: 'completed'
});
```

### Available Mock Services
- **Payment Gateway** - VNPAY, MOMO simulation
- **Email Service** - SMTP simulation
- **SMS Service** - SMS gateway simulation
- **File Storage** - Cloudinary/MinIO simulation
- **Geolocation** - Google Maps simulation
- **Notification** - Push notification simulation
- **Analytics** - Analytics service simulation

## Test Helpers

### JWT Token Generation
```typescript
// Generate access token
const accessToken = await testHelpers.generateTestToken(userId, {
  role: 'ADMIN'
});

// Generate refresh token
const refreshToken = await testHelpers.generateTestRefreshToken(userId);
```

### Test Data Generation
```typescript
// Generate test file
const testFile = testHelpers.generateTestFileData({
  name: 'test.jpg',
  size: 1024,
  type: 'image/jpeg'
});

// Generate test image
const testImage = testHelpers.generateTestImageData(100, 100);

// Generate test email
const testEmail = testHelpers.generateTestEmailData({
  to: 'user@example.com',
  subject: 'Test Email'
});
```

## E2E Testing

### API Endpoint Testing
```typescript
describe('/api/v1/auth/register (POST)', () => {
  it('should register a new user successfully', async () => {
    const registerData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
      phone: '0123456789',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(registerData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(registerData.email);
  });
});
```

### Authentication Testing
```typescript
describe('Authentication Flow', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Register and get token
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(testUserData)
      .expect(201);

    accessToken = response.body.data.accessToken;
  });

  it('should access protected endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.data.user).toBeDefined();
  });
});
```

## Performance Testing

### Load Testing
```typescript
import { performanceTest } from './test/performance/load-test';

describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const results = await performanceTest({
      url: '/api/v1/products',
      method: 'GET',
      concurrentUsers: 100,
      duration: 60, // seconds
    });

    expect(results.averageResponseTime).toBeLessThan(1000);
    expect(results.errorRate).toBeLessThan(0.05);
  });
});
```

### Memory Leak Testing
```typescript
describe('Memory Leak Tests', () => {
  it('should not have memory leaks', async () => {
    const initialMemory = process.memoryUsage();

    // Perform operations that might cause memory leaks
    for (let i = 0; i < 1000; i++) {
      await service.createUser(testUserData);
    }

    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
});
```

## Test Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.config.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globalSetup: '<rootDir>/src/test-global-setup.ts',
  globalTeardown: '<rootDir>/src/test-global-teardown.ts',
};
```

### Environment Variables
```env
# Test Configuration
NODE_ENV=test
TESTING_MOCK_SERVICES=true

# Database
DATABASE_URL=postgresql://test:test@localhost:5432/audiotailoc_test

# Redis
REDIS_URL=redis://localhost:6379/1

# JWT
JWT_ACCESS_SECRET=test-access-secret
JWT_REFRESH_SECRET=test-refresh-secret

# External Services
VNPAY_TMN_CODE=test_tmn_code
```

## Test Categories

### 1. **Unit Tests**
- Test individual functions and classes
- Mock all external dependencies
- Fast execution, isolated

### 2. **Integration Tests**
- Test service interactions
- Use real database with test data
- Test external service integrations

### 3. **E2E Tests**
- Test complete user workflows
- Full API request/response cycle
- Authentication and authorization

### 4. **Performance Tests**
- Load testing with concurrent users
- Memory leak detection
- Response time validation

### 5. **Security Tests**
- SQL injection prevention
- XSS attack prevention
- Authentication bypass attempts

## Best Practices

### Test Organization
```typescript
// Group tests by functionality
describe('UsersService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw error for duplicate email', () => {});
    it('should validate password strength', () => {});
  });

  describe('findUserByEmail', () => {
    it('should find existing user', () => {});
    it('should return null for non-existent user', () => {});
  });
});
```

### Test Data Management
```typescript
// Use beforeEach/afterEach for data setup
beforeEach(async () => {
  await testDatabase.createTestDataset();
});

afterEach(async () => {
  await testDatabase.cleanupTestData();
});

// Use beforeAll/afterAll for expensive setup
beforeAll(async () => {
  await testDatabase.initializeTestDatabase();
});

afterAll(async () => {
  await testDatabase.resetDatabase();
});
```

### Mocking Strategies
```typescript
// Mock external services
const mockPaymentService = {
  createPayment: jest.fn().mockResolvedValue({
    success: true,
    transactionId: 'mock_txn_123'
  })
};

// Mock database calls
jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);
```

### Assertion Best Practices
```typescript
// Use specific assertions
expect(result).toMatchObject({
  id: expect.any(String),
  email: 'test@example.com',
  createdAt: expect.any(Date),
});

// Test error cases
await expect(service.createUser(invalidData))
  .rejects.toThrow(BadRequestException);

// Test response structure
expect(response.body).toHaveProperty('success', true);
expect(response.body.data).toHaveProperty('user');
```

## Coverage Analysis

### Coverage Reports
```bash
# Generate coverage report
npm run test:cov

# View HTML report
open coverage/lcov-report/index.html
```

### Coverage Goals
- **Statements**: 80% - Code executed during tests
- **Branches**: 70% - Conditional logic coverage
- **Functions**: 75% - Function execution coverage
- **Lines**: 80% - Individual line coverage

### Improving Coverage
```typescript
// Add tests for uncovered code
it('should handle edge case X', () => {
  // Test edge case
});

// Add tests for error conditions
it('should throw error when Y happens', () => {
  // Test error condition
});
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: audiotaloc_test
        ports:
          - 5432:5432
      redis:
        image: redis:6-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## Debugging Tests

### Common Issues
1. **Database connection errors**
   - Check DATABASE_URL
   - Ensure PostgreSQL is running
   - Verify test database exists

2. **Redis connection errors**
   - Check REDIS_URL
   - Ensure Redis is running
   - Verify Redis configuration

3. **Mock service issues**
   - Check TESTING_MOCK_SERVICES=true
   - Verify mock responses are set
   - Check mock service configuration

4. **Timeout errors**
   - Increase testTimeout in jest.config.js
   - Check for infinite loops
   - Verify external service availability

### Debugging Tools
```typescript
// Add debug logging
console.log('Debug info:', debugData);

// Use Jest debug mode
npm test -- --verbose

// Run single test with debug
npm test -- --testNamePattern="should create user" --verbose
```

## Performance Optimization

### Test Performance Tips
1. **Use beforeAll/afterAll** for expensive setup
2. **Mock external services** instead of calling real APIs
3. **Use test database** instead of production database
4. **Limit test data size** to minimum required
5. **Use parallel execution** when tests don't interfere

### Performance Monitoring
```typescript
// Measure test execution time
const startTime = Date.now();
// Test code
const duration = Date.now() - startTime;
expect(duration).toBeLessThan(100); // Less than 100ms
```

This comprehensive testing framework provides enterprise-grade testing capabilities with extensive test utilities, mock services, and performance testing tools to ensure the Audio Tài Lộc backend maintains high quality and reliability.
