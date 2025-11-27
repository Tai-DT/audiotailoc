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
        const [pageViews] = await Promise.all([
            this.prisma.product_views.count({
                where: { timestamp: { gte: startDate, lte: endDate } },
            }),
        ]);
        const sessions = await this.prisma.activity_logs.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: startDate, lte: endDate },
                action: 'LOGIN',
            },
            _count: true,
        });
        const activityLogRecords = await this.prisma.activity_logs.findMany({
            where: { createdAt: { gte: startDate, lte: endDate } },
            select: { duration: true },
        });
        const avgSessionDuration = activityLogRecords.length > 0
            ? activityLogRecords.reduce((sum, log) => sum + (log.duration || 0), 0) /
                activityLogRecords.length
            : 0;
        return {
            pageViews,
            sessions: sessions.length,
            avgSessionDuration: avgSessionDuration / 1000,
            bounceRate: 0.32,
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
        const [totalCustomers, newCustomers, orders, topSpendersAgg, users] = await Promise.all([
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
            this.prisma.orders.groupBy({
                by: ['userId'],
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                    userId: { not: null },
                },
                _sum: { totalCents: true },
                orderBy: { _sum: { totalCents: 'desc' } },
                take: 5,
            }),
            this.prisma.users.findMany({
                where: { role: 'USER' },
                select: { id: true, email: true, name: true },
            }),
        ]);
        const returningCustomers = new Set(orders.map(o => o.userId)).size;
        const avgOrderValue = orders.length > 0
            ? orders.reduce((sum, o) => sum + (o.totalCents || 0), 0) / orders.length / 100
            : 0;
        const topSpenders = topSpendersAgg.map(spender => {
            const user = users.find(u => u.id === spender.userId);
            return {
                id: spender.userId,
                email: user?.email || 'unknown',
                name: user?.name || user?.email || 'Khách hàng',
                totalSpent: Number(spender._sum.totalCents || 0) / 100,
            };
        });
        return {
            totalCustomers,
            newCustomers,
            returningCustomers,
            avgOrderValue,
            topSpenders,
        };
    }
    async getPerformanceMetrics(range = '7days') {
        const { startDate, endDate } = this.parseDateRange(range);
        const [orders, completedOrders, cancelledOrders, completedOrderList] = await Promise.all([
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
            this.prisma.orders.findMany({
                where: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['DELIVERED', 'COMPLETED'] },
                },
                select: { createdAt: true, updatedAt: true },
            }),
        ]);
        const fulfillmentRate = orders > 0 ? (completedOrders / orders) * 100 : 0;
        const cancellationRate = orders > 0 ? (cancelledOrders / orders) * 100 : 0;
        const avgProcessingTime = completedOrderList.length
            ? completedOrderList.reduce((sum, o) => {
                const start = new Date(o.createdAt).getTime();
                const end = new Date(o.updatedAt).getTime();
                if (!start || !end || end < start)
                    return sum;
                return sum + (end - start);
            }, 0) /
                completedOrderList.length /
                (1000 * 60 * 60 * 24)
            : 0;
        return {
            totalOrders: orders,
            completedOrders,
            cancelledOrders,
            fulfillmentRate,
            cancellationRate,
            avgProcessingTime,
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
        const conversionRate = 2.5;
        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            conversionRate,
        };
    }
    async getTopProductsMetrics(startDate, endDate, _filters) {
        const currentTop = await this.prisma.order_items.groupBy({
            by: ['productId'],
            where: {
                orders: {
                    createdAt: { gte: startDate, lte: endDate },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                },
            },
            _sum: { quantity: true, price: true },
            orderBy: { _sum: { price: 'desc' } },
            take: 5,
        });
        const prevPeriod = this.getPreviousPeriod(startDate, endDate);
        const prevTop = await this.prisma.order_items.groupBy({
            by: ['productId'],
            where: {
                orders: {
                    createdAt: { gte: prevPeriod.start, lte: prevPeriod.end },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                },
            },
            _sum: { quantity: true, price: true },
        });
        const prevRevenueMap = new Map();
        prevTop.forEach(p => {
            prevRevenueMap.set(p.productId, Number(p._sum.price || 0));
        });
        const products = await this.prisma.products.findMany({
            where: { id: { in: currentTop.map(p => p.productId).filter(Boolean) } },
            select: { id: true, name: true },
        });
        return currentTop.map(p => {
            const product = products.find(prod => prod.id === p.productId);
            const revenue = Number(p._sum.price || 0);
            const prevRevenue = prevRevenueMap.get(p.productId) || 0;
            return {
                id: p.productId,
                name: product?.name || 'Unknown',
                revenue: revenue / 100,
                quantity: p._sum.quantity || 0,
                growth: this.calculateGrowthRate(revenue, prevRevenue),
            };
        });
    }
    async getSalesByPeriod(startDate, endDate, _filters) {
        const orders = await this.prisma.orders.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
            select: {
                createdAt: true,
                totalCents: true,
                userId: true,
            },
        });
        const periodMap = new Map();
        const dayMs = 24 * 60 * 60 * 1000;
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs);
        const shouldFillGaps = totalDays <= 90;
        if (shouldFillGaps) {
            for (let i = 0; i < totalDays; i++) {
                const date = new Date(startDate.getTime() + i * dayMs);
                const key = date.toISOString().split('T')[0];
                periodMap.set(key, { revenue: 0, orders: 0, customerSet: new Set() });
            }
        }
        for (const order of orders) {
            const dateKey = order.createdAt.toISOString().split('T')[0];
            if (!periodMap.has(dateKey)) {
                if (!shouldFillGaps) {
                    periodMap.set(dateKey, { revenue: 0, orders: 0, customerSet: new Set() });
                }
                else {
                    continue;
                }
            }
            const entry = periodMap.get(dateKey);
            if (entry) {
                entry.revenue += order.totalCents;
                entry.orders += 1;
                if (order.userId) {
                    entry.customerSet.add(order.userId);
                }
            }
        }
        const results = Array.from(periodMap.entries()).map(([period, data]) => ({
            period,
            revenue: data.revenue / 100,
            orders: data.orders,
            customers: data.customerSet.size,
        }));
        return results.sort((a, b) => a.period.localeCompare(b.period));
    }
    async calculateCustomerLifetimeValue(_filters) {
        const [revenueAgg, totalOrders, uniqueCustomers] = await Promise.all([
            this.prisma.orders.aggregate({
                _sum: { totalCents: true },
                where: { status: { in: ['COMPLETED', 'DELIVERED'] } },
            }),
            this.prisma.orders.count({
                where: { status: { in: ['COMPLETED', 'DELIVERED'] } },
            }),
            this.prisma.orders.findMany({
                where: { status: { in: ['COMPLETED', 'DELIVERED'] }, userId: { not: null } },
                select: { userId: true },
                distinct: ['userId'],
            }),
        ]);
        const totalRevenue = (revenueAgg._sum.totalCents || 0) / 100;
        const customers = uniqueCustomers.length || 1;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const purchaseFrequency = totalOrders > 0 ? totalOrders / customers : 0;
        return averageOrderValue * purchaseFrequency;
    }
    async getCustomerSegments(startDate, endDate) {
        const customerSpend = await this.prisma.orders.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
                userId: { not: null },
            },
            _sum: { totalCents: true },
        });
        const segments = {
            'High Value': { count: 0, revenue: 0 },
            'Medium Value': { count: 0, revenue: 0 },
            'Low Value': { count: 0, revenue: 0 },
        };
        customerSpend.forEach(c => {
            const spent = Number(c._sum.totalCents || 0);
            if (spent >= 10_000_000) {
                segments['High Value'].count += 1;
                segments['High Value'].revenue += spent;
            }
            else if (spent >= 2_000_000) {
                segments['Medium Value'].count += 1;
                segments['Medium Value'].revenue += spent;
            }
            else {
                segments['Low Value'].count += 1;
                segments['Low Value'].revenue += spent;
            }
        });
        const totalRevenue = Object.values(segments).reduce((sum, seg) => sum + seg.revenue, 0) || 1;
        return Object.entries(segments).map(([segment, data]) => ({
            segment,
            count: data.count,
            revenue: data.revenue / 100,
            percentage: (data.revenue / totalRevenue) * 100,
        }));
    }
    async getTopCustomers(startDate, endDate, _filters) {
        const top = await this.prisma.orders.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
                userId: { not: null },
            },
            _sum: { totalCents: true },
            _count: { _all: true },
            orderBy: { _sum: { totalCents: 'desc' } },
            take: 5,
        });
        const users = await this.prisma.users.findMany({
            where: { id: { in: top.map(t => t.userId).filter(Boolean) } },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        return top.map(t => {
            const user = users.find(u => u.id === t.userId);
            return {
                id: t.userId,
                email: user?.email || 'unknown',
                totalSpent: Number(t._sum.totalCents || 0) / 100,
                orderCount: t._count._all || 0,
                lastOrderDate: user?.createdAt || new Date(),
            };
        });
    }
    async calculateInventoryTurnover(_filters) {
        const inventoryRows = await this.prisma.inventory.findMany({
            include: { products: { select: { priceCents: true } } },
        });
        const inventoryValue = inventoryRows.reduce((sum, row) => sum + Number(row.products?.priceCents || 0) * row.stock, 0);
        const salesAgg = await this.prisma.orders.aggregate({
            _sum: { totalCents: true },
            where: { status: { in: ['COMPLETED', 'DELIVERED'] } },
        });
        const cogs = Number(salesAgg._sum.totalCents || 0);
        if (!inventoryValue)
            return 0;
        return cogs / inventoryValue;
    }
    async getTopSellingProducts(_filters) {
        const topProducts = await this.prisma.order_items.groupBy({
            by: ['productId'],
            _sum: { quantity: true, price: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
        });
        const products = await this.prisma.products.findMany({
            where: { id: { in: topProducts.map(p => p.productId).filter(Boolean) } },
            include: { inventory: { select: { stock: true } } },
        });
        return topProducts.map(tp => {
            const product = products.find(p => p.id === tp.productId);
            return {
                id: tp.productId,
                name: product?.name || 'Unknown Product',
                quantitySold: tp._sum.quantity || 0,
                revenue: Number(tp._sum.price || 0) / 100,
                stockLevel: product?.inventory?.stock || 0,
            };
        });
    }
    async getSlowMovingProducts(_filters) {
        const productsWithStock = await this.prisma.products.findMany({
            where: { inventory: { stock: { gt: 0 } } },
            select: {
                id: true,
                name: true,
                inventory: { select: { stock: true } },
            },
        });
        const latestSales = await this.prisma.order_items.groupBy({
            by: ['productId'],
            _max: { createdAt: true },
        });
        const latestSaleMap = new Map();
        latestSales.forEach(row => {
            if (row._max.createdAt)
                latestSaleMap.set(row.productId, row._max.createdAt);
        });
        const now = Date.now();
        return productsWithStock
            .map(p => {
            const lastSale = latestSaleMap.get(p.id);
            const daysSinceLastSale = lastSale
                ? Math.floor((now - lastSale.getTime()) / (1000 * 60 * 60 * 24))
                : 999;
            return {
                id: p.id,
                name: p.name,
                daysSinceLastSale,
                stockLevel: p.inventory?.stock ?? 0,
                value: 0,
            };
        })
            .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale)
            .slice(0, 5);
    }
    async calculateMRR(_startDate, _endDate) {
        const start = new Date();
        start.setDate(start.getDate() - 30);
        const revenue = await this.prisma.orders.aggregate({
            _sum: { totalCents: true },
            where: { createdAt: { gte: start }, status: { in: ['COMPLETED', 'DELIVERED'] } },
        });
        return (revenue._sum.totalCents || 0) / 100;
    }
    async calculateCAC(_startDate, _endDate) {
        const customers = await this.prisma.users.count({
            where: { role: 'USER', createdAt: { gte: _startDate, lte: _endDate } },
        });
        const revenue = await this.prisma.orders.aggregate({
            _sum: { totalCents: true },
            where: {
                createdAt: { gte: _startDate, lte: _endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
        });
        if (!customers)
            return 0;
        return (revenue._sum.totalCents || 0) / 100 / customers;
    }
    async calculateChurnRate(_startDate, _endDate) {
        const activeUsers = await this.prisma.users.count({ where: { role: 'USER' } });
        if (!activeUsers)
            return 0;
        const usersWithOrders = await this.prisma.orders.findMany({
            where: { createdAt: { gte: _startDate, lte: _endDate }, userId: { not: null } },
            select: { userId: true },
            distinct: ['userId'],
        });
        const retained = usersWithOrders.length;
        const churned = Math.max(activeUsers - retained, 0);
        return (churned / activeUsers) * 100;
    }
    async calculateAverageResponseTime(_startDate, _endDate) {
        const logs = await this.prisma.activity_logs.findMany({
            where: { createdAt: { gte: _startDate, lte: _endDate }, duration: { not: null } },
            select: { duration: true },
        });
        if (!logs.length)
            return 0;
        const total = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
        return total / logs.length;
    }
    async calculateOrderFulfillmentRate(_startDate, _endDate) {
        const [total, fulfilled] = await Promise.all([
            this.prisma.orders.count({
                where: { createdAt: { gte: _startDate, lte: _endDate } },
            }),
            this.prisma.orders.count({
                where: {
                    createdAt: { gte: _startDate, lte: _endDate },
                    status: { in: ['COMPLETED', 'DELIVERED'] },
                },
            }),
        ]);
        if (!total)
            return 0;
        return (fulfilled / total) * 100;
    }
    async calculateReturnRate(_startDate, _endDate) {
        const [cancelled, total] = await Promise.all([
            this.prisma.orders.count({
                where: { createdAt: { gte: _startDate, lte: _endDate }, status: 'CANCELLED' },
            }),
            this.prisma.orders.count({
                where: { createdAt: { gte: _startDate, lte: _endDate } },
            }),
        ]);
        if (!total)
            return 0;
        return (cancelled / total) * 100;
    }
    async calculateProfitMargin(_startDate, _endDate) {
        const revenue = await this.prisma.orders.aggregate({
            _sum: { totalCents: true },
            where: {
                createdAt: { gte: _startDate, lte: _endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
        });
        const revenueValue = (revenue._sum.totalCents || 0) / 100;
        const estimatedCost = revenueValue * 0.8;
        if (!revenueValue)
            return 0;
        return ((revenueValue - estimatedCost) / revenueValue) * 100;
    }
    async calculateMarketingROI(_startDate, _endDate) {
        const revenue = await this.prisma.orders.aggregate({
            _sum: { totalCents: true },
            where: {
                createdAt: { gte: _startDate, lte: _endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
        });
        const revenueValue = (revenue._sum.totalCents || 0) / 100;
        if (!revenueValue)
            return 0;
        const spend = revenueValue * 0.05 || 1;
        return ((revenueValue - spend) / spend) * 100;
    }
    async getRecentActivity() {
        return [
            {
                type: 'order',
                description: 'New order #12345',
                timestamp: new Date(),
                value: 1500000,
            },
        ];
    }
    async getRevenueChartData(days = 7) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);
        startDate.setHours(0, 0, 0, 0);
        const orders = await this.prisma.orders.findMany({
            where: {
                createdAt: { gte: startDate, lte: endDate },
                status: { in: ['COMPLETED', 'DELIVERED'] },
            },
            select: {
                createdAt: true,
                totalCents: true,
            },
        });
        const revenueMap = new Map();
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const key = date.toISOString().split('T')[0];
            revenueMap.set(key, 0);
        }
        for (const order of orders) {
            const dateKey = order.createdAt.toISOString().split('T')[0];
            if (revenueMap.has(dateKey)) {
                revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + order.totalCents);
            }
        }
        const dates = [];
        const values = [];
        for (const [date, cents] of revenueMap.entries()) {
            dates.push(date);
            values.push(cents / 100);
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