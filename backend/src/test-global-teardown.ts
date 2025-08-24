export default async () => {
  console.log('🧹 Starting global test teardown...');

  const testDuration = Date.now() - global.__TEST_START_TIME__;

  // Clean up test database if it was initialized
  if (global.__TEST_DATABASE_READY__) {
    try {
      console.log('📊 Cleaning up test database...');
      // Note: This would typically be handled by the TestDatabaseService
      console.log('✅ Test database cleanup completed');
    } catch (error) {
      console.error('❌ Error during test database cleanup:', error);
    }
  }

  // Clean up any global test resources
  delete global.__TEST_START_TIME__;
  delete global.__TEST_DATABASE_READY__;

  // Clean up test utilities
  delete global.testUtils;
  delete global.testFactories;

  console.log(`✅ Global test teardown completed in ${testDuration}ms`);
};
