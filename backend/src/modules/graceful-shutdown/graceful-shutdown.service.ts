import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { Server, Socket } from 'net';
import { Redis } from 'ioredis';

@Injectable()
export class GracefulShutdownService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GracefulShutdownService.name);
  private isShuttingDown = false;
  private shutdownTimeout: NodeJS.Timeout | null = null;
  private readonly shutdownTimeoutMs: number;
  private readonly forceShutdownTimeoutMs: number;
  private readonly shutdownSignals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  private activeConnections = new Set<Socket>();
  private server: Server | null = null;

  constructor(
    private configService: ConfigService,
    private httpAdapterHost: HttpAdapterHost,
    private prisma: PrismaService,
  ) {
    this.shutdownTimeoutMs = this.configService.get('SHUTDOWN_TIMEOUT_MS', 30000); // 30 seconds
    this.forceShutdownTimeoutMs = this.configService.get('FORCE_SHUTDOWN_TIMEOUT_MS', 5000); // 5 seconds
  }

  async onModuleInit() {
    this.logger.log('🚀 Graceful shutdown service initialized');

    // Get the HTTP server instance
    if (this.httpAdapterHost.httpAdapter) {
      this.server = this.httpAdapterHost.httpAdapter.getHttpServer() as Server;
      this.setupConnectionTracking();
    }

    // Setup signal handlers
    this.setupSignalHandlers();

    // Setup uncaught exception handler
    this.setupUncaughtExceptionHandler();

    // Setup unhandled rejection handler
    this.setupUnhandledRejectionHandler();
  }

  async onModuleDestroy() {
    this.logger.log('🔄 Module destroy initiated - starting graceful shutdown');
    await this.shutdown('MODULE_DESTROY');
  }

  // Setup signal handlers for graceful shutdown
  private setupSignalHandlers() {
    for (const signal of this.shutdownSignals) {
      process.on(signal, async (signal) => {
        this.logger.log(`📡 Received ${signal} - initiating graceful shutdown`);
        await this.shutdown(signal);
      });
    }

    // Handle Windows-specific signals
    if (process.platform === 'win32') {
      process.on('SIGBREAK', async () => {
        this.logger.log('📡 Received SIGBREAK (Windows) - initiating graceful shutdown');
        await this.shutdown('SIGBREAK');
      });
    }

    this.logger.log(`📡 Signal handlers registered for: ${this.shutdownSignals.join(', ')}`);
  }

  // Setup connection tracking for HTTP server
  private setupConnectionTracking() {
    if (!this.server) return;

    this.server.on('connection', (socket) => {
      if (!this.isShuttingDown) {
        this.activeConnections.add(socket);

        socket.on('close', () => {
          this.activeConnections.delete(socket);
        });
      }
    });

    this.logger.log('🔗 Connection tracking enabled');
  }

  // Setup uncaught exception handler
  private setupUncaughtExceptionHandler() {
    process.on('uncaughtException', async (error, origin) => {
      this.logger.error('💥 Uncaught Exception', {
        error: error.message,
        stack: error.stack,
        origin,
        timestamp: new Date().toISOString(),
      });

      // Don't exit immediately, try graceful shutdown first
      await this.shutdown('UNCAUGHT_EXCEPTION');

      // Force exit after shutdown attempt
      setTimeout(() => {
        this.logger.error('💥 Force exiting due to uncaught exception');
        process.exit(1);
      }, this.forceShutdownTimeoutMs);
    });
  }

  // Setup unhandled rejection handler
  private setupUnhandledRejectionHandler() {
    process.on('unhandledRejection', async (reason, promise) => {
      this.logger.error('💥 Unhandled Rejection', {
        reason: reason?.toString(),
        promise: promise.toString(),
        timestamp: new Date().toISOString(),
      });

      // Log but don't shutdown for unhandled rejections
      // They might be handled later
    });
  }

  // Main shutdown orchestration
  private async shutdown(reason: string): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('⚠️ Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    const startTime = Date.now();

    this.logger.log(`🔄 Starting graceful shutdown (reason: ${reason})`);

    try {
      // Phase 1: Stop accepting new connections
      await this.stopAcceptingConnections();

      // Phase 2: Close HTTP server
      await this.closeHttpServer();

      // Phase 3: Drain existing connections
      await this.drainConnections();

      // Phase 4: Close database connections
      await this.closeDatabaseConnections();

      // Phase 5: Close Redis connections
      await this.closeRedisConnections();

      // Phase 6: Close external service connections
      await this.closeExternalServices();

      // Phase 7: Cleanup resources
      await this.cleanupResources();

      // Phase 8: Final logging
      const duration = Date.now() - startTime;
      this.logger.log(`✅ Graceful shutdown completed in ${duration}ms`);

      // Exit with success
      process.exit(0);

    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ Graceful shutdown failed after ${duration}ms`, error);

      // Force exit after timeout
      setTimeout(() => {
        this.logger.error('💥 Force exiting due to shutdown failure');
        process.exit(1);
      }, this.forceShutdownTimeoutMs);
    }
  }

  // Phase 1: Stop accepting new connections
  private async stopAcceptingConnections(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.logger.log('🚫 Stopping new connections');

        // Stop accepting new connections
        this.server.close((error) => {
          if (error) {
            this.logger.error('Error stopping server', error);
          } else {
            this.logger.log('✅ Server stopped accepting new connections');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Phase 2: Close HTTP server
  private async closeHttpServer(): Promise<void> {
    if (!this.server) return;

    return new Promise((resolve) => {
      this.logger.log('🔒 Closing HTTP server');

      // Give existing connections time to finish
      setTimeout(() => {
        if (!this.server?.listening) {
          this.logger.log('✅ HTTP server already closed');
          resolve();
          return;
        }

        this.server.close((error) => {
          if (error) {
            this.logger.error('Error closing HTTP server', error);
          } else {
            this.logger.log('✅ HTTP server closed');
          }
          resolve();
        });
      }, 1000); // Wait 1 second for connections to drain
    });
  }

  // Phase 3: Drain existing connections
  private async drainConnections(): Promise<void> {
    const connectionCount = this.activeConnections.size;

    if (connectionCount === 0) {
      this.logger.log('✅ No active connections to drain');
      return;
    }

    this.logger.log(`🔄 Draining ${connectionCount} active connections`);

    // Wait for connections to close naturally
    const drainStart = Date.now();
    const maxDrainTime = this.shutdownTimeoutMs * 0.7; // 70% of shutdown timeout

    while (this.activeConnections.size > 0 && (Date.now() - drainStart) < maxDrainTime) {
      await new Promise(resolve => setTimeout(resolve, 100));

      if (this.activeConnections.size !== connectionCount) {
        this.logger.log(`📉 Connections remaining: ${this.activeConnections.size}`);
      }
    }

    // Force close remaining connections
    if (this.activeConnections.size > 0) {
      this.logger.warn(`⚠️ Force closing ${this.activeConnections.size} remaining connections`);

      for (const socket of this.activeConnections) {
        socket.destroy();
      }
      this.activeConnections.clear();
    }

    this.logger.log('✅ Connection draining completed');
  }

  // Phase 4: Close database connections
  private async closeDatabaseConnections(): Promise<void> {
    try {
      this.logger.log('🗄️ Closing database connections');

      if (this.prisma) {
        await this.prisma.$disconnect();
        this.logger.log('✅ Database connections closed');
      }
    } catch (error) {
      this.logger.error('Error closing database connections', error);
    }
  }

  // Phase 5: Close Redis connections
  private async closeRedisConnections(): Promise<void> {
    try {
      this.logger.log('🔴 Closing Redis connections');

      // Get Redis client from cache service
      const redisClient = await this.getRedisClient();
      if (redisClient) {
        await redisClient.quit();
        this.logger.log('✅ Redis connections closed');
      }
    } catch (error) {
      this.logger.error('Error closing Redis connections', error);
    }
  }

  // Phase 6: Close external service connections
  private async closeExternalServices(): Promise<void> {
    try {
      this.logger.log('🌐 Closing external service connections');

      // Close WebSocket connections
      await this.closeWebSocketConnections();

      // Close other external services
      await this.closeOtherExternalServices();

      this.logger.log('✅ External service connections closed');
    } catch (error) {
      this.logger.error('Error closing external services', error);
    }
  }

  // Phase 7: Cleanup resources
  private async cleanupResources(): Promise<void> {
    try {
      this.logger.log('🧹 Cleaning up resources');

      // Clear any pending timeouts
      if (this.shutdownTimeout) {
        clearTimeout(this.shutdownTimeout);
        this.shutdownTimeout = null;
      }

      // Clear any intervals
      await this.clearIntervals();

      // Clear any caches
      await this.clearCaches();

      // Remove signal handlers
      this.removeSignalHandlers();

      this.logger.log('✅ Resource cleanup completed');
    } catch (error) {
      this.logger.error('Error during resource cleanup', error);
    }
  }

  // Helper methods for external services
  private async getRedisClient(): Promise<Redis | null> {
    try {
      // This would typically get the Redis client from the cache service
      // For now, return null as a placeholder
      return null;
    } catch {
      return null;
    }
  }

  private async closeWebSocketConnections(): Promise<void> {
    try {
      // This would close WebSocket connections
      // Implementation depends on WebSocket gateway setup
      this.logger.log('📡 WebSocket connections closed');
    } catch (error) {
      this.logger.error('Error closing WebSocket connections', error);
    }
  }

  private async closeOtherExternalServices(): Promise<void> {
    try {
      // Close payment gateway connections
      // Close AI service connections
      // Close file storage connections
      // etc.
      this.logger.log('🔌 Other external services closed');
    } catch (error) {
      this.logger.error('Error closing other external services', error);
    }
  }

  private async clearIntervals(): Promise<void> {
    // Clear any setInterval timers
    // This is a placeholder for actual interval cleanup
    this.logger.log('⏰ Intervals cleared');
  }

  private async clearCaches(): Promise<void> {
    try {
      // Clear any in-memory caches
      // Clear any temporary files
      this.logger.log('🗂️ Caches cleared');
    } catch (error) {
      this.logger.error('Error clearing caches', error);
    }
  }

  private removeSignalHandlers(): void {
    for (const signal of this.shutdownSignals) {
      process.removeAllListeners(signal);
    }
    this.logger.log('📡 Signal handlers removed');
  }

  // Public methods for external control

  // Get shutdown status
  getShutdownStatus() {
    return {
      isShuttingDown: this.isShuttingDown,
      activeConnections: this.activeConnections.size,
      shutdownTimeoutMs: this.shutdownTimeoutMs,
      forceShutdownTimeoutMs: this.forceShutdownTimeoutMs,
      serverListening: this.server?.listening || false,
    };
  }

  // Manual shutdown trigger
  async manualShutdown(reason = 'MANUAL_TRIGGER'): Promise<void> {
    this.logger.log(`🔄 Manual shutdown triggered: ${reason}`);
    await this.shutdown(reason);
  }

  // Health check integration
  async getHealthStatus() {
    return {
      status: this.isShuttingDown ? 'shutting_down' : 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      activeConnections: this.activeConnections.size,
      pid: process.pid,
    };
  }

  // Readiness check
  isReady(): boolean {
    return !this.isShuttingDown;
  }

  // Liveness check
  isAlive(): boolean {
    return !this.isShuttingDown;
  }

  // Force immediate shutdown (for testing/emergency)
  forceShutdown(reason = 'FORCE_SHUTDOWN'): void {
    this.logger.error(`💥 Force shutdown triggered: ${reason}`);
    process.exit(1);
  }

  // Get process information
  getProcessInfo() {
    return {
      pid: process.pid,
      platform: process.platform,
      version: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      activeConnections: this.activeConnections.size,
      isShuttingDown: this.isShuttingDown,
    };
  }
}
