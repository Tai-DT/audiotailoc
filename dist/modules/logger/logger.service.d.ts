export declare class LoggerService {
    findAll(): Promise<{
        message: string;
        status: string;
    }>;
    getStatus(): Promise<{
        module: string;
        status: string;
        uptime: number;
    }>;
}
