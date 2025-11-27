import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async findAll(userId: string, query: { limit?: number; offset?: number; isRead?: boolean }) {
    const { limit = 50, offset = 0, isRead } = query;
    const where: any = { userId };

    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notifications.count({ where }),
    ]);

    return {
      data: notifications,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async create(data: { userId: string; title: string; message: string; type: string; data?: any }) {
    const notification = await this.prisma.notifications.create({
      data: {
        id: randomUUID(),
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        data: data.data || {},
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Push to realtime gateway
    this.realtimeGateway.notifyUserEvent(data.userId, 'new', notification);

    return notification;
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notifications.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Push update to realtime gateway
    this.realtimeGateway.notifyUserEvent(userId, 'update', updated);

    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notifications.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { message: 'All notifications marked as read' };
  }

  async delete(id: string, userId: string) {
    const notification = await this.prisma.notifications.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notifications.delete({
      where: { id },
    });

    return { message: 'Notification deleted' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notifications.count({
      where: { userId, isRead: false },
    });
    return { count };
  }
}
