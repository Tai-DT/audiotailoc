import { Response } from 'express';
import { MonitoringService } from './monitoring.service';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    getMetrics(response: Response): Promise<void>;
    getHealth(): {
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
    getReadiness(): {
        status: string;
        timestamp: string;
        checks: {
            database: string;
            redis: string;
            externalServices: string;
        };
    };
    getLiveness(): {
        status: string;
        timestamp: string;
    };
}
