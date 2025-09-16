/// <reference types="node" />
export declare class HealthController {
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    getDetailedHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        version: string;
    };
}
