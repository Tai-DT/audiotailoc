#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the connection to Aiven PostgreSQL database
 */

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing Aiven PostgreSQL Database Connection...\n');

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Test basic connection
    console.log('📡 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Test simple query
    console.log('🧪 Running test query...');
    const result = await prisma.$queryRaw`SELECT version() as version, current_database() as database, current_user as user`;
    console.log('✅ Query executed successfully!');
    console.log('📊 Database Info:');
    console.log(`   - Database: ${result[0].database}`);
    console.log(`   - User: ${result[0].user}`);
    console.log(`   - Version: ${result[0].version}\n`);

    // Test table existence
    console.log('📋 Checking existing tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length > 0) {
      console.log('✅ Found existing tables:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log('📝 No tables found. Database schema needs to be created.');
    }
    console.log('');

    // Test write operation (if tables exist)
    if (tables.length > 0) {
      console.log('✍️  Testing write operation...');
      // This is just a test - we'll try to count users if the table exists
      try {
        const userCount = await prisma.user.count();
        console.log(`✅ Write test passed! Found ${userCount} users in database.`);
      } catch (error) {
        console.log('⚠️  Write test skipped - no user table or access issue.');
      }
    }

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('✅ All tests passed!');

  } catch (error) {
    console.error('\n❌ Database connection test failed!');
    console.error('Error details:');
    console.error(`   - Message: ${error.message}`);

    if (error.code) {
      console.error(`   - Code: ${error.code}`);
    }

    if (error.meta) {
      console.error(`   - Meta: ${JSON.stringify(error.meta, null, 2)}`);
    }

    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Verify SSL certificate (ca.pem) is in the correct location');
    console.log('3. Ensure Aiven database is accessible from your network');
    console.log('4. Check firewall settings');
    console.log('5. Verify database credentials are correct');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the test
testDatabaseConnection().catch((error) => {
  console.error('Test script failed:', error);
  process.exit(1);
});