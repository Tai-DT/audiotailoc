import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';

const allowedTransitions: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELED'],
  PAID: ['FULFILLED', 'REFUNDED'],
  FULFILLED: [],
  CANCELED: [],
  REFUNDED: [],
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  list(params: { page?: number; pageSize?: number; status?: string }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = {};
    if (params.status) where.status = params.status;
    return this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    ]).then(([total, items]) => ({ total, page, pageSize, items }));
  }

  async get(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true, payments: true } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.get(id);
    const nexts = allowedTransitions[order.status] || [];
    if (!nexts.includes(status)) throw new BadRequestException('Trạng thái không hợp lệ');
    const updated = await this.prisma.order.update({ where: { id }, data: { status } });

    // Send notification email if we have the user's email
    if (order.userId) {
      try {
        const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
        if (user?.email) {
          // Get order with items for email template
          const orderWithItems = await this.prisma.order.findUnique({
            where: { id: order.id },
            include: { items: true }
          });

          if (orderWithItems) {
            const orderData = {
              orderNo: order.orderNo,
              customerName: user.name || user.email,
              totalAmount: `${(order.totalCents / 100).toLocaleString('vi-VN')} VNĐ`,
              items: orderWithItems.items.map((item: any) => ({
                name: item.name || 'Sản phẩm',
                quantity: item.quantity,
                price: `${(item.unitPrice / 100).toLocaleString('vi-VN')} VNĐ`
              })),
              status: status
            };

            await this.mail.sendOrderStatusUpdate(user.email, orderData);
          }
        }
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    return updated;
  }

  async create(orderData: any): Promise<any> {
    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNo = `ORD${timestamp}${random}`;
    
    // Calculate totals
    let subtotalCents = 0;
    const items = orderData.items || [];
    
    for (const item of items) {
      // Get product price if not provided
      if (!item.unitPrice && item.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId }
        });
        if (product) {
          item.unitPrice = product.priceCents;
        }
      }
      subtotalCents += (item.unitPrice || 0) * (item.quantity || 1);
    }

    try {
      const shippingAddress = typeof orderData.shippingAddress === 'string'
        ? orderData.shippingAddress
        : (orderData.shippingAddress ? JSON.stringify(orderData.shippingAddress) : null);

      const order = await this.prisma.order.create({
        data: {
          orderNo,
          userId: orderData.userId || null,
          status: 'PENDING',
          subtotalCents,
          totalCents: subtotalCents,
          shippingAddress,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              name: item.name || 'Sản phẩm',
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || 0
            }))
          }
        },
        include: { items: true }
      });

      return order;
            } catch (error: any) {
          if (error.code === 'P2002' && error.meta?.target?.includes('orderNo')) {
        // Retry with different order number if duplicate
        return this.create(orderData);
      }
      throw error;
    }
  }
}
