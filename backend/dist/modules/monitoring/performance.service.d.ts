import { CacheService } from '../caching/cache.service';
interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: Date;
    tags?: Record<string, string>;
}
interface RequestMetrics {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    timestamp: Date;
    userAgent?: string;
    ip?: string;
}
export declare class PerformanceService {
    private readonly cacheService;
    private readonly logger;
    private metrics;
    private requestMetrics;
    private readonly maxMetrics;
    constructor(cacheService: CacheService);
    recordMetric(name: string, value: number, tags?: Record<string, string>): void;
    recordRequest(metrics: RequestMetrics): void;
    getStats(timeRange?: 'hour' | 'day' | 'week'): Promise<{
        requests: {
            total: number;
            averageResponseTime: number;
            errorRate: number;
            requestsPerMinute: number;
        };
        endpoints: Array<{
            path: string;
            method: string;
            count: number;
            averageResponseTime: number;
            errorRate: number;
        }>;
        system: {
            memoryUsage: NodeJS.MemoryUsage;
            uptime: number;
            cpuUsage: NodeJS.CpuUsage;
        };
        cache: {
            hitRate: number;
            keyCount: number;
            memoryUsage: string;
        };
    }>;
    getRealTimeMetrics(): {
        activeRequests: number;
        memoryUsage: NodeJS.MemoryUsage;
        uptime: number;
    };
    getCustomMetrics(name?: string, timeRange?: 'hour' | 'day' | 'week'): PerformanceMetric[];
    getHealthStatus(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        checks: Array<{
            name: string;
            status: 'pass' | 'fail';
            message?: string;
            duration?: number;
        }>;
    }>;
    private shouldLogMetric;
    private updateAggregatedMetrics;
    private getTimeRangeMs;
    private getActiveRequestCount;
    private cleanupMetrics;
}
export {};
