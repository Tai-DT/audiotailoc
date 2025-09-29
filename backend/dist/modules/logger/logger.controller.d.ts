export declare class LoggerController {
    findAll(): Promise<{
        success: boolean;
        data: {
            message: string;
            status: string;
            timestamp: string;
        };
        message: string;
    }>;
    getStatus(): Promise<{
        success: boolean;
        data: {
            module: string;
            status: string;
            uptime: number;
            timestamp: string;
        };
    }>;
}
