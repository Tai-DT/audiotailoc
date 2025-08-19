import { HealthService, HealthCheckResult } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    health(): Promise<HealthCheckResult>;
    healthz(): {
        status: string;
    };
    readiness(): Promise<{
        status: "ok" | "error";
        message: string;
    }>;
    liveness(): Promise<{
        status: "ok" | "error";
        message: string;
    }>;
    secure(): {
        status: string;
        secure: boolean;
    };
}
