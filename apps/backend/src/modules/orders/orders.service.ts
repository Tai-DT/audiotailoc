import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
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
  constructor(private readonly prisma: PrismaService, private readonly gateway: OrdersGateway, private readonly mail: MailService) {}

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
    const updated = await this.prisma.order.update({ where: { id }, data: { status: status as any } });
    this.gateway.emitUpdate({ id, status });
    // Send notification email if we have the user's email
    if (order.userId) {
      try {
        const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
        if (user?.email) await this.mail.send(user.email, 'Cập nhật đơn hàng', `Đơn hàng ${order.orderNo} chuyển sang trạng thái ${status}`);
      } catch {}
    }
    return updated;
  }
}
