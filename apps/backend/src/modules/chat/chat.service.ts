import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listSessions(params: { status?: 'OPEN' | 'ESCALATED' | 'CLOSED'; page?: number; pageSize?: number }) {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 20)));
    const where: any = params.status ? { status: params.status } : {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.chatSession.count({ where }),
      this.prisma.chatSession.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    ]);
    return { total, page, pageSize, items };
  }

  async getSession(id: string) {
    const s = await this.prisma.chatSession.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
    if (!s) throw new NotFoundException('Không tìm thấy phiên chat');
    return s;
  }

  async postMessage(sessionId: string, role: 'USER' | 'STAFF' | 'ASSISTANT', text: string) {
    await this.getSession(sessionId);
    return this.prisma.chatMessage.create({ data: { sessionId, role, text } });
  }

  async escalate(sessionId: string) {
    await this.getSession(sessionId);
    return this.prisma.chatSession.update({ where: { id: sessionId }, data: { status: 'ESCALATED' } });
  }
}


