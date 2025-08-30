#!/usr/bin/env node

/**
 * PostgreSQL Connection Test Script
 * Tests the basic connection to Aiven PostgreSQL database
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function testPGConnection() {
  console.log('🔍 Testing Aiven PostgreSQL Connection...\n');

  // Database configuration
  const dbConfig = {
    host: 'pg-audio-tai-loc-kadev.c.aivencloud.com',
    port: 26566,
    database: 'defaultdb',
    user: 'avnadmin',
    password: 'AVNS_J1t4lXQgYA1bGfQZgh5',
    ssl: {
      rejectUnauthorized: false, // For testing purposes
      // ca: fs.readFileSync(path.join(__dirname, '../backend/ca.pem')).toString()
    }
  };

  const client = new Client(dbConfig);

  try {
    console.log('📡 Connecting to database...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log('');

    await client.connect();
    console.log('✅ Database connection successful!\n');

    // Test simple query
    console.log('🧪 Running test queries...');

    // Get version
    const versionResult = await client.query('SELECT version()');
    console.log('✅ Version query successful!');
    console.log(`   PostgreSQL Version: ${versionResult.rows[0].version.split(' ')[1]}\n`);

    // Get current database info
    const dbResult = await client.query('SELECT current_database(), current_user, inet_client_addr()');
    console.log('✅ Database info query successful!');
    console.log(`   Current Database: ${dbResult.rows[0].current_database}`);
    console.log(`   Current User: ${dbResult.rows[0].current_user}`);
    console.log(`   Client Address: ${dbResult.rows[0].inet_client_addr || 'Not available'}\n`);

    // List existing tables
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Existing tables:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('   No tables found. Database is empty.');
    }
    console.log('');

    console.log('🎉 PostgreSQL connection test completed successfully!');
    console.log('✅ All tests passed!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Run: npm run prisma:generate');
    console.log('2. Run: npm run db:push (to create tables)');
    console.log('3. Run: npm run db:seed (to add sample data)');

  } catch (error) {
    console.error('\n❌ PostgreSQL connection test failed!');
    console.error('Error details:');
    console.error(`   - Message: ${error.message}`);

    if (error.code) {
      console.error(`   - Code: ${error.code}`);
    }

    if (error.severity) {
      console.error(`   - Severity: ${error.severity}`);
    }

    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if Aiven database is running');
    console.log('2. Verify database credentials in script');
    console.log('3. Check network connectivity to Aiven');
    console.log('4. Ensure SSL mode is properly configured');
    console.log('5. Check Aiven firewall settings');
    console.log('6. Verify database is publicly accessible');

    console.log('\n💡 Common Solutions:');
    console.log('- Enable public access in Aiven dashboard');
    console.log('- Check connection limits in Aiven');
    console.log('- Verify SSL certificate validity');
    console.log('- Test with different SSL configurations');

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
testPGConnection().catch((error) => {
  console.error('Test script failed:', error);
  process.exit(1);
});