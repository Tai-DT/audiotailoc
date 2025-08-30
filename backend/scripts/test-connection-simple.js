#!/usr/bin/env node

/**
 * Simple Database Connection Test
 * Tests basic connectivity to Aiven PostgreSQL
 */

const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Simple Database Connection Test');
  console.log('==================================');

  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }

  console.log('📡 Database URL:', databaseUrl.replace(/:[^:]+@/, ':****@')); // Hide password
  console.log('');

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // For testing - not recommended for production
    }
  });

  try {
    console.log('⏳ Connecting to database...');
    await client.connect();
    console.log('✅ Connection successful!');
    console.log('');

    // Test simple query
    console.log('🧪 Testing query execution...');
    const result = await client.query('SELECT version() as version');
    console.log('✅ Query successful!');
    console.log('📊 PostgreSQL Version:', result.rows[0].version.split(' ')[1]);
    console.log('');

    // Test database info
    const dbInfo = await client.query('SELECT current_database(), current_user, inet_client_addr()');
    console.log('📋 Database Info:');
    console.log('   - Database:', dbInfo.rows[0].current_database);
    console.log('   - User:', dbInfo.rows[0].current_user);
    console.log('   - Client IP:', dbInfo.rows[0].inet_client_addr || 'Not available');
    console.log('');

    console.log('🎉 All tests passed! Database connection is working.');

  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('');

    // Provide specific guidance based on error type
    if (error.code === 'ENOTFOUND') {
      console.log('🔧 Possible solutions:');
      console.log('1. Check if Aiven database is running');
      console.log('2. Verify hostname is correct');
      console.log('3. Enable public access in Aiven dashboard');
      console.log('4. Check network connectivity');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Possible solutions:');
      console.log('1. Check if port 26566 is open');
      console.log('2. Verify firewall settings');
      console.log('3. Check Aiven service status');
    } else if (error.message.includes('authentication failed')) {
      console.log('🔧 Possible solutions:');
      console.log('1. Verify username/password');
      console.log('2. Check user permissions in Aiven');
      console.log('3. Reset password if needed');
    }

    process.exit(1);
  } finally {
    await client.end();
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
testConnection();