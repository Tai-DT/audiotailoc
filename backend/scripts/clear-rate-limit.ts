#!/usr/bin/env ts-node

/**
 * Clear Rate Limit Cache
 * Run this script to clear all rate limiting counters
 * Usage: npm run clear-rate-limit or ts-node scripts/clear-rate-limit.ts
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

async function clearRateLimitCache() {
  console.log('🧹 Clearing rate limit cache...\n');

  try {
    // If using Redis for caching
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
      console.log('Attempting to connect to Redis...');
      const redisClient = createClient({ url: redisUrl });

      await redisClient.connect();

      // Delete all rate_limit:* keys
      const keys = await redisClient.keys('rate_limit:*');

      if (keys.length > 0) {
        console.log(`Found ${keys.length} rate limit keys`);
        await redisClient.del(...keys);
        console.log('✅ Redis rate limit cache cleared successfully');
      } else {
        console.log('ℹ️  No rate limit keys found in Redis');
      }

      await redisClient.quit();
    } catch (redisError) {
      console.log('⚠️  Redis not available or not configured');
      console.log('   Rate limits will reset automatically after the time window expires');
    }

    // If using in-memory cache, we need to restart the application
    console.log('\n💡 Note: If using in-memory cache, please restart the backend server');
    console.log('   Run: npm run start:dev (or restart your current process)\n');

    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error clearing rate limit cache:', error);
    process.exit(1);
  }
}

// Run the script
clearRateLimitCache()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
