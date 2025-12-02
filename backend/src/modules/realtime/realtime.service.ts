import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from './realtime.gateway';

/**
 * Real-time Service
 * Manages real-time events and notifications
 */

export interface RealtimeEvent {
  id: string;
  type: string;
  userId: string;
  data: any;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);
  private gateway: RealtimeGateway;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Set the WebSocket gateway
   */
  setGateway(gateway: RealtimeGateway) {
    this.gateway = gateway;
  }

  /**
   * Emit order status update
   */
  async notifyOrderStatusChange(orderId: string, newStatus: string, userId: string) {
    try {
      const order = await this.prisma.orders.findUnique({
        where: { id: orderId },
        include: {
          order_items: true,
          users: { select: { id: true, email: true } },
        },
      });

      if (!order) {
        this.logger.warn(`Order ${orderId} not found`);
        return;
      }

      const updateData = {
        orderId,
        status: newStatus,
        data: {
          total: order.totalCents,
          itemCount: order.order_items.length,
          customerEmail: order.users?.email,
        },
      };

      // Emit to order subscribers
      if (this.gateway) {
        this.gateway.emitOrderUpdate(orderId, newStatus, updateData.data);

        // Notify customer if different from current user
        if (order.userId !== userId) {
          this.gateway.notifyUserEvent(order.userId, 'order_updated', {
            orderId,
            status: newStatus,
            timestamp: new Date().toISOString(),
          });
        }
      }

      this.logger.log(`Order ${orderId} status changed to ${newStatus}`);
    } catch (error) {
      this.logger.error(`Failed to notify order status change for ${orderId}:`, error);
    }
  }

  /**
   * Emit booking status update
   */
  async notifyBookingStatusChange(bookingId: string, newStatus: string, userId: string) {
    try {
      const booking = await this.prisma.service_bookings.findUnique({
        where: { id: bookingId },
        include: {
          services: { select: { name: true } },
          users: { select: { id: true, email: true } },
        },
      });

      if (!booking) {
        this.logger.warn(`Booking ${bookingId} not found`);
        return;
      }

      const updateData = {
        bookingId,
        status: newStatus,
        data: {
          serviceName: booking.services.name,
          scheduledDate: booking.scheduledAt,
          customerEmail: booking.users?.email,
        },
      };

      // Emit to booking subscribers
      if (this.gateway) {
        this.gateway.emitBookingUpdate(bookingId, newStatus, updateData.data);

        // Notify customer if different from current user
        if (booking.userId !== userId) {
          this.gateway.notifyUserEvent(booking.userId, 'booking_updated', {
            bookingId,
            status: newStatus,
            serviceName: booking.services.name,
            timestamp: new Date().toISOString(),
          });
        }
      }

      this.logger.log(`Booking ${bookingId} status changed to ${newStatus}`);
    } catch (error) {
      this.logger.error(`Failed to notify booking status change for ${bookingId}:`, error);
    }
  }

  /**
   * Create chat message
   */
  async createChatMessage(
    userId: string,
    conversationId: string,
    message: string,
  ): Promise<ChatMessage> {
    try {
      if (!message || message.trim().length === 0) {
        throw new BadRequestException('Message cannot be empty');
      }

      if (message.length > 5000) {
        throw new BadRequestException('Message is too long (max 5000 characters)');
      }

      // Note: This assumes you have a ChatMessage model in Prisma
      // If not, adjust according to your actual schema
      const chatMessage = {
        id: `chat_${Date.now()}`,
        conversationId,
        userId,
        message: message.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // In production, save to database:
      // const savedMessage = await this.prisma.chatMessage.create({
      //   data: chatMessage,
      // });

      this.logger.log(`Chat message created for conversation ${conversationId}`);
      return chatMessage;
    } catch (error) {
      this.logger.error('Failed to create chat message:', error);
      throw error;
    }
  }

  /**
   * Notify inventory alert
   */
  async notifyInventoryAlert(productId: string, currentStock: number, alertThreshold: number) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id: productId },
        select: { id: true, name: true, slug: true },
      });

      if (!product) {
        this.logger.warn(`Product ${productId} not found`);
        return;
      }

      if (this.gateway) {
        this.gateway.broadcastEvent('inventory:alert', {
          productId,
          productName: product.name,
          currentStock,
          threshold: alertThreshold,
          timestamp: new Date().toISOString(),
        });
      }

      this.logger.log(`Inventory alert for ${product.name}: ${currentStock} units (threshold: ${alertThreshold})`);
    } catch (error) {
      this.logger.error(`Failed to notify inventory alert for ${productId}:`, error);
    }
  }

  /**
   * Notify payment received
   */
  async notifyPaymentReceived(orderId: string, amount: number, userId: string) {
    try {
      const order = await this.prisma.orders.findUnique({
        where: { id: orderId },
        include: { users: { select: { id: true, email: true } } },
      });

      if (!order) {
        this.logger.warn(`Order ${orderId} not found`);
        return;
      }

      const paymentData = {
        orderId,
        amount: amount / 100, // Convert from cents
        paymentDate: new Date().toISOString(),
      };

      if (this.gateway) {
        // Notify customer
        this.gateway.notifyUserEvent(order.userId, 'payment_received', paymentData);

        // Broadcast to order subscribers
        this.gateway.emitOrderUpdate(orderId, 'payment_received', paymentData);
      }

      this.logger.log(`Payment received for order ${orderId}: ${amount / 100}`);
    } catch (error) {
      this.logger.error(`Failed to notify payment for ${orderId}:`, error);
    }
  }

  /**
   * Notify new review
   */
  async notifyNewReview(productId: string, rating: number, comment: string) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id: productId },
        select: { id: true, name: true, slug: true },
      });

      if (!product) {
        this.logger.warn(`Product ${productId} not found`);
        return;
      }

      if (this.gateway) {
        this.gateway.broadcastEvent('product:review_added', {
          productId,
          productName: product.name,
          rating,
          excerpt: comment.substring(0, 100),
          timestamp: new Date().toISOString(),
        });
      }

      this.logger.log(`New review for ${product.name}: ${rating} stars`);
    } catch (error) {
      this.logger.error(`Failed to notify review for ${productId}:`, error);
    }
  }

  /**
   * Notify product availability change
   */
  async notifyProductAvailability(productId: string, isAvailable: boolean) {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id: productId },
        select: { id: true, name: true, slug: true, stockQuantity: true },
      });

      if (!product) {
        this.logger.warn(`Product ${productId} not found`);
        return;
      }

      if (this.gateway) {
        this.gateway.broadcastEvent('product:availability_changed', {
          productId,
          productName: product.name,
          isAvailable,
          stock: product.stockQuantity,
          timestamp: new Date().toISOString(),
        });
      }

      this.logger.log(`Product ${product.name} availability changed to ${isAvailable}`);
    } catch (error) {
      this.logger.error(`Failed to notify product availability for ${productId}:`, error);
    }
  }

  /**
   * Get realtime statistics
   */
  getRealtimeStats() {
    if (!this.gateway) {
      return {
        connectedUsers: 0,
        connectedUserIds: [],
      };
    }

    return {
      connectedUsers: this.gateway.getConnectedUserCount(),
      connectedUserIds: this.gateway.getConnectedUserIds(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Notify user directly
   */
  notifyUser(userId: string, message: any) {
    if (this.gateway) {
      this.gateway.notifyUserMessage(userId, message);
      this.logger.debug(`Direct notification sent to user ${userId}`);
    }
  }

  /**
   * Notify multiple users
   */
  notifyUsers(userIds: string[], message: any) {
    if (this.gateway) {
      for (const userId of userIds) {
        this.gateway.notifyUserMessage(userId, message);
      }
      this.logger.debug(`Notifications sent to ${userIds.length} users`);
    }
  }

  /**
   * Broadcast to all connected users
   */
  broadcastToAll(event: string, data: any) {
    if (this.gateway) {
      this.gateway.broadcastEvent(event, data);
      this.logger.debug(`Broadcast sent to all connected users: ${event}`);
    }
  }
}
