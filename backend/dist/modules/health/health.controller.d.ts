import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    basicHealth(): unknown;
    detailedHealth(): unknown;
    databaseHealth(): unknown;
    performanceMetrics(): unknown;
    systemInfo(): unknown;
    memoryUsage(): unknown;
    uptime(): unknown;
    version(): unknown;
    dependenciesHealth(): unknown;
    recentLogs(lines?: string): unknown;
    recentErrors(hours?: string): unknown;
    applicationMetrics(): unknown;
    activeAlerts(): unknown;
    redisHealth(): unknown;
    upstashHealth(): unknown;
    externalApisHealth(): unknown;
    storageHealth(): unknown;
}
