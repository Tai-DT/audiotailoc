import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CacheService } from '../caching/cache.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly cacheService: CacheService
  ) {}

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
    const session = await this.getSession(sessionId);
    
    // Create the message
    const message = await this.prisma.chatMessage.create({ 
      data: { sessionId, role, content: text } 
    });

    // If it's a user message, generate AI response
    if (role === 'USER') {
      try {
        const aiResponse = await this.aiService.chat({
          sessionId,
          userId: session.userId,
          message: text
        });
        
        // Create AI response message
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            role: 'ASSISTANT',
            content: aiResponse.answer
          }
        });

        // Update session status if needed
        if (session.status === 'CLOSED') {
          await this.prisma.chatSession.update({
            where: { id: sessionId },
            data: { status: 'OPEN' }
          });
        }
      } catch (error) {
        this.logger.error('Failed to generate AI response:', error);
        // Create fallback message
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            role: 'ASSISTANT',
            content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ nhân viên hỗ trợ.'
          }
        });
      }
    }

    return message;
  }

  async escalate(sessionId: string) {
    await this.getSession(sessionId);
    return this.prisma.chatSession.update({ where: { id: sessionId }, data: { status: 'ESCALATED' } });
  }

  async closeSession(sessionId: string) {
    await this.getSession(sessionId);
    return this.prisma.chatSession.update({ where: { id: sessionId }, data: { status: 'CLOSED' } });
  }

  async getSessionAnalytics(sessionId: string) {
    const session = await this.getSession(sessionId);
    const messages = session.messages;
    
    return {
      sessionId,
      totalMessages: messages.length,
      userMessages: messages.filter(m => m.role === 'USER').length,
      assistantMessages: messages.filter(m => m.role === 'ASSISTANT').length,
      staffMessages: messages.filter(m => m.role === 'STAFF').length,
      averageResponseTime: this.calculateAverageResponseTime(messages),
      sessionDuration: session.updatedAt.getTime() - session.createdAt.getTime(),
      status: session.status
    };
  }

  private calculateAverageResponseTime(messages: any[]): number {
    let totalTime = 0;
    let responseCount = 0;
    
    for (let i = 0; i < messages.length - 1; i++) {
      if (messages[i].role === 'USER' && messages[i + 1].role === 'ASSISTANT') {
        const responseTime = messages[i + 1].createdAt.getTime() - messages[i].createdAt.getTime();
        totalTime += responseTime;
        responseCount++;
      }
    }
    
    return responseCount > 0 ? totalTime / responseCount : 0;
  }

  async getChatStats() {
    const cacheKey = 'chat:stats';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const [totalSessions, openSessions, escalatedSessions, closedSessions] = await Promise.all([
      this.prisma.chatSession.count(),
      this.prisma.chatSession.count({ where: { status: 'OPEN' } }),
      this.prisma.chatSession.count({ where: { status: 'ESCALATED' } }),
      this.prisma.chatSession.count({ where: { status: 'CLOSED' } })
    ]);

    const stats = {
      totalSessions,
      openSessions,
      escalatedSessions,
      closedSessions,
      escalationRate: totalSessions > 0 ? (escalatedSessions / totalSessions) * 100 : 0,
      resolutionRate: totalSessions > 0 ? (closedSessions / totalSessions) * 100 : 0
    };

    await this.cacheService.set(cacheKey, stats, { ttl: 300 }); // Cache for 5 minutes
    return stats;
  }
}

