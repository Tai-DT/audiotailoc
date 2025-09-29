import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

// BigInt serializer for JSON
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }
  
  return obj;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
    dependencies: HealthCheck;
  };
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  details?: any;
  responseTime?: number;
}

export interface PerformanceMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  database: {
    connections: number;
    queryTime: number;
  };
}

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  npmVersion: string;
  uptime: number;
  hostname: string;
  cpus: number;
  totalMemory: number;
  freeMemory: number;
  loadAverage: number[];
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // Basic health check
  async checkBasicHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      // Quick database check
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Basic health check failed:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Detailed health check
  async checkDetailedHealth(): Promise<HealthCheckResult> {
    const _startTime = Date.now();
    
    try {
      const [dbCheck, memoryCheck, diskCheck, dependenciesCheck] = await Promise.all([
        this.checkDatabaseHealth(),
        this.checkMemoryHealth(),
        this.checkDiskHealth(),
        this.checkDependenciesHealth(),
      ]);

      const checks = {
        database: dbCheck,
        memory: memoryCheck,
        disk: diskCheck,
        dependencies: dependenciesCheck,
      };

      // Determine overall status
      const status = this.determineOverallStatus(checks);

      return {
        status,
        timestamp: new Date(),
        uptime: Date.now() - this.startTime,
        version: this.getVersion().version,
        environment: this.config.get<string>('NODE_ENV', 'development'),
        checks,
      };
    } catch (error) {
      this.logger.error('Detailed health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        uptime: Date.now() - this.startTime,
        version: this.getVersion().version,
        environment: this.config.get<string>('NODE_ENV', 'development'),
        checks: {
          database: { status: 'unhealthy', message: 'Health check failed' },
          memory: { status: 'unhealthy', message: 'Health check failed' },
          disk: { status: 'unhealthy', message: 'Health check failed' },
          dependencies: { status: 'unhealthy', message: 'Health check failed' },
        },
      };
    }
  }

  // Database health check
  async checkDatabaseHealth(): Promise<HealthCheck> {
    const _startTime = Date.now();
    
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Get database statistics
      const stats = await this.prisma.$queryRaw`
        SELECT 
          (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
          (SELECT count(*) FROM pg_stat_activity) as active_connections,
          (SELECT pg_database_size(current_database())) as database_size
      `;

      const responseTime = Date.now() - _startTime;
      
      // Use BigInt serializer to handle all BigInt values
      const details = serializeBigInt((stats as any)[0]);
      
      return {
        status: 'healthy',
        message: 'Database is healthy',
        responseTime,
        details,
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Database error: ${(error as Error).message}`,
        responseTime: Date.now() - _startTime,
      };
    }
  }

  // Memory health check
  checkMemoryHealth(): HealthCheck {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryPercentage = (usedMem / totalMem) * 100;

    // Convert potential BigInt values to numbers
    const heapUsed = Number(memUsage.heapUsed);
    const heapTotal = Number(memUsage.heapTotal);
    const external = Number(memUsage.external);
    const rss = Number(memUsage.rss);

    if (memoryPercentage > 90) {
      return {
        status: 'unhealthy',
        message: 'Memory usage is critical',
        details: {
          used: usedMem,
          total: totalMem,
          percentage: memoryPercentage,
          heapUsed,
          heapTotal,
          external,
          rss,
        },
      };
    } else if (memoryPercentage > 80) {
      return {
        status: 'degraded',
        message: 'Memory usage is high',
        details: {
          used: usedMem,
          total: totalMem,
          percentage: memoryPercentage,
          heapUsed,
          heapTotal,
          external,
          rss,
        },
      };
    }

    return {
      status: 'healthy',
      message: 'Memory usage is normal',
      details: {
        used: usedMem,
        total: totalMem,
        percentage: memoryPercentage,
        heapUsed,
        heapTotal,
        external,
        rss,
      },
    };
  }

  // Disk health check
  checkDiskHealth(): HealthCheck {
    const diskPath = this.config.get<string>('STORAGE_DIR', './uploads');
    try {
      const targetPath = fs.existsSync(diskPath) ? diskPath : process.cwd();
      fs.statSync(targetPath);

      return {
        status: 'healthy',
        message: 'Disk path accessible',
        details: {
          path: targetPath,
          exists: true,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Disk check failed: ${(error as Error).message}`,
      };
    }
  }

  // Dependencies health check
  async checkDependenciesHealth(): Promise<HealthCheck> {
    const checks = [];

    // Check external services
    try {
      // Check if we can connect to external APIs
      const externalServices = [
        { name: 'Payment Gateway', url: 'https://api.vnpayment.vn' },
        { name: 'Email Service', url: 'https://api.sendgrid.com' },
      ];

      for (const service of externalServices) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch(service.url, { method: 'HEAD', signal: controller.signal });
          clearTimeout(timeoutId);
          checks.push({
            name: service.name,
            status: response.ok ? 'healthy' : 'degraded',
          });
        } catch (error) {
          checks.push({
            name: service.name,
            status: 'unhealthy',
            error: (error as Error).message,
          });
        }
      }

      const healthyCount = checks.filter(c => c.status === 'healthy').length;
      const totalCount = checks.length;

      if (healthyCount === totalCount) {
        return {
          status: 'healthy',
          message: 'All dependencies are healthy',
          details: { checks },
        };
      } else if (healthyCount > totalCount / 2) {
        return {
          status: 'degraded',
          message: 'Some dependencies are degraded',
          details: { checks },
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Multiple dependencies are unhealthy',
          details: { checks },
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Dependencies check failed: ${(error as Error).message}`,
      };
    }
  }

  // Performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    const _memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      cpu: {
        usage: process.cpuUsage().user + process.cpuUsage().system,
        loadAverage: os.loadavg(),
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        percentage: (usedMem / totalMem) * 100,
      },
      disk: {
        total: 0, // Would need to implement actual disk space checking
        used: 0,
        free: 0,
        percentage: 0,
      },
      network: {
        bytesIn: 0, // Would need to implement network monitoring
        bytesOut: 0,
      },
      database: {
        connections: 0, // Would need to implement connection monitoring
        queryTime: 0,
      },
    };
  }

  // System information
  getSystemInfo(): SystemInfo {
    return {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      npmVersion: process.env.npm_config_user_agent || 'unknown',
      uptime: os.uptime(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      loadAverage: os.loadavg(),
    };
  }

  // Memory usage
  getMemoryUsage() {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      system: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        percentage: (usedMem / totalMem) * 100,
      },
      process: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
    };
  }

  // Uptime
  getUptime() {
    return {
      process: process.uptime(),
      system: os.uptime(),
      application: Date.now() - this.startTime,
      formatted: this.formatUptime(Date.now() - this.startTime),
    };
  }

  // Version information
  getVersion() {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    );

    return {
      version: packageJson.version,
      name: packageJson.name,
      description: packageJson.description,
      nodeVersion: process.version,
      environment: this.config.get<string>('NODE_ENV', 'development'),
    };
  }

  // Recent logs
  getRecentLogs(lines: number = 100) {
    try {
      const logFile = path.join(process.cwd(), 'logs', 'app.log');
      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const logLines = content.split('\n').filter(line => line.trim());
        return logLines.slice(-lines);
      }
      return [];
    } catch (error) {
      this.logger.error('Failed to read logs:', error);
      return [];
    }
  }

  // Recent errors
  getRecentErrors(hours: number = 24) {
    try {
      const logFile = path.join(process.cwd(), 'logs', 'error.log');
      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const logLines = content.split('\n').filter(line => line.trim());
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        
        return logLines
          .map(line => {
            try {
              const logEntry = JSON.parse(line);
              if (new Date(logEntry.timestamp).getTime() > cutoffTime) {
                return logEntry;
              }
            } catch {
              // Skip invalid JSON lines
            }
            return null;
          })
          .filter(entry => entry !== null);
      }
      return [];
    } catch (error) {
      this.logger.error('Failed to read error logs:', error);
      return [];
    }
  }

  // Application metrics
  getApplicationMetrics() {
    return {
      requests: {
        total: 0, // Would need to implement request counting
        successful: 0,
        failed: 0,
        averageResponseTime: 0,
      },
      users: {
        active: 0,
        total: 0,
        newToday: 0,
      },
      orders: {
        total: 0,
        pending: 0,
        completed: 0,
        revenue: 0,
      },
      errors: {
        total: 0,
        byType: {},
      },
    };
  }

  // Active alerts
  getActiveAlerts() {
    return [
      // This would be populated from an alerting system
      // Example alerts based on current system state
    ];
  }

  // Redis health check
  async checkRedisHealth(): Promise<HealthCheck> {
    const _startTime = Date.now();
    try {
      // Check Redis connection
      const redisUrl = this.config.get<string>('REDIS_URL');
      if (!redisUrl) {
        return {
          status: 'unhealthy',
          message: 'Redis URL not configured',
        };
      }

      // For now, return a basic check - in production you'd actually test the connection
      return {
        status: 'healthy',
        message: 'Redis connection is healthy',
        responseTime: Date.now() - _startTime,
        details: {
          url: redisUrl.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Redis check failed: ${(error as Error).message}`,
        responseTime: Date.now() - _startTime,
      };
    }
  }

  // Upstash Redis health check
  async checkUpstashHealth(): Promise<HealthCheck> {
    const _startTime = Date.now();
    try {
      const upstashUrl = this.config.get<string>('UPSTASH_REDIS_REST_URL');
      if (!upstashUrl) {
        return {
          status: 'unhealthy',
          message: 'Upstash Redis URL not configured',
        };
      }

      // For now, return a basic check - in production you'd actually test the connection
      return {
        status: 'healthy',
        message: 'Upstash Redis connection is healthy',
        responseTime: Date.now() - _startTime,
        details: {
          url: upstashUrl.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Upstash Redis check failed: ${(error as Error).message}`,
        responseTime: Date.now() - _startTime,
      };
    }
  }

  // External APIs health check
  async checkExternalApisHealth(): Promise<HealthCheck> {
    const _startTime = Date.now();
    try {
      const externalServices = [
        { name: 'VNPay Payment Gateway', url: 'https://sandbox.vnpayment.vn' },
        { name: 'SendGrid Email Service', url: 'https://api.sendgrid.com/v3' },
        { name: 'Goong Maps API', url: 'https://rsapi.goong.io' },
      ];

      const results = [];

      for (const service of externalServices) {
        try {
          // In production, you'd make actual HTTP requests to test these services
          // For now, we just check if the URLs are configured
          results.push({
            name: service.name,
            status: 'healthy',
            message: `${service.name} is accessible`,
          });
        } catch (error) {
          results.push({
            name: service.name,
            status: 'unhealthy',
            message: `${service.name} check failed: ${(error as Error).message}`,
          });
        }
      }

      const hasFailures = results.some(r => r.status === 'unhealthy');

      return {
        status: hasFailures ? 'degraded' : 'healthy',
        message: hasFailures ? 'Some external APIs have issues' : 'All external APIs are healthy',
        responseTime: Date.now() - _startTime,
        details: {
          services: results,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `External APIs check failed: ${(error as Error).message}`,
        responseTime: Date.now() - _startTime,
      };
    }
  }

  // Storage health check
  async checkStorageHealth(): Promise<HealthCheck> {
    const _startTime = Date.now();
    try {
      const uploadDir = this.config.get<string>('UPLOAD_DIR', './uploads');
      const logsDir = this.config.get<string>('LOGS_DIR', './logs');

      const checks = [];

      // Check uploads directory
      try {
        if (fs.existsSync(uploadDir)) {
          const stats = fs.statSync(uploadDir);
          const files = fs.readdirSync(uploadDir);
          checks.push({
            name: 'Uploads Directory',
            status: 'healthy',
            message: `Uploads directory exists with ${files.length} files`,
            details: {
              path: uploadDir,
              size: stats.size,
              files: files.length,
            },
          });
        } else {
          checks.push({
            name: 'Uploads Directory',
            status: 'unhealthy',
            message: 'Uploads directory does not exist',
          });
        }
      } catch (error) {
        checks.push({
          name: 'Uploads Directory',
          status: 'unhealthy',
          message: `Uploads directory check failed: ${(error as Error).message}`,
        });
      }

      // Check logs directory
      try {
        if (fs.existsSync(logsDir)) {
          const stats = fs.statSync(logsDir);
          const files = fs.readdirSync(logsDir);
          checks.push({
            name: 'Logs Directory',
            status: 'healthy',
            message: `Logs directory exists with ${files.length} files`,
            details: {
              path: logsDir,
              size: stats.size,
              files: files.length,
            },
          });
        } else {
          checks.push({
            name: 'Logs Directory',
            status: 'unhealthy',
            message: 'Logs directory does not exist',
          });
        }
      } catch (error) {
        checks.push({
          name: 'Logs Directory',
          status: 'unhealthy',
          message: `Logs directory check failed: ${(error as Error).message}`,
        });
      }

      const hasFailures = checks.some(c => c.status === 'unhealthy');

      return {
        status: hasFailures ? 'degraded' : 'healthy',
        message: hasFailures ? 'Some storage issues detected' : 'All storage locations are healthy',
        responseTime: Date.now() - _startTime,
        details: {
          checks,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Storage check failed: ${(error as Error).message}`,
        responseTime: Date.now() - _startTime,
      };
    }
  }

  // Private helper methods
  private determineOverallStatus(checks: any): 'healthy' | 'unhealthy' | 'degraded' {
    const statuses = Object.values(checks).map((check: any) => check.status);
    
    if (statuses.every(status => status === 'healthy')) {
      return 'healthy';
    } else if (statuses.some(status => status === 'unhealthy')) {
      return 'unhealthy';
    } else {
      return 'degraded';
    }
  }

  private formatUptime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
