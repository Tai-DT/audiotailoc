import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error'],
    });

    // Extend with Accelerate for better performance
    Object.assign(this, this.$extends(withAccelerate()));

    // Optional startup logs (disabled by default)
    const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
    const logDbUrl = (process.env.LOG_DB_URL || '').toLowerCase() === 'true';
    if (logPrisma && logDbUrl) {
      const url = process.env.DATABASE_URL || '';
      const masked = url.replace(/:(.*?)@/, ':***@');
      console.log('[Prisma] DATABASE_URL =', masked);
    }
  }

  // Method to get extended client with Accelerate
  getAcceleratedClient() {
    return this.$extends(withAccelerate());
  }

  async onModuleInit() {
    // Allow skipping DB connect on startup for offline/dev scenarios
    if (process.env.ALLOW_START_WITHOUT_DB === 'true') {
      const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
      if (logPrisma) console.warn('[Prisma] Skipping DB connect on startup (ALLOW_START_WITHOUT_DB=true)');
      return;
    }

    // Add retry logic to handle cases where DB isn't ready yet (dev setups)
    const maxAttempts = Number(process.env.DB_CONNECT_MAX_ATTEMPTS || 20);
    const baseDelayMs = Number(process.env.DB_CONNECT_BASE_DELAY_MS || 500);

    let attempt = 0;
    // Simple backoff with jitter
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    while (true) {
      try {
        attempt += 1;
        await this.$connect();
        const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
        if (logPrisma) console.log(`[Prisma] Connected to database after ${attempt} attempt(s)`);
        break;
      } catch (err: any) {
        const isLast = attempt >= maxAttempts;
        const message = err?.message || String(err);
        const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
        if (logPrisma) console.warn(`[Prisma] DB connection attempt ${attempt}/${maxAttempts} failed: ${message}`);
        if (isLast) {
          // As a last resort, optionally allow app to start without DB
          if (process.env.ALLOW_START_WITHOUT_DB === 'fallback') {
            if (logPrisma) console.warn('[Prisma] Failed to connect after max attempts; continuing without DB (fallback mode)');
            return;
          }
          throw err;
        }
        const jitter = Math.floor(Math.random() * 250);
        const delay = baseDelayMs * Math.min(attempt, 10) + jitter; // bounded linear backoff with jitter
        await sleep(delay);
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
