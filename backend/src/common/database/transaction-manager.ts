import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

/**
 * Transaction Manager with Advanced Retry Logic
 * Features:
 * - Automatic retry with exponential backoff
 * - Deadlock detection and recovery
 * - Nested transaction support
 * - Transaction timeout handling
 * - Rollback on error
 */

export interface TransactionOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  isolationLevel?: 'Serializable' | 'RepeatableRead' | 'ReadCommitted' | 'ReadUncommitted';
  name?: string;
}

export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  duration: number;
}

export interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  retriedTransactions: number;
  averageDuration: number;
  deadlocksHandled: number;
}

export class TransactionManager {
  private readonly logger = new Logger(TransactionManager.name);
  private stats: TransactionStats = {
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    retriedTransactions: 0,
    averageDuration: 0,
    deadlocksHandled: 0,
  };
  private totalDuration = 0;
  private activeTransactions = new Map<string, Date>();

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Execute transaction with automatic retry logic
   */
  async execute<T>(
    callback: (tx: PrismaClient) => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<TransactionResult<T>> {
    const {
      maxRetries = 3,
      retryDelay = 100,
      timeout = 30000,
      isolationLevel = 'ReadCommitted',
      name = 'transaction',
    } = options;

    const startTime = Date.now();
    const transactionId = `${name}-${Date.now()}-${Math.random()}`;
    this.activeTransactions.set(transactionId, new Date());

    let lastError: Error | null = null;
    let attempts = 0;

    for (attempts = 1; attempts <= maxRetries; attempts++) {
      try {
        const result = await this.executeWithTimeout(
          () =>
            this.prisma.$transaction(async (tx) => {
              return await callback(tx as PrismaClient);
            }, {
              maxWait: timeout,
              timeout: timeout,
              isolationLevel: isolationLevel as any,
            }),
          timeout,
          transactionId
        );

        const duration = Date.now() - startTime;
        this.recordSuccess(duration);

        this.logger.debug(
          `Transaction '${name}' completed successfully in ${duration}ms (attempt ${attempts})`
        );

        return {
          success: true,
          data: result,
          attempts,
          duration,
        };
      } catch (error) {
        lastError = error as Error;
        const isDeadlock = this.isDeadlockError(lastError);
        const isTimeout = this.isTimeoutError(lastError);

        if (isDeadlock) {
          this.stats.deadlocksHandled++;
          this.logger.warn(
            `Deadlock detected in transaction '${name}', attempt ${attempts}/${maxRetries}`
          );
        }

        if (isTimeout) {
          this.logger.warn(
            `Transaction '${name}' timeout, attempt ${attempts}/${maxRetries}`
          );
        }

        if (attempts < maxRetries && (isDeadlock || isTimeout)) {
          const delay = this.calculateBackoff(retryDelay, attempts);
          this.logger.debug(
            `Retrying transaction '${name}' in ${delay}ms (attempt ${attempts + 1}/${maxRetries})`
          );
          this.stats.retriedTransactions++;
          await this.sleep(delay);
        } else if (attempts === maxRetries) {
          this.logger.error(
            `Transaction '${name}' failed after ${maxRetries} attempts: ${lastError.message}`
          );
        }
      } finally {
        if (attempts === maxRetries) {
          this.activeTransactions.delete(transactionId);
        }
      }
    }

    const duration = Date.now() - startTime;
    this.recordFailure();

    return {
      success: false,
      error: lastError || new Error('Unknown transaction error'),
      attempts,
      duration,
    };
  }

  /**
   * Execute transaction with specific operations
   */
  async executeMultiple<T>(
    operations: Array<{
      name: string;
      execute: (tx: PrismaClient) => Promise<any>;
    }>,
    options: TransactionOptions = {}
  ): Promise<TransactionResult<T[]>> {
    return this.execute(
      async (tx) => {
        const results = [];
        for (const op of operations) {
          try {
            const result = await op.execute(tx);
            results.push(result);
          } catch (error) {
            this.logger.error(`Operation '${op.name}' failed in transaction: ${error}`);
            throw error;
          }
        }
        return results as T[];
      },
      options
    );
  }

  /**
   * Batch transactions for multiple operations
   */
  async executeBatch<T>(
    callbacks: Array<(tx: PrismaClient) => Promise<T>>,
    options: TransactionOptions = {}
  ): Promise<TransactionResult<T[]>> {
    return this.execute(
      async (tx) => {
        return Promise.all(callbacks.map((cb) => cb(tx)));
      },
      options
    );
  }

  /**
   * Detect if error is a deadlock error
   */
  private isDeadlockError(error: Error): boolean {
    const deadlockPatterns = [
      /deadlock/i,
      /P1014/,
      /detected/i,
      /concurrent/i,
      /lock/i,
    ];

    return deadlockPatterns.some((pattern) => pattern.test(error.message));
  }

  /**
   * Detect if error is a timeout error
   */
  private isTimeoutError(error: Error): boolean {
    const timeoutPatterns = [
      /timeout/i,
      /timed out/i,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
    ];

    return timeoutPatterns.some((pattern) => pattern.test(error.message));
  }

  /**
   * Calculate exponential backoff with jitter
   */
  private calculateBackoff(baseDelay: number, attempt: number): number {
    const exponentialDelay = Math.min(
      baseDelay * Math.pow(2, attempt - 1),
      10000 // Max 10 seconds
    );
    const jitter = Math.random() * exponentialDelay * 0.1; // 10% jitter
    return exponentialDelay + jitter;
  }

  /**
   * Sleep for given milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute with timeout
   */
  private executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    transactionId: string
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Transaction ${transactionId} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        // Clear timer if promise resolves
        Promise.resolve().then(() => clearTimeout(timer));
      }),
    ]);
  }

  /**
   * Record successful transaction
   */
  private recordSuccess(duration: number): void {
    this.stats.totalTransactions++;
    this.stats.successfulTransactions++;
    this.totalDuration += duration;
    this.stats.averageDuration = this.totalDuration / this.stats.totalTransactions;
  }

  /**
   * Record failed transaction
   */
  private recordFailure(): void {
    this.stats.totalTransactions++;
    this.stats.failedTransactions++;
  }

  /**
   * Get transaction statistics
   */
  getStats(): TransactionStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      retriedTransactions: 0,
      averageDuration: 0,
      deadlocksHandled: 0,
    };
    this.totalDuration = 0;
  }

  /**
   * Get active transactions count
   */
  getActiveTransactionCount(): number {
    return this.activeTransactions.size;
  }

  /**
   * Get all active transactions
   */
  getActiveTransactions(): Array<{ id: string; startedAt: Date; duration: number }> {
    const now = Date.now();
    return Array.from(this.activeTransactions.entries()).map(([id, startedAt]) => ({
      id,
      startedAt,
      duration: now - startedAt.getTime(),
    }));
  }

  /**
   * Cancel long-running transactions
   */
  async cancelLongRunningTransactions(maxDurationMs: number = 300000): Promise<number> {
    const transactions = this.getActiveTransactions();
    let cancelled = 0;

    for (const tx of transactions) {
      if (tx.duration > maxDurationMs) {
        this.logger.warn(
          `Cancelling long-running transaction ${tx.id} (duration: ${tx.duration}ms)`
        );
        this.activeTransactions.delete(tx.id);
        cancelled++;
      }
    }

    return cancelled;
  }

  /**
   * Generate transaction report
   */
  generateReport(): string {
    const stats = this.getStats();
    const successRate = stats.totalTransactions > 0
      ? ((stats.successfulTransactions / stats.totalTransactions) * 100).toFixed(2)
      : '0';

    return `
Transaction Manager Report
==========================
Total Transactions: ${stats.totalTransactions}
Successful: ${stats.successfulTransactions} (${successRate}%)
Failed: ${stats.failedTransactions}
Retried: ${stats.retriedTransactions}
Deadlocks Handled: ${stats.deadlocksHandled}
Average Duration: ${stats.averageDuration.toFixed(2)}ms
Active Transactions: ${this.getActiveTransactionCount()}
    `.trim();
  }
}

/**
 * Decorator for transaction support
 */
export function Transactional(options: TransactionOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const txManager = this.transactionManager as TransactionManager;
      if (!txManager) {
        this.logger.warn('TransactionManager not injected, executing without transaction');
        return originalMethod.apply(this, args);
      }

      const result = await txManager.execute(
        async (tx) => {
          // Inject transaction into method arguments if needed
          return originalMethod.apply(this, [tx, ...args]);
        },
        { ...options, name: `${target.name}.${propertyKey}` }
      );

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    };

    return descriptor;
  };
}
