import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from '../monitoring/logging.service';
import { ActivityLogService } from '../../services/activity-log.service';
declare class AdminDashboardDto {
    startDate?: string;
    endDate?: string;
}
declare class BulkActionDto {
    action: 'delete' | 'activate' | 'deactivate' | 'export';
    ids: string[];
    type: 'users' | 'products' | 'orders';
}
export declare class AdminController {
    private readonly prisma;
    private readonly configService;
    private readonly loggingService;
    private readonly activityLogService;
    constructor(prisma: PrismaService, configService: ConfigService, loggingService: LoggingService, activityLogService: ActivityLogService);
    getDashboard(query: AdminDashboardDto): unknown;
    getUserStats(days?: string): unknown;
    getOrderStats(days?: string): unknown;
    getProductStats(): unknown;
    performBulkAction(dto: BulkActionDto): unknown;
    getSystemStatus(): unknown;
    getActivityLogs(type?: string, limit?: string, offset?: string, userId?: string, action?: string, startDate?: string, endDate?: string): unknown;
    cleanupActivityLogs(days?: string): unknown;
}
export {};
