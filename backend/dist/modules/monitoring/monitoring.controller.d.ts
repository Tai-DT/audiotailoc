/// <reference types="node" />
import { Response } from 'express';
import { MonitoringService } from './monitoring.service';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    getMetrics(response: Response): any;
    getHealth(): {
        status: string;
        timestamp: any;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        version: string;
    };
    getDetailedHealth(): {
        status: string;
        timestamp: any;
        uptime: number;
        memory: {
            used: any;
            total: any;
            percentage: any;
        };
        system: {
            platform: NodeJS.Platform;
            nodeVersion: string;
            pid: number;
        };
        database: {
            status: string;
            lastCheck: any;
        };
    };
    getReadiness(): {
        status: string;
        timestamp: any;
        checks: {
            database: string;
            redis: string;
            externalServices: string;
        };
    };
    getLiveness(): {
        status: string;
        timestamp: any;
    };
}
