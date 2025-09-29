import { PrismaService } from '../prisma/prisma.service';
export interface ActivityLogData {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    method?: string;
    url?: string;
    statusCode?: number;
    duration?: number;
    category?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}
export declare class ActivityLogService {
    private prisma;
    constructor(prisma: PrismaService);
    logActivity(data: ActivityLogData): Promise<void>;
    getActivityLogs(filters: {
        userId?: string;
        action?: string;
        resource?: string;
        category?: string;
        severity?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: {
            details: any;
            user: {
                id: string;
                email: string;
                name: string;
            };
            category: string;
            id: string;
            createdAt: Date;
            userId: string;
            action: string;
            resource: string;
            resourceId: string;
            ipAddress: string;
            userAgent: string;
            method: string;
            url: string;
            statusCode: number;
            duration: number;
            severity: string;
        }[];
        total: number;
    }>;
    cleanupOldLogs(days?: number): Promise<number>;
    getActivityStats(startDate?: Date, endDate?: Date): Promise<{
        category: string;
        severity: string;
        count: number;
    }[]>;
}
