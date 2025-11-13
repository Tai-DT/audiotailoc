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
    getDashboard(query: AdminDashboardDto): Promise<{
        success: boolean;
        data: {
            overview: {
                totalUsers: number;
                totalProducts: number;
                totalOrders: number;
                totalRevenue: number;
                newUsers: number;
                newOrders: number;
                pendingOrders: number;
                lowStockProducts: number;
            };
            recentActivities: {
                orders: ({
                    users: {
                        email: string;
                        name: string;
                    };
                } & {
                    status: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    orderNo: string;
                    userId: string;
                    subtotalCents: number;
                    discountCents: number;
                    shippingCents: number;
                    totalCents: number;
                    shippingAddress: string | null;
                    shippingCoordinates: string | null;
                    promotionCode: string | null;
                })[];
                users: {
                    id: string;
                    email: string;
                    name: string;
                    createdAt: Date;
                }[];
            };
            period: {
                startDate: Date;
                endDate: Date;
            };
        };
    }>;
    getUserStats(days?: string): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            activeUsers: number;
            newUsers: number;
            usersByRole: Record<string, number>;
        };
    }>;
    getOrderStats(days?: string): Promise<{
        success: boolean;
        data: {
            totalOrders: number;
            completedOrders: number;
            pendingOrders: number;
            cancelledOrders: number;
            totalRevenue: number;
            ordersByStatus: Record<string, number>;
        };
    }>;
    getProductStats(): Promise<{
        success: boolean;
        data: {
            totalProducts: number;
            activeProducts: number;
            lowStockProducts: number;
            productsByCategory: Record<string, number>;
        };
    }>;
    performBulkAction(dto: BulkActionDto): Promise<{
        success: boolean;
        data: {
            action: "delete" | "activate" | "deactivate" | "export";
            type: "orders" | "products" | "users";
            affectedCount: any;
            message: string;
        };
    }>;
    getSystemStatus(): Promise<{
        success: boolean;
        data: {
            database: string;
            redis: string;
            maintenanceMode: boolean;
            uptime: number;
            memoryUsage: NodeJS.MemoryUsage;
            environment: any;
        };
    }>;
    getActivityLogs(type?: string, limit?: string, offset?: string, userId?: string, action?: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            logs: {
                details: any;
                users: {
                    id: string;
                    email: string;
                    name: string;
                };
                id: string;
                createdAt: Date;
                userId: string | null;
                userAgent: string | null;
                method: string | null;
                url: string | null;
                statusCode: number | null;
                duration: number | null;
                severity: string;
                category: string;
                action: string;
                resource: string | null;
                resourceId: string | null;
                ipAddress: string | null;
            }[];
            total: number;
            limit: number;
            offset: number;
            type: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: {
            code: string;
            message: string;
            details: string;
        };
        data?: undefined;
    }>;
    cleanupActivityLogs(days?: string): Promise<{
        success: boolean;
        error: {
            code: string;
            message: string;
            details?: undefined;
        };
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: {
            deletedCount: number;
            cutoffDate: string;
            days: number;
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: {
            code: string;
            message: string;
            details: string;
        };
        data?: undefined;
        message?: undefined;
    }>;
}
export {};
