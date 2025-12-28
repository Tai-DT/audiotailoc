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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../caching/cache.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async getOverview(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const previousPeriod = this.getPreviousPeriod(startDate, endDate);
        const [orders, users, revenue] = await Promise.all([
            this.prisma.orders.findMany({
                where: { createdAt: { gte: startDate, lte: endDate } },
                include: { order_items: true },
            }),
            this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { gte: startDate, lte: endDate },
                },
            }),
            this.prisma.orders.aggregate({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
                _sum: { totalCents: true },
            }),
        ]);
        const [prevOrders, prevUsers, prevRevenue] = await Promise.all([
            this.prisma.orders.count({
                where: { createdAt: { gte: previousPeriod.start, lte: previousPeriod.end } },
            }),
            this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { gte: previousPeriod.start, lte: previousPeriod.end },
                },
            }),
            this.prisma.orders.aggregate({
                where: {
                    createdAt: { gte: previousPeriod.start, lte: previousPeriod.end },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
                _sum: { totalCents: true },
            }),
        ]);
        const totalRevenue = (revenue._sum.totalCents || 0) / 100;
        const prevTotalRevenue = (prevRevenue._sum.totalCents || 0) / 100;
        const totalOrders = orders.length;
        const conversionRate = users > 0 ? (totalOrders / users) * 100 : 0;
        return {
            totalRevenue,
            totalOrders,
            totalCustomers: await this.prisma.users.count({ where: { role: 'USER' } }),
            newCustomers: users,
            conversionRate,
            revenueGrowth: this.calculateGrowthRate(totalRevenue, prevTotalRevenue),
            ordersGrowth: this.calculateGrowthRate(totalOrders, prevOrders),
            customersGrowth: this.calculateGrowthRate(users, prevUsers),
        };
    }
    async getTrends(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const trends = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const [revenue, orders, customers] = await Promise.all([
                this.prisma.orders.aggregate({
                    where: {
                        createdAt: { gte: date, lt: nextDate },
                        status: { in: ['DELIVERED', 'COMPLETED'] },
                    },
                    _sum: { totalCents: true },
                }),
                this.prisma.orders.count({
                    where: { createdAt: { gte: date, lt: nextDate } },
                }),
                this.prisma.users.count({
                    where: {
                        role: 'USER',
                        createdAt: { gte: date, lt: nextDate },
                    },
                }),
            ]);
            trends.push({
                date: date.toISOString().split('T')[0],
                revenue: (revenue._sum.totalCents || 0) / 100,
                orders,
                customers,
            });
        }
        return trends;
    }
    async getTopProducts(limit = 5) {
        const topProducts = await this.prisma.order_items.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                price: true,
            },
            _count: true,
            orderBy: {
                _sum: {
                    price: 'desc',
                },
            },
            take: limit,
        });
        const products = await this.prisma.products.findMany({
            where: {
                id: { in: topProducts.map(p => p.productId) },
            },
        });
        return topProducts.map(tp => {
            const product = products.find(p => p.id === tp.productId);
            return {
                id: tp.productId,
                name: product?.name || 'Unknown',
                sold: tp._sum.quantity || 0,
                revenue: Number(tp._sum.price || 0) / 100,
            };
        });
    }
    async getTopServices(limit = 5) {
        const bookings = await this.prisma.service_bookings.groupBy({
            by: ['serviceId'],
            _count: true,
            _sum: {
                estimatedCosts: true,
            },
            orderBy: {
                _count: {
                    serviceId: 'desc',
                },
            },
            take: limit,
        });
        const services = await this.prisma.services.findMany({
            where: {
                id: { in: bookings.map(b => b.serviceId) },
            },
        });
        return bookings.map(booking => {
            const service = services.find(s => s.id === booking.serviceId);
            return {
                id: booking.serviceId,
                name: service?.name || 'Unknown',
                bookings: booking._count,
                revenue: (booking._sum.estimatedCosts || 0) / 100,
            };
        });
    }
    async getUserActivity(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const [productViews, serviceViews] = await Promise.all([
            this.prisma.product_views.count({
                where: { timestamp: { gte: startDate, lte: endDate } },
            }),
            this.prisma.service_views.count({
                where: { timestamp: { gte: startDate, lte: endDate } },
            }),
        ]);
        const pageViews = productViews + serviceViews;
        const [uniqueProductViewers, uniqueServiceViewers] = await Promise.all([
            this.prisma.product_views.groupBy({
                by: ['userId'],
                where: {
                    timestamp: { gte: startDate, lte: endDate },
                    userId: { not: null },
                },
            }),
            this.prisma.service_views.groupBy({
                by: ['userId'],
                where: {
                    timestamp: { gte: startDate, lte: endDate },
                    userId: { not: null },
                },
            }),
        ]);
        const uniqueUserIds = new Set([
            ...uniqueProductViewers.map(v => v.userId).filter(Boolean),
            ...uniqueServiceViewers.map(v => v.userId).filter(Boolean),
        ]);
        const sessions = uniqueUserIds.size;
        const [productViewCounts, serviceViewCounts] = await Promise.all([
            this.prisma.product_views.groupBy({
                by: ['userId'],
                where: {
                    timestamp: { gte: startDate, lte: endDate },
                    userId: { not: null },
                },
                _count: { id: true },
            }),
            this.prisma.service_views.groupBy({
                by: ['userId'],
                where: {
                    timestamp: { gte: startDate, lte: endDate },
                    userId: { not: null },
                },
                _count: { id: true },
            }),
        ]);
        const userViewCounts = new Map();
        productViewCounts.forEach(v => {
            if (v.userId) {
                userViewCounts.set(v.userId, (userViewCounts.get(v.userId) || 0) + v._count.id);
            }
        });
        serviceViewCounts.forEach(v => {
            if (v.userId) {
                userViewCounts.set(v.userId, (userViewCounts.get(v.userId) || 0) + v._count.id);
            }
        });
        let bounceSessions = 0;
        userViewCounts.forEach(count => {
            if (count === 1) {
                bounceSessions++;
            }
        });
        const bounceRate = sessions > 0 ? (bounceSessions / sessions) * 100 : 0;
        const activityLogRecords = await this.prisma.activity_logs.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                duration: { not: null },
            },
            select: { duration: true },
        });
        const avgSessionDuration = activityLogRecords.length > 0
            ? activityLogRecords.reduce((sum, log) => sum + (log.duration || 0), 0) /
                activityLogRecords.length
            : 0;
        return {
            pageViews,
            sessions,
            avgSessionDuration: avgSessionDuration / 1000,
            bounceRate: Math.round(bounceRate * 100) / 100,
        };
    }
    async getRevenueByCategory(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const orderItems = await this.prisma.order_items.findMany({
            where: {
                orders: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
            },
            include: {
                products: {
                    include: {
                        categories: true,
                    },
                },
            },
        });
        const categoryRevenue = new Map();
        orderItems.forEach(item => {
            const categoryName = item.products?.categories?.name || 'Khác';
            const revenue = (Number(item.price) * item.quantity) / 100;
            categoryRevenue.set(categoryName, (categoryRevenue.get(categoryName) || 0) + revenue);
        });
        return Array.from(categoryRevenue.entries()).map(([category, revenue]) => ({
            category,
            revenue,
        }));
    }
    async getCustomerInsights(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const [totalCustomers, newCustomers, orders] = await Promise.all([
            this.prisma.users.count({ where: { role: 'USER' } }),
            this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { gte: startDate, lte: endDate },
                },
            }),
            this.prisma.orders.findMany({
                where: { createdAt: { gte: startDate, lte: endDate } },
                include: { users: true },
            }),
        ]);
        const returningCustomers = new Set(orders.map(o => o.userId)).size;
        const avgOrderValue = orders.length > 0
            ? orders.reduce((sum, o) => sum + (o.totalCents || 0), 0) / orders.length / 100
            : 0;
        return {
            totalCustomers,
            newCustomers,
            returningCustomers,
            avgOrderValue,
            topSpenders: [],
        };
    }
    async getPerformanceMetrics(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const [orders, completedOrders, cancelledOrders] = await Promise.all([
            this.prisma.orders.count({
                where: { createdAt: { gte: startDate, lte: endDate } },
            }),
            this.prisma.orders.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
            }),
            this.prisma.orders.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: 'CANCELLED',
                },
            }),
        ]);
        const fulfillmentRate = orders > 0 ? (completedOrders / orders) * 100 : 0;
        const cancellationRate = orders > 0 ? (cancelledOrders / orders) * 100 : 0;
        const completedOrdersData = await this.prisma.orders.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['DELIVERED', 'COMPLETED'] },
            },
            select: { createdAt: true, updatedAt: true },
        });
        let avgProcessingTime = 0;
        if (completedOrdersData.length > 0) {
            const totalDays = completedOrdersData.reduce((sum, order) => {
                const diff = order.updatedAt.getTime() - order.createdAt.getTime();
                return sum + diff / (1000 * 60 * 60 * 24);
            }, 0);
            avgProcessingTime = totalDays / completedOrdersData.length;
        }
        return {
            totalOrders: orders,
            completedOrders,
            cancelledOrders,
            fulfillmentRate,
            cancellationRate,
            avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
        };
    }
    parseDateRange(range) {
        const endDate = new Date();
        const startDate = new Date();
        switch (range) {
            case '7days':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
        }
        return { startDate, endDate };
    }
    async getSalesMetrics(filters = {}) {
        const cacheKey = `sales_metrics:${JSON.stringify(filters)}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        try {
            const { startDate, endDate } = this.getDateRange(filters);
            const previousPeriod = this.getPreviousPeriod(startDate, endDate);
            const currentMetrics = await this.calculateSalesMetrics(startDate, endDate, filters);
            const previousMetrics = await this.calculateSalesMetrics(previousPeriod.start, previousPeriod.end, filters);
            const revenueGrowth = this.calculateGrowthRate(currentMetrics.totalRevenue, previousMetrics.totalRevenue);
            const orderGrowth = this.calculateGrowthRate(currentMetrics.totalOrders, previousMetrics.totalOrders);
            const topProducts = await this.getTopProductsMetrics(startDate, endDate, filters);
            const salesByPeriod = await this.getSalesByPeriod(startDate, endDate, filters);
            const result = {
                ...currentMetrics,
                revenueGrowth,
                orderGrowth,
                topProducts,
                salesByPeriod,
            };
            await this.cacheService.set(cacheKey, result, { ttl: 300 });
            return result;
        }
        catch (error) {
            this.logger.error('Failed to get sales metrics', error);
            throw error;
        }
    }
    async getCustomerMetrics(filters = {}) {
        const cacheKey = `customer_metrics:${JSON.stringify(filters)}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        try {
            const { startDate, endDate } = this.getDateRange(filters);
            const totalCustomers = await this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { lte: endDate },
                },
            });
            const newCustomers = await this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { gte: startDate, lte: endDate },
                },
            });
            const returningCustomersData = await this.prisma.users.findMany({
                where: {
                    role: 'USER',
                    orders: { some: { createdAt: { gte: startDate, lte: endDate } } },
                },
                include: {
                    _count: { select: { orders: true } },
                },
            });
            const returningCustomers = returningCustomersData.filter(customer => customer._count.orders > 1).length;
            const customerRetentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;
            const customerLifetimeValue = await this.calculateCustomerLifetimeValue(filters);
            const totalOrders = await this.prisma.orders.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                },
            });
            const averageOrdersPerCustomer = totalCustomers > 0 ? totalOrders / totalCustomers : 0;
            const customerSegments = await this.getCustomerSegments(startDate, endDate);
            const topCustomers = await this.getTopCustomers(startDate, endDate, filters);
            const result = {
                totalCustomers,
                newCustomers,
                returningCustomers,
                customerRetentionRate,
                customerLifetimeValue,
                averageOrdersPerCustomer,
                customerSegments,
                topCustomers,
            };
            await this.cacheService.set(cacheKey, result, { ttl: 300 });
            return result;
        }
        catch (error) {
            this.logger.error('Failed to get customer metrics', error);
            throw error;
        }
    }
    async getInventoryMetrics(filters = {}) {
        const cacheKey = `inventory_metrics:${JSON.stringify(filters)}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        try {
            const totalProducts = await this.prisma.products.count();
            const lowStockProducts = await this.prisma.inventory.count({
                where: { stock: { lt: 10, gt: 0 } },
            });
            const outOfStockProducts = await this.prisma.inventory.count({
                where: { stock: { lte: 0 } },
            });
            const inventoryRows = await this.prisma.inventory.findMany({
                include: { products: { select: { priceCents: true } } },
            });
            const totalInventoryValue = inventoryRows.reduce((sum, row) => sum + Number(row.products?.priceCents || 0) * row.stock, 0);
            const averageInventoryTurnover = await this.calculateInventoryTurnover(filters);
            const topSellingProducts = await this.getTopSellingProducts(filters);
            const slowMovingProducts = await this.getSlowMovingProducts(filters);
            const result = {
                totalProducts,
                lowStockProducts,
                outOfStockProducts,
                totalInventoryValue,
                averageInventoryTurnover,
                topSellingProducts,
                slowMovingProducts,
            };
            await this.cacheService.set(cacheKey, result, { ttl: 600 });
            return result;
        }
        catch (error) {
            this.logger.error('Failed to get inventory metrics', error);
            throw error;
        }
    }
    async getBusinessKPIs(filters = {}) {
        const cacheKey = `business_kpis:${JSON.stringify(filters)}`;
        const cached = await this.cacheService.get(cacheKey);
        if (cached)
            return cached;
        try {
            const { startDate, endDate } = this.getDateRange(filters);
            const monthlyRecurringRevenue = await this.calculateMRR(startDate, endDate);
            const customerAcquisitionCost = await this.calculateCAC(startDate, endDate);
            const customerLifetimeValue = await this.calculateCustomerLifetimeValue(filters);
            const churnRate = await this.calculateChurnRate(startDate, endDate);
            const netPromoterScore = 0;
            const averageResponseTime = await this.calculateAverageResponseTime(startDate, endDate);
            const orderFulfillmentRate = await this.calculateOrderFulfillmentRate(startDate, endDate);
            const returnRate = await this.calculateReturnRate(startDate, endDate);
            const profitMargin = await this.calculateProfitMargin(startDate, endDate);
            const marketingROI = await this.calculateMarketingROI(startDate, endDate);
            const result = {
                monthlyRecurringRevenue,
                customerAcquisitionCost,
                customerLifetimeValue,
                churnRate,
                netPromoterScore,
                averageResponseTime,
                orderFulfillmentRate,
                returnRate,
                profitMargin,
                marketingROI,
            };
            await this.cacheService.set(cacheKey, result, { ttl: 600 });
            return result;
        }
        catch (error) {
            this.logger.error('Failed to get business KPIs', error);
            throw error;
        }
    }
    async getDashboardData(filters = {}) {
        try {
            const [sales, customers, inventory, kpis] = await Promise.all([
                this.getSalesMetrics(filters),
                this.getCustomerMetrics(filters),
                this.getInventoryMetrics(filters),
                this.getBusinessKPIs(filters),
            ]);
            const recentActivity = await this.getRecentActivity();
            return {
                sales,
                customers,
                inventory,
                kpis,
                recentActivity,
            };
        }
        catch (error) {
            this.logger.error('Failed to get dashboard data', error);
            throw error;
        }
    }
    async exportAnalytics(type, format, filters = {}) {
        try {
            let _data;
            switch (type) {
                case 'sales':
                    _data = await this.getSalesMetrics(filters);
                    break;
                case 'customers':
                    _data = await this.getCustomerMetrics(filters);
                    break;
                case 'inventory':
                    _data = await this.getInventoryMetrics(filters);
                    break;
                case 'all':
                    _data = await this.getDashboardData(filters);
                    break;
            }
            const filename = `analytics_${type}_${Date.now()}.${format}`;
            this.logger.log(`Analytics export generated: ${filename}`);
            return filename;
        }
        catch (error) {
            this.logger.error('Failed to export analytics', error);
            throw error;
        }
    }
    getDateRange(filters) {
        const endDate = filters.endDate || new Date();
        const startDate = filters.startDate || new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        return { startDate, endDate };
    }
    getPreviousPeriod(startDate, endDate) {
        const periodLength = endDate.getTime() - startDate.getTime();
        return {
            start: new Date(startDate.getTime() - periodLength),
            end: new Date(startDate.getTime() - 1),
        };
    }
    calculateGrowthRate(current, previous) {
        if (previous === 0)
            return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
    async calculateSalesMetrics(startDate, endDate, _filters) {
        const orders = await this.prisma.orders.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
            include: {
                order_items: true,
            },
        });
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalVisitors = await this.prisma.product_views.count({
            where: { timestamp: { gte: startDate, lte: endDate } },
        });
        const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            conversionRate: Math.round(conversionRate * 100) / 100,
        };
    }
    async getTopProductsMetrics(startDate, endDate, _filters) {
        const topProducts = await this.prisma.order_items.groupBy({
            by: ['productId'],
            where: {
                orders: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                },
            },
            _sum: { quantity: true, price: true },
            orderBy: { _sum: { price: 'desc' } },
            take: 10,
        });
        const productIds = topProducts.map(p => p.productId).filter(Boolean);
        const products = await this.prisma.products.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true },
        });
        return topProducts.map(tp => {
            const product = products.find(p => p.id === tp.productId);
            return {
                id: tp.productId || 'unknown',
                name: product?.name || 'Unknown Product',
                revenue: Number(tp._sum.price || 0) / 100,
                quantity: tp._sum.quantity || 0,
                growth: 0,
            };
        });
    }
    async getSalesByPeriod(startDate, endDate, _filters) {
        const orders = await this.prisma.orders.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
            select: { createdAt: true, totalCents: true, userId: true },
        });
        const salesMap = new Map();
        orders.forEach(order => {
            const dateKey = order.createdAt.toISOString().split('T')[0];
            const existing = salesMap.get(dateKey) || {
                revenue: 0,
                orders: 0,
                customers: new Set(),
            };
            existing.revenue += order.totalCents / 100;
            existing.orders += 1;
            if (order.userId)
                existing.customers.add(order.userId);
            salesMap.set(dateKey, existing);
        });
        return Array.from(salesMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([period, data]) => ({
            period,
            revenue: data.revenue,
            orders: data.orders,
            customers: data.customers.size,
        }));
    }
    async calculateCustomerLifetimeValue(_filters) {
        const users = await this.prisma.users.findMany({
            where: { role: 'USER' },
            include: { orders: { where: { status: { in: ['COMPLETED', 'DELIVERED'] } } } },
        });
        if (users.length === 0)
            return 0;
        let totalCLV = 0;
        users.forEach(user => {
            if (user.orders.length > 0) {
                const totalSpent = user.orders.reduce((sum, o) => sum + o.totalCents, 0);
                totalCLV += totalSpent;
            }
        });
        return Math.round(totalCLV / users.length);
    }
    async getCustomerSegments(startDate, endDate) {
        const users = await this.prisma.users.findMany({
            where: { role: 'USER' },
            include: {
                orders: {
                    where: {
                        createdAt: { gte: startDate, lte: endDate },
                        status: { in: ['COMPLETED', 'DELIVERED'] },
                    },
                },
            },
        });
        const segments = {
            high: { count: 0, revenue: 0 },
            medium: { count: 0, revenue: 0 },
            low: { count: 0, revenue: 0 },
        };
        users.forEach(user => {
            const totalSpent = user.orders.reduce((sum, o) => sum + o.totalCents, 0) / 100;
            if (totalSpent >= 10000000) {
                segments.high.count++;
                segments.high.revenue += totalSpent;
            }
            else if (totalSpent >= 1000000) {
                segments.medium.count++;
                segments.medium.revenue += totalSpent;
            }
            else {
                segments.low.count++;
                segments.low.revenue += totalSpent;
            }
        });
        const total = segments.high.count + segments.medium.count + segments.low.count;
        return [
            {
                segment: 'High Value',
                count: segments.high.count,
                revenue: segments.high.revenue,
                percentage: total > 0 ? (segments.high.count / total) * 100 : 0,
            },
            {
                segment: 'Medium Value',
                count: segments.medium.count,
                revenue: segments.medium.revenue,
                percentage: total > 0 ? (segments.medium.count / total) * 100 : 0,
            },
            {
                segment: 'Low Value',
                count: segments.low.count,
                revenue: segments.low.revenue,
                percentage: total > 0 ? (segments.low.count / total) * 100 : 0,
            },
        ];
    }
    async getTopCustomers(_startDate, _endDate, _filters) {
        return [];
    }
    async calculateInventoryTurnover(_filters) {
        const [soldItems, inventoryValue] = await Promise.all([
            this.prisma.order_items.aggregate({
                where: { orders: { status: { in: ['COMPLETED', 'DELIVERED'] } } },
                _sum: { price: true },
            }),
            this.prisma.inventory.aggregate({ _sum: { stock: true } }),
        ]);
        const cogs = Number(soldItems._sum.price || 0) / 100;
        const avgInventory = (inventoryValue._sum.stock || 1) * 1000000;
        return avgInventory > 0 ? Math.round((cogs / avgInventory) * 100) / 100 : 0;
    }
    async getTopSellingProducts(_filters) {
        return [];
    }
    async getSlowMovingProducts(_filters) {
        return [];
    }
    async calculateMRR(_startDate, _endDate) {
        return 0;
    }
    async calculateCAC(_startDate, _endDate) {
        return 0;
    }
    async calculateChurnRate(_startDate, _endDate) {
        return 0;
    }
    async calculateAverageResponseTime(_startDate, _endDate) {
        return 0;
    }
    async calculateOrderFulfillmentRate(startDate, endDate) {
        const [total, fulfilled] = await Promise.all([
            this.prisma.orders.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
            this.prisma.orders.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
            }),
        ]);
        return total > 0 ? Math.round((fulfilled / total) * 10000) / 100 : 0;
    }
    async calculateReturnRate(startDate, endDate) {
        const [total, cancelled] = await Promise.all([
            this.prisma.orders.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
            this.prisma.orders.count({
                where: { createdAt: { gte: startDate, lte: endDate }, status: 'CANCELLED' },
            }),
        ]);
        return total > 0 ? Math.round((cancelled / total) * 10000) / 100 : 0;
    }
    async calculateProfitMargin(_startDate, _endDate) {
        return 25;
    }
    async calculateMarketingROI(_startDate, _endDate) {
        return 300;
    }
    async getRecentActivity() {
        const recentOrders = await this.prisma.orders.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: { orderNo: true, totalCents: true, createdAt: true, status: true },
        });
        const recentBookings = await this.prisma.service_bookings.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { services: { select: { name: true } } },
        });
        const activities = [];
        recentOrders.forEach(order => {
            activities.push({
                type: 'order',
                description: `Đơn hàng #${order.orderNo} - ${order.status}`,
                timestamp: order.createdAt,
                value: order.totalCents / 100,
            });
        });
        recentBookings.forEach(booking => {
            activities.push({
                type: 'booking',
                description: `Lịch hẹn: ${booking.services?.name || 'Dịch vụ'}`,
                timestamp: booking.createdAt,
            });
        });
        return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
    }
    async getRevenueChartData(days = 7) {
        const dates = [];
        const values = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const dayRevenue = await this.prisma.orders.aggregate({
                where: {
                    createdAt: { gte: date, lt: nextDate },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                },
                _sum: { totalCents: true },
            });
            dates.push(date.toISOString().split('T')[0]);
            values.push((dayRevenue._sum.totalCents || 0) / 100);
        }
        return { dates, values };
    }
    async getTopSellingProductsReal(limit = 5) {
        const topProducts = await this.prisma.order_items.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                price: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: limit,
        });
        const products = await this.prisma.products.findMany({
            where: {
                id: { in: topProducts.map(p => p.productId).filter(Boolean) },
            },
            include: {
                inventory: {
                    select: { stock: true },
                },
            },
        });
        return topProducts.map(tp => {
            const product = products.find(p => p.id === tp.productId);
            return {
                id: tp.productId,
                name: product?.name || 'Unknown Product',
                salesCount: tp._sum.quantity || 0,
                revenue: Number(tp._sum.price || 0) / 100,
                stock: product?.inventory?.stock || 0,
            };
        });
    }
    async getGrowthMetricsReal() {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 14);
        const [currentOrders, currentCustomers] = await Promise.all([
            this.prisma.orders.count({
                where: { createdAt: { gte: sevenDaysAgo, lte: today } },
            }),
            this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { gte: sevenDaysAgo, lte: today },
                },
            }),
        ]);
        const [previousOrders, previousCustomers] = await Promise.all([
            this.prisma.orders.count({
                where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
            }),
            this.prisma.users.count({
                where: {
                    role: 'USER',
                    createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
                },
            }),
        ]);
        return {
            ordersGrowth: this.calculateGrowthRate(currentOrders, previousOrders),
            customersGrowth: this.calculateGrowthRate(currentCustomers, previousCustomers),
        };
    }
    async getBookingsTodayReal() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const bookingsToday = await this.prisma.service_bookings.count({
            where: {
                createdAt: { gte: today, lt: tomorrow },
            },
        });
        return { bookingsToday };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map