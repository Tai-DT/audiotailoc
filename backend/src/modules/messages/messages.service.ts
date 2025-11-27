import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateMessageDto, UpdateMessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page: number; pageSize: number; userId?: string; status?: string }) {
    const skip = (params.page - 1) * params.pageSize;

    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.status) where.status = params.status;

    const [messages, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where,
        skip,
        take: params.pageSize,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notifications.count({ where }),
    ]);

    return {
      data: messages,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    };
  }

  async findById(id: string) {
    const message = await this.prisma.notifications.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async findByUserId(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [messages, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notifications.count({ where: { userId } }),
    ]);

    return {
      data: messages,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(createMessageDto: CreateMessageDto) {
    if (!createMessageDto.userId) {
      throw new BadRequestException('userId is required');
    }

    if (!createMessageDto.subject || !createMessageDto.content) {
      throw new BadRequestException('subject and content are required');
    }

    const message = await this.prisma.notifications.create({
      data: {
        id: randomUUID(),
        userId: createMessageDto.userId,
        type: createMessageDto.type || 'MESSAGE',
        title: createMessageDto.subject,
        message: createMessageDto.content,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Message created: ${message.id}`);
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.findById(id);

    const updated = await this.prisma.notifications.update({
      where: { id },
      data: {
        title: updateMessageDto.subject ?? message.title,
        message: updateMessageDto.content ?? message.message,
        updatedAt: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Message updated: ${id}`);
    return updated;
  }

  async updateStatus(id: string, status: string) {
    const message = await this.findById(id);

    const updated = await this.prisma.notifications.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Message status updated: ${id} -> ${status}`);
    return updated;
  }

  async markAsRead(id: string) {
    const message = await this.findById(id);

    const updated = await this.prisma.notifications.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Message marked as read: ${id}`);
    return updated;
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.notifications.delete({
      where: { id },
    });

    this.logger.log(`Message deleted: ${id}`);
    return { message: 'Message deleted successfully' };
  }
}
