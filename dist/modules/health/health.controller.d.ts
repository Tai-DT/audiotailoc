import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    basicHealth(): Promise<{
        status: string;
        timestamp: string;
    }>;
    detailedHealth(): Promise<import("./health.service").HealthCheckResult>;
    databaseHealth(): Promise<import("./health.service").HealthCheck>;
    performanceMetrics(): Promise<import("./health.service").PerformanceMetrics>;
    systemInfo(): Promise<import("./health.service").SystemInfo>;
    memoryUsage(): Promise<{
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
    }>;
    uptime(): Promise<{
        process: number;
        system: number;
        application: number;
        formatted: string;
    }>;
    version(): Promise<{
        version: any;
        name: any;
        description: any;
        nodeVersion: string;
        environment: string;
    }>;
    dependenciesHealth(): Promise<import("./health.service").HealthCheck>;
    recentLogs(lines?: string): Promise<string[]>;
    recentErrors(hours?: string): Promise<any[]>;
    applicationMetrics(): Promise<{
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
    }>;
    activeAlerts(): Promise<any[]>;
    redisHealth(): Promise<import("./health.service").HealthCheck>;
    upstashHealth(): Promise<import("./health.service").HealthCheck>;
    externalApisHealth(): Promise<import("./health.service").HealthCheck>;
    storageHealth(): Promise<import("./health.service").HealthCheck>;
}
