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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivityLogService = class ActivityLogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logActivity(data) {
        try {
            await this.prisma.activity_logs.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    userId: data.userId,
                    action: data.action,
                    resource: data.resource,
                    resourceId: data.resourceId,
                    details: data.details ? JSON.stringify(data.details) : null,
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                    method: data.method,
                    url: data.url,
                    statusCode: data.statusCode,
                    duration: data.duration,
                    category: data.category || 'general',
                    severity: data.severity || 'low'
                }
            });
        }
        catch (error) {
            console.error('Failed to log activity:', error);
        }
    }
    async getActivityLogs(filters) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.action)
            where.action = filters.action;
        if (filters.resource)
            where.resource = filters.resource;
        if (filters.category)
            where.category = filters.category;
        if (filters.severity)
            where.severity = filters.severity;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [logs, total] = await Promise.all([
            this.prisma.activity_logs.findMany({
                where,
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: filters.limit || 100,
                skip: filters.offset || 0
            }),
            this.prisma.activity_logs.count({ where })
        ]);
        return {
            logs: logs.map(log => ({
                ...log,
                details: log.details ? JSON.parse(log.details) : null
            })),
            total
        };
    }
    async cleanupOldLogs(days = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const result = await this.prisma.activity_logs.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffDate
                }
            }
        });
        return result.count;
    }
    async getActivityStats(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const stats = await this.prisma.activity_logs.groupBy({
            by: ['category', 'severity'],
            where,
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        });
        return stats.map(stat => ({
            category: stat.category,
            severity: stat.severity,
            count: stat._count.id
        }));
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map