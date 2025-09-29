"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const logging_service_1 = require("../monitoring/logging.service");
const activity_log_service_1 = require("../../services/activity-log.service");
class AdminDashboardDto {
}
class BulkActionDto {
}
let AdminController = class AdminController {
    constructor(prisma, configService, loggingService, activityLogService) {
        this.prisma = prisma;
        this.configService = configService;
        this.loggingService = loggingService;
        this.activityLogService = activityLogService;
    }
    async getDashboard(query) {
        const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = query.endDate ? new Date(query.endDate) : new Date();
        const [totalUsers, totalProducts, totalOrders, totalRevenue, newUsers, newOrders, pendingOrders, lowStockProducts] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalCents: true }
            }),
            this.prisma.user.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            this.prisma.order.count({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            this.prisma.order.count({
                where: { status: 'PENDING' }
            }),
            this.prisma.inventory.count({
                where: { stock: { lte: 10 } }
            })
        ]);
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } }
            }
        });
        const recentUsers = await this.prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, email: true, createdAt: true }
        });
        return {
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue: totalRevenue._sum.totalCents || 0,
                    newUsers,
                    newOrders,
                    pendingOrders,
                    lowStockProducts
                },
                recentActivities: {
                    orders: recentOrders,
                    users: recentUsers
                },
                period: {
                    startDate,
                    endDate
                }
            }
        };
    }
    async getUserStats(days = '30') {
        const daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
        const [totalUsers, activeUsers, newUsers, usersByRole] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: { updatedAt: { gte: daysAgo } }
            }),
            this.prisma.user.count({
                where: { createdAt: { gte: daysAgo } }
            }),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: { role: true }
            })
        ]);
        return {
            success: true,
            data: {
                totalUsers,
                activeUsers,
                newUsers,
                usersByRole: usersByRole.reduce((acc, item) => {
                    acc[item.role] = item._count.role;
                    return acc;
                }, {})
            }
        };
    }
    async getOrderStats(days = '30') {
        const _daysAgo = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
        const [totalOrders, completedOrders, pendingOrders, cancelledOrders, totalRevenue, ordersByStatus] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({
                where: { status: 'COMPLETED' }
            }),
            this.prisma.order.count({
                where: { status: 'PENDING' }
            }),
            this.prisma.order.count({
                where: { status: 'CANCELED' }
            }),
            this.prisma.order.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalCents: true }
            }),
            this.prisma.order.groupBy({
                by: ['status'],
                _count: { status: true }
            })
        ]);
        return {
            success: true,
            data: {
                totalOrders,
                completedOrders,
                pendingOrders,
                cancelledOrders,
                totalRevenue: totalRevenue._sum.totalCents || 0,
                ordersByStatus: ordersByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count.status;
                    return acc;
                }, {})
            }
        };
    }
    async getProductStats() {
        const [totalProducts, activeProducts, lowStockProducts, productsByCategory] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({
                where: { featured: true }
            }),
            this.prisma.inventory.count({
                where: { stock: { lte: 10 } }
            }),
            this.prisma.product.groupBy({
                by: ['categoryId'],
                _count: { categoryId: true }
            })
        ]);
        return {
            success: true,
            data: {
                totalProducts,
                activeProducts,
                lowStockProducts,
                productsByCategory: productsByCategory.reduce((acc, item) => {
                    acc[item.categoryId || 'uncategorized'] = item._count.categoryId;
                    return acc;
                }, {})
            }
        };
    }
    async performBulkAction(dto) {
        const { action, ids, type } = dto;
        let result;
        switch (type) {
            case 'users':
                switch (action) {
                    case 'delete':
                        result = await this.prisma.user.deleteMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case 'activate':
                        result = await this.prisma.user.updateMany({
                            where: { id: { in: ids } },
                            data: { role: 'USER' }
                        });
                        break;
                    case 'deactivate':
                        result = await this.prisma.user.updateMany({
                            where: { id: { in: ids } },
                            data: { role: 'USER' }
                        });
                        break;
                }
                break;
            case 'products':
                switch (action) {
                    case 'delete':
                        result = await this.prisma.product.deleteMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case 'activate':
                        result = await this.prisma.product.updateMany({
                            where: { id: { in: ids } },
                            data: { featured: true }
                        });
                        break;
                    case 'deactivate':
                        result = await this.prisma.product.updateMany({
                            where: { id: { in: ids } },
                            data: { featured: false }
                        });
                        break;
                }
                break;
            case 'orders':
                switch (action) {
                    case 'delete':
                        result = await this.prisma.order.deleteMany({
                            where: { id: { in: ids } }
                        });
                        break;
                    case 'activate':
                        result = await this.prisma.order.updateMany({
                            where: { id: { in: ids } },
                            data: { status: 'COMPLETED' }
                        });
                        break;
                    case 'deactivate':
                        result = await this.prisma.order.updateMany({
                            where: { id: { in: ids } },
                            data: { status: 'CANCELED' }
                        });
                        break;
                }
                break;
        }
        return {
            success: true,
            data: {
                action,
                type,
                affectedCount: result?.count || 0,
                message: `Successfully ${action}ed ${result?.count || 0} ${type}`
            }
        };
    }
    async getSystemStatus() {
        const [databaseStatus, redisStatus, maintenanceMode] = await Promise.all([
            this.prisma.$queryRaw `SELECT 1 as status`,
            Promise.resolve('OK'),
            this.prisma.systemConfig.findUnique({
                where: { key: 'maintenance_mode' }
            })
        ]);
        return {
            success: true,
            data: {
                database: databaseStatus ? 'Connected' : 'Disconnected',
                redis: redisStatus,
                maintenanceMode: maintenanceMode?.value === 'true',
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                environment: this.configService.get('NODE_ENV', 'development')
            }
        };
    }
    async getActivityLogs(type, limit = '100', offset = '0', userId, action, startDate, endDate) {
        try {
            const limitNum = Math.min(parseInt(limit), 1000);
            const offsetNum = parseInt(offset);
            const { logs, total } = await this.activityLogService.getActivityLogs({
                category: type && type !== 'all' ? type : undefined,
                userId,
                action,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                limit: limitNum,
                offset: offsetNum
            });
            this.loggingService.logUserActivity('admin_view_activity_logs', 'Viewed activity logs', {
                resource: 'activity_logs',
                type: type || 'all',
                limit: limitNum,
                offset: offsetNum,
                filters: { userId, action, startDate, endDate }
            });
            return {
                success: true,
                data: {
                    logs,
                    total,
                    limit: limitNum,
                    offset: offsetNum,
                    type: type || 'all'
                }
            };
        }
        catch (error) {
            this.loggingService.error('Failed to retrieve activity logs', {
                error: error,
                type,
                limit,
                offset,
                userId,
                action,
                startDate,
                endDate
            });
            return {
                success: false,
                error: {
                    code: 'ACTIVITY_LOGS_RETRIEVAL_FAILED',
                    message: 'Failed to retrieve activity logs',
                    details: error.message
                }
            };
        }
    }
    async cleanupActivityLogs(days = '90') {
        try {
            const daysNum = parseInt(days);
            if (daysNum < 7) {
                return {
                    success: false,
                    error: {
                        code: 'INVALID_CLEANUP_DAYS',
                        message: 'Cleanup days must be at least 7'
                    }
                };
            }
            const deletedCount = await this.activityLogService.cleanupOldLogs(daysNum);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysNum);
            this.loggingService.logUserActivity('admin_cleanup_activity_logs', 'Cleaned up old activity logs', {
                resource: 'activity_logs',
                deletedCount,
                cutoffDate: cutoffDate.toISOString(),
                days: daysNum
            });
            return {
                success: true,
                data: {
                    deletedCount,
                    cutoffDate: cutoffDate.toISOString(),
                    days: daysNum
                },
                message: `Successfully deleted ${deletedCount} old activity logs`
            };
        }
        catch (error) {
            this.loggingService.error('Failed to cleanup activity logs', {
                error: error,
                days
            });
            return {
                success: false,
                error: {
                    code: 'ACTIVITY_LOGS_CLEANUP_FAILED',
                    message: 'Failed to cleanup activity logs',
                    details: error.message
                }
            };
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminDashboardDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('stats/users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User statistics' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('stats/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order statistics' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrderStats", null);
__decorate([
    (0, common_1.Get)('stats/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProductStats", null);
__decorate([
    (0, common_1.Post)('bulk-action'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform bulk actions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk action completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkActionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "performBulkAction", null);
__decorate([
    (0, common_1.Get)('system/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemStatus", null);
__decorate([
    (0, common_1.Get)('logs/activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity logs retrieved successfully' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('userId')),
    __param(4, (0, common_1.Query)('action')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActivityLogs", null);
__decorate([
    (0, common_1.Delete)('logs/activity/cleanup'),
    (0, swagger_1.ApiOperation)({ summary: 'Clean up old activity logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Old activity logs cleaned up successfully' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "cleanupActivityLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin Dashboard'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        logging_service_1.LoggingService,
        activity_log_service_1.ActivityLogService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map