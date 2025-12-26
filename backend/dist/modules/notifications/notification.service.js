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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("./mail.service");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(config, prisma, mailService) {
        this.config = config;
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendNotification(data) {
        this.logger.log(`Sending notification: ${data.title} to ${data.userId || data.email}`);
        const results = {};
        for (const channel of data.channels) {
            try {
                switch (channel) {
                    case 'EMAIL':
                        if (data.email) {
                            results.EMAIL = await this.sendEmail(data);
                        }
                        break;
                    case 'SMS':
                        if (data.phone) {
                            results.SMS = await this.sendSMS(data);
                        }
                        break;
                    case 'PUSH':
                        if (data.userId) {
                            results.PUSH = await this.sendPushNotification(data);
                        }
                        break;
                    case 'WEBSOCKET':
                        if (data.userId) {
                            results.WEBSOCKET = await this.sendWebSocketNotification(data);
                        }
                        break;
                }
            }
            catch (error) {
                this.logger.error(`Failed to send ${channel} notification:`, error);
                results[channel] = false;
            }
        }
        await this.logNotification(data, results);
    }
    async sendEmail(data) {
        if (!data.email)
            return false;
        try {
            switch (data.type) {
                case 'WELCOME':
                    await this.mailService.sendWelcomeEmail(data.email, data.title);
                    break;
                case 'ORDER':
                    if (data.data?.orderData) {
                        if (data.data.isConfirmation) {
                            await this.mailService.sendOrderConfirmation(data.email, data.data.orderData);
                        }
                        else {
                            await this.mailService.sendOrderStatusUpdate(data.email, data.data.orderData);
                        }
                    }
                    else {
                        await this.mailService.send(data.email, data.title, data.message);
                    }
                    break;
                default:
                    await this.mailService.send(data.email, data.title, data.message);
            }
            return true;
        }
        catch (error) {
            this.logger.error('Email sending failed:', error);
            return false;
        }
    }
    async sendSMS(data) {
        if (!data.phone)
            return false;
        this.logger.log(`SMS would be sent to ${data.phone}: ${data.message}`);
        return true;
    }
    async sendPushNotification(data) {
        if (!data.userId)
            return false;
        this.logger.log(`Push notification would be sent to user ${data.userId}: ${data.message}`);
        return true;
    }
    async sendWebSocketNotification(data) {
        if (!data.userId)
            return false;
        try {
            this.logger.log(`WebSocket notification would be sent to user ${data.userId}: ${data.title}`);
            return true;
        }
        catch (error) {
            this.logger.error('WebSocket notification failed:', error);
            return false;
        }
    }
    async logNotification(data, results) {
        try {
            this.logger.log(`Notification sent - Success: ${JSON.stringify(results)}`);
        }
        catch (error) {
            this.logger.error('Failed to log notification:', error);
        }
    }
    async sendOrderConfirmation(userId, email, orderData) {
        await this.sendNotification({
            userId,
            email,
            title: `Xác nhận đơn hàng #${orderData.orderNo}`,
            message: `Đơn hàng của bạn đã được xác nhận và đang được xử lý.`,
            type: 'ORDER',
            priority: 'HIGH',
            channels: ['EMAIL', 'WEBSOCKET'],
            data: { orderData, isConfirmation: true },
        });
    }
    async sendOrderStatusUpdate(userId, email, orderData) {
        await this.sendNotification({
            userId,
            email,
            title: `Cập nhật đơn hàng #${orderData.orderNo}`,
            message: `Đơn hàng của bạn đã chuyển sang trạng thái ${orderData.status}.`,
            type: 'ORDER',
            priority: 'MEDIUM',
            channels: ['EMAIL', 'WEBSOCKET'],
            data: { orderData, isConfirmation: false },
        });
    }
    async sendWelcomeNotification(userId, email, customerName) {
        await this.sendNotification({
            userId,
            email,
            title: customerName,
            message: 'Chào mừng bạn đến với Audio Tài Lộc!',
            type: 'WELCOME',
            priority: 'LOW',
            channels: ['EMAIL'],
            data: { customerName },
        });
    }
    async sendPromotionNotification(userId, email, promotion) {
        await this.sendNotification({
            userId,
            email,
            title: promotion.title,
            message: promotion.description,
            type: 'PROMOTION',
            priority: 'MEDIUM',
            channels: ['EMAIL', 'WEBSOCKET'],
            data: { promotion },
        });
    }
    async sendSystemNotification(message, _priority = 'MEDIUM') {
        this.logger.log(`System notification would be broadcasted: ${message}`);
    }
    async sendBulkNotification(userIds, data) {
        const promises = userIds.map(async (userId) => {
            const user = await this.prisma.users.findUnique({
                where: { id: userId },
                select: { email: true, phone: true },
            });
            if (user) {
                await this.sendNotification({
                    ...data,
                    userId,
                    email: user.email,
                    phone: user.phone || undefined,
                });
            }
        });
        await Promise.allSettled(promises);
        this.logger.log(`Bulk notification sent to ${userIds.length} users`);
    }
    async sendMarketingEmail(emails, subject, htmlContent, textContent) {
        const promises = emails.map(email => this.mailService.send(email, subject, textContent || htmlContent, htmlContent));
        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        this.logger.log(`Marketing email sent - Success: ${successful}, Failed: ${failed}`);
    }
    async listNotifications(userId, options = {}) {
        const page = Math.max(1, Math.floor(options.page ?? 1));
        const limit = Math.min(100, Math.max(1, Math.floor(options.limit ?? 20)));
        const where = { userId };
        if (typeof options.read === 'boolean')
            where.read = options.read;
        const notificationsModel = this.prisma.notifications || this.prisma.notification;
        if (!notificationsModel) {
            this.logger.error('Prisma notifications model is undefined - returning empty list');
            return {
                notifications: [],
                pagination: { page, limit, total: 0, totalPages: 0 },
            };
        }
        const [items, total] = await Promise.all([
            notificationsModel.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            notificationsModel.count({ where }),
        ]);
        return {
            notifications: items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createNotification(notification) {
        const notificationsModel = this.prisma.notifications || this.prisma.notification;
        if (!notificationsModel) {
            this.logger.error('Prisma notifications model is undefined - cannot create notification');
            throw new Error('Notifications store unavailable');
        }
        return notificationsModel.create({
            data: {
                userId: notification.userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                data: notification.data,
                isRead: false,
                updatedAt: new Date(),
            },
        });
    }
    async getPendingNotifications(userId) {
        const notificationsModel = this.prisma.notifications || this.prisma.notification;
        if (!notificationsModel) {
            return [];
        }
        return notificationsModel.findMany({
            where: { userId, isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(notificationId, userId) {
        const notificationsModel = this.prisma.notifications || this.prisma.notification;
        if (!notificationsModel) {
            this.logger.error('Prisma notifications model is undefined - cannot mark as read');
            return { count: 0 };
        }
        return notificationsModel.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true, readAt: new Date(), updatedAt: new Date() },
        });
    }
    async markAllAsRead(userId) {
        const notificationsModel = this.prisma.notifications || this.prisma.notification;
        if (!notificationsModel) {
            this.logger.error('Prisma notifications model is undefined - cannot mark all as read');
            return { count: 0 };
        }
        return notificationsModel.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date(), updatedAt: new Date() },
        });
    }
    async getNotificationStats(userId) {
        const notificationsModel = this.prisma.notifications || this.prisma.notification;
        if (!notificationsModel) {
            return { total: 0, unread: 0, read: 0, unreadPercentage: 0 };
        }
        const total = await notificationsModel.count({ where: { userId } });
        const unread = await notificationsModel.count({ where: { userId, isRead: false } });
        const read = await notificationsModel.count({ where: { userId, isRead: true } });
        const unreadPercentage = total > 0 ? Math.round((unread / total) * 100) : 0;
        return { total, unread, read, unreadPercentage };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map