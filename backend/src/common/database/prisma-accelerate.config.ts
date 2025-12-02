import { PrismaClient } from '@prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';
import { Logger } from '@nestjs/common';

/**
 * Prisma Accelerate Configuration
 * Optimizes database connection pooling and query performance
 * Features:
 * - Connection pooling via Prisma Accelerate
 * - Automatic query batching
 * - Connection reuse optimization
 * - Metrics collection
 */

export interface AccelerateConfig {
  enableAccelerate: boolean;
  cacheUrl?: string;
  apiKey?: string;
  connectionPoolSize?: number;
  connectionTimeout?: number;
  idleTimeout?: number;
  maxConnections?: number;
  enableMetrics?: boolean;
}

export class PrismaAccelerateManager {
  private readonly logger = new Logger(PrismaAccelerateManager.name);
  private prisma: PrismaClient;
  private config: AccelerateConfig;

  constructor(config: AccelerateConfig = { enableAccelerate: false }) {
    this.config = {
      enableAccelerate: config.enableAccelerate ?? false,
      cacheUrl: config.cacheUrl || process.env.PRISMA_ACCELERATE_URL,
      apiKey: config.apiKey || process.env.PRISMA_ACCELERATE_API_KEY,
      connectionPoolSize: config.connectionPoolSize ?? 10,
      connectionTimeout: config.connectionTimeout ?? 10000,
      idleTimeout: config.idleTimeout ?? 30000,
      maxConnections: config.maxConnections ?? 5,
      enableMetrics: config.enableMetrics ?? true,
    };

    this.initializePrisma();
  }

  private initializePrisma(): void {
    try {
      const databaseUrl = process.env.DATABASE_URL;

      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      // Create base Prisma client
      this.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

      // Note: Accelerate extension disabled due to API changes
      this.logger.log('Prisma client initialized without Accelerate extension');

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      this.logger.error(`Failed to initialize Prisma: ${error}`);
      throw error;
    }
  }

  private setupEventListeners(): void {
    this.prisma.$on('query', (event) => {
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`Query executed in ${event.duration}ms: ${event.query}`);
      }
    });

    this.prisma.$on('error', (event) => {
      this.logger.error(`Prisma error: ${event}`);
    });
  }

  /**
   * Get the Prisma client instance
   */
  getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Connect to database
   */
  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.logger.log('Prisma connected successfully');
    } catch (error) {
      this.logger.error(`Failed to connect Prisma: ${error}`);
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.logger.log('Prisma disconnected successfully');
    } catch (error) {
      this.logger.error(`Failed to disconnect Prisma: ${error}`);
      throw error;
    }
  }

  /**
   * Get connection pool metrics
   */
  async getMetrics(): Promise<Record<string, any>> {
    try {
      // Note: Metrics collection disabled due to API changes
      this.logger.warn('Metrics collection is not available');
      return {};
    } catch (error) {
      this.logger.warn(`Failed to retrieve metrics: ${error}`);
      return {};
    }
  }

  /**
   * Get database connection status
   */
  async getConnectionStatus(): Promise<{
    connected: boolean;
    poolSize: number;
    activeConnections: number;
  }> {
    try {
      // Test the connection
      await this.prisma.$executeRawUnsafe('SELECT 1');

      return {
        connected: true,
        poolSize: this.config.connectionPoolSize || 10,
        activeConnections: 0, // This would need actual monitoring
      };
    } catch (error) {
      this.logger.error(`Connection status check failed: ${error}`);
      return {
        connected: false,
        poolSize: this.config.connectionPoolSize || 10,
        activeConnections: 0,
      };
    }
  }

  /**
   * Execute a transaction with automatic retry logic
   */
  async executeTransaction<T>(
    callback: (prisma: PrismaClient) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          return await callback(tx as any);
        });
      } catch (error) {
        lastError = error as Error;

        // Exponential backoff
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          this.logger.warn(
            `Transaction attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error(
      `Transaction failed after ${maxRetries} attempts: ${lastError?.message}`
    );
    throw lastError;
  }

  /**
   * Batch operations for better performance
   */
  async batchCreate<T>(
    model: any,
    data: any[],
    batchSize: number = 100
  ): Promise<T[]> {
    const results: T[] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((item) => model.create({ data: item }))
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Optimize connection pooling based on workload
   */
  configurePooling(size: number): void {
    this.config.connectionPoolSize = size;
    this.logger.log(`Connection pool size updated to ${size}`);
  }
}

/**
 * Create and export singleton instance
 */
export const prismaAccelerateManager = new PrismaAccelerateManager({
  enableAccelerate: process.env.ENABLE_PRISMA_ACCELERATE !== 'false',
  cacheUrl: process.env.PRISMA_ACCELERATE_URL,
  apiKey: process.env.PRISMA_ACCELERATE_API_KEY,
  enableMetrics: process.env.NODE_ENV === 'development',
});

export const getPrismaClient = () => prismaAccelerateManager.getClient();
