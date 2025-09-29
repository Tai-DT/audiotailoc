/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
export declare class MonitoringService {
    private configService;
    private readonly requestCounter;
    private readonly responseTimeHistogram;
    private readonly activeConnectionsGauge;
    private readonly dbConnectionPoolGauge;
    private readonly memoryUsageGauge;
    private readonly errorCounter;
    constructor(configService: ConfigService);
    recordRequest(method: string, route: string, statusCode: number, duration: number): void;
    updateActiveConnections(type: string, count: number): void;
    updateDatabasePoolMetrics(used: number, available: number, pending: number): void;
    recordError(type: string, endpoint: string): void;
    private updateMemoryMetrics;
    getMetrics(): Promise<string>;
    getHealthCheck(): {
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        version: string;
    };
    getDetailedHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        memory: {
            used: number;
            total: number;
            percentage: number;
        };
        system: {
            platform: NodeJS.Platform;
            nodeVersion: string;
            pid: number;
        };
        database: {
            status: string;
            lastCheck: string;
        };
    };
}
