import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Listen for Prisma errors to handle connection issues
    (this as any).$on('error', (e: any) => {
      this.logger.error(`Prisma error: ${e.message}`);
      this.handleConnectionError();
    });

    // Extend with Accelerate for better performance
    // Only use Accelerate in production or when explicitly enabled
    const useAccelerate =
      process.env.USE_PRISMA_ACCELERATE === 'true' || process.env.NODE_ENV === 'production';
    if (useAccelerate) {
      Object.assign(this, this.$extends(withAccelerate()));
    }

    // Optional startup logs (disabled by default)
    const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
    const logDbUrl = (process.env.LOG_DB_URL || '').toLowerCase() === 'true';
    if (logPrisma && logDbUrl) {
      const url = process.env.DATABASE_URL || '';
      const masked = url.replace(/:(.*?)@/, ':***@');
      console.log('[Prisma] DATABASE_URL =', masked);
    }
  }

  /**
   * Handle connection errors with automatic reconnection
   */
  private async handleConnectionError() {
    if (this.reconnectTimer) return; // Already reconnecting

    this.isConnected = false;
    this.logger.warn('Database connection lost, attempting to reconnect...');

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.$disconnect();
        await this.$connect();
        this.isConnected = true;
        this.logger.log('Database reconnected successfully');
      } catch (error) {
        this.logger.error('Failed to reconnect to database:', error);
      } finally {
        this.reconnectTimer = null;
      }
    }, 1000);
  }

  /**
   * Execute a query with retry logic for connection errors
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        const isConnectionError =
          error.message?.includes('Closed') ||
          error.message?.includes('Connection') ||
          error.code === 'P1017' ||
          error.code === 'P1001' ||
          error.code === 'P1002';

        if (isConnectionError && attempt < maxRetries) {
          this.logger.warn(
            `Database operation failed (attempt ${attempt}/${maxRetries}), retrying...`,
          );
          await this.handleConnectionError();
          await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }

  // Method to get extended client with Accelerate
  getAcceleratedClient() {
    return this.$extends(withAccelerate());
  }

  async onModuleInit() {
    // Allow skipping DB connect on startup for offline/dev scenarios
    if (process.env.ALLOW_START_WITHOUT_DB === 'true') {
      const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
      if (logPrisma)
        console.warn('[Prisma] Skipping DB connect on startup (ALLOW_START_WITHOUT_DB=true)');
      return;
    }

    // Add retry logic to handle cases where DB isn't ready yet (dev setups)
    const maxAttempts = Number(process.env.DB_CONNECT_MAX_ATTEMPTS || 20);
    const baseDelayMs = Number(process.env.DB_CONNECT_BASE_DELAY_MS || 500);

    let attempt = 0;
    // Simple backoff with jitter
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
        if (logPrisma)
          console.warn(
            `[Prisma] DB connection attempt ${attempt}/${maxAttempts} failed: ${message}`,
          );
        if (isLast) {
          // As a last resort, optionally allow app to start without DB
          if (process.env.ALLOW_START_WITHOUT_DB === 'fallback') {
            if (logPrisma)
              console.warn(
                '[Prisma] Failed to connect after max attempts; continuing without DB (fallback mode)',
              );
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
