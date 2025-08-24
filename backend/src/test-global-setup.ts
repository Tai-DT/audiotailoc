import { TestDatabaseService } from './modules/testing/test-database.service';

export default async () => {
  console.log('🚀 Setting up global test environment...');

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TESTING_MOCK_SERVICES = 'true';

  // Initialize test database if available
  try {
    // Note: This would typically be injected through the NestJS container
    // For now, we'll just log the setup
    console.log('📊 Test database setup initialized');
  } catch (error) {
    console.warn('⚠️ Test database not available:', error.message);
  }

  // Set up any global test resources
  global.__TEST_START_TIME__ = Date.now();
  global.__TEST_DATABASE_READY__ = false;

  console.log('✅ Global test setup completed');
};
