import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
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
export declare class HealthService {
    private readonly config;
    private readonly prisma;
    private readonly logger;
    private readonly startTime;
    constructor(config: ConfigService, prisma: PrismaService);
    checkBasicHealth(): Promise<{
        status: string;
        timestamp: string;
    }>;
    checkDetailedHealth(): Promise<HealthCheckResult>;
    checkDatabaseHealth(): Promise<HealthCheck>;
    checkMemoryHealth(): HealthCheck;
    checkDiskHealth(): HealthCheck;
    checkDependenciesHealth(): Promise<HealthCheck>;
    getPerformanceMetrics(): PerformanceMetrics;
    getSystemInfo(): SystemInfo;
    getMemoryUsage(): {
        system: {
            total: number;
            used: number;
            free: number;
            percentage: number;
        };
        process: {
            rss: number;
            heapTotal: number;
            heapUsed: number;
            external: number;
            arrayBuffers: number;
        };
    };
    getUptime(): {
        process: number;
        system: number;
        application: number;
        formatted: string;
    };
    getVersion(): {
        version: any;
        name: any;
        description: any;
        nodeVersion: string;
        environment: string;
    };
    getRecentLogs(lines?: number): string[];
    getRecentErrors(hours?: number): any[];
    getApplicationMetrics(): {
        requests: {
            total: number;
            successful: number;
            failed: number;
            averageResponseTime: number;
        };
        users: {
            active: number;
            total: number;
            newToday: number;
        };
        orders: {
            total: number;
            pending: number;
            completed: number;
            revenue: number;
        };
        errors: {
            total: number;
            byType: {};
        };
    };
    getActiveAlerts(): any[];
    checkRedisHealth(): Promise<HealthCheck>;
    checkUpstashHealth(): Promise<HealthCheck>;
    checkExternalApisHealth(): Promise<HealthCheck>;
    checkStorageHealth(): Promise<HealthCheck>;
    private determineOverallStatus;
    private formatUptime;
}
