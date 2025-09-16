// Jest setup file for timeout configurations
import { jest } from '@jest/globals';

// Global test timeouts for different test types
const TEST_TIMEOUTS = {
  UNIT: 5000,        // 5 seconds for unit tests
  INTEGRATION: 15000, // 15 seconds for integration tests
  E2E: 30000,        // 30 seconds for e2e tests
  PERFORMANCE: 60000, // 60 seconds for performance tests
  SECURITY: 45000,   // 45 seconds for security tests
  AUTH: 20000,       // 20 seconds for auth tests
  DEFAULT: 10000,    // 10 seconds default
};

// Set default timeout
jest.setTimeout(TEST_TIMEOUTS.DEFAULT);

// Configure Jest globals for different test types
global.TEST_TIMEOUTS = TEST_TIMEOUTS;

// Setup for database connections and cleanup
beforeAll(async () => {
  // Increase timeout for setup
  jest.setTimeout(TEST_TIMEOUTS.INTEGRATION);
});

afterAll(async () => {
  // Cleanup timeout
  jest.setTimeout(TEST_TIMEOUTS.UNIT);
});

// Setup for each test file
beforeEach(() => {
  // Reset timeout to default for each test
  jest.setTimeout(TEST_TIMEOUTS.DEFAULT);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});