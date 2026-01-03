import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempt = 0;
  private lastConnectionErrorLogAt = 0;

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
      if (this.isLikelyConnectionError(e)) {
        const now = Date.now();
        // Throttle noisy connection-close logs (e.g. managed DB idle timeouts)
        if (now - this.lastConnectionErrorLogAt > 5000) {
          this.lastConnectionErrorLogAt = now;
          this.logger.warn(`Prisma connection error: ${e.message}`);
        }
        void this.handleConnectionError();
        return;
      }

      this.logger.error(`Prisma error: ${e.message}`, e?.stack);
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

    const baseDelayMs = Number(process.env.DB_RECONNECT_BASE_DELAY_MS || 1000);
    const maxDelayMs = Number(process.env.DB_RECONNECT_MAX_DELAY_MS || 30000);
    const exponent = Math.min(this.reconnectAttempt, 10);
    const jitter = Math.floor(Math.random() * 250);
    const delayMs = Math.min(maxDelayMs, baseDelayMs * 2 ** exponent) + jitter;
    const attemptNo = this.reconnectAttempt + 1;
    this.reconnectAttempt = Math.min(this.reconnectAttempt + 1, 20);

    this.logger.warn(`Database connection lost, reconnecting in ${delayMs}ms (attempt ${attemptNo})...`);

    this.reconnectTimer = setTimeout(async () => {
      let shouldRetry = false;

      try {
        // Avoid forcing a disconnect; just attempt to reconnect.
        await this.$connect();
        this.isConnected = true;
        this.reconnectAttempt = 0;
        this.logger.log('Database reconnected successfully');
      } catch (error: any) {
        shouldRetry = true;
        this.logger.error('Failed to reconnect to database:', error?.stack ?? String(error));
      } finally {
        this.reconnectTimer = null;
      }

      if (shouldRetry) {
        void this.handleConnectionError();
      }
    }, delayMs);
  }

  private isLikelyConnectionError(error: any): boolean {
    const message = String(error?.message || '').toLowerCase();
    const code = error?.code;

    if (code === 'P1017' || code === 'P1001' || code === 'P1002') return true;

    return (
      message.includes('error in postgresql connection') ||
      message.includes('connection') &&
        (message.includes('closed') ||
          message.includes('terminated') ||
          message.includes('reset') ||
          message.includes('econnreset') ||
          message.includes('econnrefused') ||
          message.includes('timeout'))
    );
  }

  /**
   * Execute a query with retry logic for connection errors
   */
  async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        const isConnectionError = this.isLikelyConnectionError(error);

        if (isConnectionError && attempt < maxRetries) {
          this.logger.warn(
            `Database operation failed (attempt ${attempt}/${maxRetries}), retrying...`,
          );
          await this.handleConnectionError();
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
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
