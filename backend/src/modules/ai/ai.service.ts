import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';
import { GeminiService } from './gemini.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService, 
    private readonly embedder: EmbeddingService,
    private readonly gemini: GeminiService,
  ) {}

  async upsertKbEntry(input: { kind: 'PRODUCT' | 'FAQ' | 'DOC'; title: string; content: string; productId?: string | null }) {
    const embedding = await this.embedder.embed(`${input.title}\n\n${input.content}`);
    return this.prisma.knowledgeBaseEntry.create({ data: { ...input, embedding: embedding ? (embedding as any) : undefined } });
  }

  async semanticSearch(query: string, limit = 5) {
    try {
      // Mở rộng keywords với Gemini AI
      const expandedKeywords = await this.gemini.generateSearchKeywords(query);
      this.logger.log(`Expanded search for "${query}":`, expandedKeywords);

      // Tìm kiếm semantic trong knowledge base
      const qvec = await this.embedder.embed(query);
      const items = await this.prisma.knowledgeBaseEntry.findMany({ 
        take: 200, 
        include: { product: true } 
      });
      
      if (!qvec) return items.slice(0, limit) as any[];
      
      const scored = items
        .map((it) => ({ it, score: it.embedding ? this.embedder.cosine(qvec, (it.embedding as any) as number[]) : 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => ({ ...(s.it as any), score: s.score }));

      // Tìm kiếm bổ sung trong products với keywords mở rộng
      const _productResults = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as any } },
            { description: { contains: query, mode: 'insensitive' as any } },
            ...expandedKeywords.map(keyword => ({
              OR: [
                { name: { contains: keyword, mode: 'insensitive' as any } },
                { description: { contains: keyword, mode: 'insensitive' as any } },
              ]
            }))
          ]
        },
        take: Math.max(5, limit - scored.length),
        include: {
          category: true,
        }
      });

      return scored as any[];
    } catch (error) {
      this.logger.error('Semantic search failed:', error);
      // Fallback to original search
      const qvec = await this.embedder.embed(query);
      const items = await this.prisma.knowledgeBaseEntry.findMany({ take: 200, include: { product: true } });
      if (!qvec) return items.slice(0, limit) as any[];
      const scored = items
        .map((it) => ({ it, score: it.embedding ? this.embedder.cosine(qvec, (it.embedding as any) as number[]) : 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => ({ ...(s.it as any), score: s.score }));
      return scored as any[];
    }
  }

  async chat(input: { sessionId?: string; userId?: string | null; message: string }) {
    try {
      const session = input.sessionId
        ? await this.prisma.chatSession.findUnique({ where: { id: input.sessionId } })
        : await this.prisma.chatSession.create({ data: { userId: input.userId ?? null, source: 'WEB', status: 'OPEN' } });
      
      const sid = session?.id || (await this.prisma.chatSession.create({ data: { userId: input.userId ?? null } })).id;
      
      await this.prisma.chatMessage.create({ 
        data: { sessionId: sid, role: 'USER', text: input.message } 
      });

      // Retrieve context từ knowledge base
      const context = await this.semanticSearch(input.message, 5);
      
      // Tìm sản phẩm liên quan
      const relevantProducts = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: input.message, mode: 'insensitive' as any } },
            { description: { contains: input.message, mode: 'insensitive' as any } },
          ]
        },
        take: 3,
        include: {
          category: true,
        }
      });

      // Tạo context text cho Gemini
      const contextText = [
        ...context.map((c: any) => `${c.title}: ${c.content}`),
        ...relevantProducts.map(p => `${p.name}: ${p.description || 'Không có mô tả'} - Giá: ${(p.priceCents / 100).toLocaleString('vi-VN')} VNĐ`)
      ].join('\n');

      // Sử dụng Gemini để tạo response thông minh
      const answer = await this.gemini.generateResponse(input.message, contextText);
      
      await this.prisma.chatMessage.create({ 
        data: { sessionId: sid, role: 'ASSISTANT', text: answer } 
      });

      return { 
        sessionId: sid, 
        answer, 
        references: [
          ...context.map((c: any) => ({ id: c.id, title: c.title, productId: c.productId, type: 'knowledge' })),
          ...relevantProducts.map(p => ({ id: p.id, title: p.name, productId: p.id, type: 'product' }))
        ]
      };
    } catch (error) {
      this.logger.error('Chat failed:', error);
      
      // Fallback to simple response
      const session = input.sessionId
        ? await this.prisma.chatSession.findUnique({ where: { id: input.sessionId } })
        : await this.prisma.chatSession.create({ data: { userId: input.userId ?? null, source: 'WEB', status: 'OPEN' } });
      
      const sid = session?.id || (await this.prisma.chatSession.create({ data: { userId: input.userId ?? null } })).id;
      
      const fallbackAnswer = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ trực tiếp với chúng tôi qua điện thoại hoặc email.';
      
      await this.prisma.chatMessage.create({ 
        data: { sessionId: sid, role: 'ASSISTANT', text: fallbackAnswer } 
      });

      return { sessionId: sid, answer: fallbackAnswer, references: [] };
    }
  }

  // Tạo gợi ý sản phẩm thông minh
  async getProductRecommendations(query: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as any } },
            { description: { contains: query, mode: 'insensitive' as any } },
          ]
        },
        take: 8,
        include: {
          category: true,
        }
      });
      
      if (products.length === 0) {
        return {
          recommendation: 'Không tìm thấy sản phẩm phù hợp. Bạn có thể tìm kiếm với từ khóa khác hoặc xem toàn bộ danh mục sản phẩm.',
          products: []
        };
      }

      const recommendation = await this.gemini.generateProductRecommendation(query, products);
      
      return {
        recommendation,
        products: products.slice(0, 6)
      };
    } catch (error) {
      this.logger.error('Product recommendation failed:', error);
      
      // Fallback to simple product list
      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as any } },
            { description: { contains: query, mode: 'insensitive' as any } },
          ]
        },
        take: 6,
        include: {
          category: true,
        }
      });

      return {
        recommendation: 'Đang gặp sự cố khi tạo gợi ý. Vui lòng xem danh sách sản phẩm dưới đây.',
        products
      };
    }
  }

  // Cải thiện mô tả sản phẩm với AI
  async enhanceProductDescription(productId: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { category: true }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const enhancedDescription = await this.gemini.generateProductDescription(product);
      
      // Cập nhật description nếu tốt hơn description hiện tại
      if (enhancedDescription.length > (product.description?.length || 0)) {
        await this.prisma.product.update({
          where: { id: productId },
          data: { description: enhancedDescription }
        });
      }

      return {
        original: product.description,
        enhanced: enhancedDescription,
        updated: enhancedDescription.length > (product.description?.length || 0)
      };
    } catch (error) {
      this.logger.error('Product description enhancement failed:', error);
      throw error;
    }
  }

  async reindex(all = false) {
    const where = all ? {} : { OR: [{ embedding: null }, { embedding: { equals: undefined as any } }] } as any;
    const entries = await this.prisma.knowledgeBaseEntry.findMany({ where, take: 1000 });
    let updated = 0;
    for (const entry of entries) {
      const text = `${entry.title}\n\n${entry.content}`;
      const vec = await this.embedder.embed(text);
      if (vec && Array.isArray(vec)) {
        await this.prisma.knowledgeBaseEntry.update({ where: { id: entry.id }, data: { embedding: vec as any } });
        updated++;
      }
    }
    const total = await this.prisma.knowledgeBaseEntry.count();
    return { updated, total };
  }

  async escalate(sessionId: string) {
    await this.prisma.chatSession.update({ where: { id: sessionId }, data: { status: 'ESCALATED' } });
    return { sessionId, status: 'ESCALATED' };
  }

  // ======= CHAT ANALYSIS & SEARCH FEATURES =======

  // Phân tích nội dung chat với AI
  async analyzeChatSession(sessionId: string) {
    try {
      const session = await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          user: {
            select: { email: true, name: true }
          }
        }
      });

      if (!session) {
        throw new Error('Chat session not found');
      }

      const conversation = session.messages
        .map(msg => `${msg.role}: ${msg.text}`)
        .join('\n');

      if (!conversation.trim()) {
        return {
          sessionId,
          summary: 'Không có nội dung để phân tích',
          sentiment: 'NEUTRAL',
          topics: [],
          actionItems: [],
          customerSatisfaction: 'UNKNOWN'
        };
      }

      // Sử dụng Gemini để phân tích
      const analysisPrompt = `
Phân tích cuộc hội thoại dịch vụ khách hàng sau đây của Audio Tài Lộc:

${conversation}

Vui lòng phân tích và trả về JSON với các thông tin sau:
{
  "summary": "Tóm tắt ngắn gọn cuộc hội thoại (1-2 câu)",
  "sentiment": "POSITIVE|NEGATIVE|NEUTRAL",
  "topics": ["danh sách chủ đề chính được thảo luận"],
  "actionItems": ["danh sách hành động cần thực hiện"],
  "customerSatisfaction": "VERY_SATISFIED|SATISFIED|NEUTRAL|DISSATISFIED|VERY_DISSATISFIED",
  "productMentioned": ["danh sách sản phẩm được nhắc đến"],
  "issuesRaised": ["danh sách vấn đề khách hàng nêu ra"],
  "recommendations": ["đề xuất cải thiện dịch vụ"]
}

Chỉ trả về JSON, không có text khác.
`;

      const analysis = await this.gemini.generateResponse(analysisPrompt);
      
      try {
        const parsedAnalysis = JSON.parse(analysis);
        
        // Lưu kết quả phân tích vào metadata
        await this.prisma.chatSession.update({
          where: { id: sessionId },
          data: {
            metadata: {
              analysis: parsedAnalysis,
              analyzedAt: new Date().toISOString()
            } as any
          }
        });

        return {
          sessionId,
          ...parsedAnalysis,
          analyzedAt: new Date()
        };
      } catch (parseError) {
        this.logger.warn('Failed to parse AI analysis, using fallback', parseError);
        
        // Fallback analysis
        const fallbackAnalysis = {
          summary: conversation.length > 100 ? conversation.substring(0, 100) + '...' : conversation,
          sentiment: 'NEUTRAL' as const,
          topics: this.extractTopicsFromText(conversation),
          actionItems: [],
          customerSatisfaction: 'UNKNOWN' as const,
          productMentioned: this.extractProductMentions(conversation),
          issuesRaised: [],
          recommendations: []
        };

        return {
          sessionId,
          ...fallbackAnalysis,
          analyzedAt: new Date()
        };
      }
    } catch (error) {
      this.logger.error('Chat analysis failed:', error);
      throw new Error('Không thể phân tích cuộc hội thoại');
    }
  }

  // Tìm kiếm trong lịch sử chat
  async searchChatHistory(query: string, options: {
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sentiment?: string;
    status?: string;
    limit?: number;
  } = {}) {
    try {
      const { userId, dateFrom, dateTo, sentiment, status, limit = 20 } = options;

      // Tìm kiếm cơ bản trong nội dung tin nhắn
      const whereConditions: any = {
        messages: {
          some: {
            text: {
              contains: query,
              mode: 'insensitive' as any
            }
          }
        }
      };

      if (userId) {
        whereConditions.userId = userId;
      }

      if (status) {
        whereConditions.status = status;
      }

      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) whereConditions.createdAt.gte = dateFrom;
        if (dateTo) whereConditions.createdAt.lte = dateTo;
      }

      // Tìm kiếm với sentiment filter
      if (sentiment) {
        whereConditions.metadata = {
          path: ['analysis', 'sentiment'],
          equals: sentiment
        };
      }

      const sessions = await this.prisma.chatSession.findMany({
        where: whereConditions,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          user: {
            select: { email: true, name: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit
      });

      // Enhance results với AI nếu cần
      const enhancedResults = await Promise.all(
        sessions.map(async (session) => {
          const relevantMessages = session.messages.filter(msg =>
            msg.text.toLowerCase().includes(query.toLowerCase())
          );

          return {
            sessionId: session.id,
            userId: session.userId,
            user: session.user,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            relevantMessages: relevantMessages.slice(0, 3), // Top 3 relevant messages
            messageCount: session.messages.length,
            lastMessage: session.messages[session.messages.length - 1],
            analysis: session.metadata ? (session.metadata as any).analysis : null
          };
        })
      );

      return {
        query,
        results: enhancedResults,
        total: enhancedResults.length
      };
    } catch (error) {
      this.logger.error('Chat search failed:', error);
      throw new Error('Không thể tìm kiếm lịch sử chat');
    }
  }

  // Tóm tắt nhiều chat sessions
  async summarizeMultipleSessions(sessionIds: string[]) {
    try {
      const sessions = await this.prisma.chatSession.findMany({
        where: {
          id: { in: sessionIds }
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          user: {
            select: { email: true, name: true }
          }
        }
      });

      if (sessions.length === 0) {
        return {
          summary: 'Không tìm thấy cuộc hội thoại nào',
          totalSessions: 0,
          totalMessages: 0,
          commonTopics: [],
          overallSentiment: 'NEUTRAL'
        };
      }

      // Tạo tóm tắt tổng hợp
      const allConversations = sessions.map(session => {
        const conversation = session.messages
          .map(msg => `${msg.role}: ${msg.text}`)
          .join('\n');
        return `--- Cuộc hội thoại ${session.id} ---\n${conversation}`;
      }).join('\n\n');

      const summaryPrompt = `
Phân tích và tóm tắt ${sessions.length} cuộc hội thoại dịch vụ khách hàng của Audio Tài Lộc:

${allConversations}

Vui lòng tạo báo cáo tóm tắt JSON:
{
  "summary": "Tóm tắt tổng quan về tất cả cuộc hội thoại",
  "totalSessions": ${sessions.length},
  "totalMessages": ${sessions.reduce((sum, s) => sum + s.messages.length, 0)},
  "commonTopics": ["chủ đề phổ biến nhất"],
  "commonIssues": ["vấn đề khách hàng thường gặp"],
  "overallSentiment": "POSITIVE|NEGATIVE|NEUTRAL",
  "recommendations": ["khuyến nghị cải thiện dịch vụ"],
  "productInsights": ["insights về sản phẩm từ phản hồi khách hàng"]
}

Chỉ trả về JSON, không có text khác.
`;

      const summary = await this.gemini.generateResponse(summaryPrompt);
      
      try {
        const parsedSummary = JSON.parse(summary);
        return {
          ...parsedSummary,
          sessions: sessions.map(s => ({
            id: s.id,
            userId: s.userId,
            messageCount: s.messages.length,
            status: s.status,
            createdAt: s.createdAt
          })),
          generatedAt: new Date()
        };
      } catch (parseError) {
        this.logger.warn('Failed to parse summary, using fallback');
        
        return {
          summary: `Tóm tắt ${sessions.length} cuộc hội thoại với tổng cộng ${sessions.reduce((sum, s) => sum + s.messages.length, 0)} tin nhắn`,
          totalSessions: sessions.length,
          totalMessages: sessions.reduce((sum, s) => sum + s.messages.length, 0),
          commonTopics: this.extractTopicsFromText(allConversations),
          overallSentiment: 'NEUTRAL',
          sessions: sessions.map(s => ({
            id: s.id,
            userId: s.userId,
            messageCount: s.messages.length,
            status: s.status,
            createdAt: s.createdAt
          })),
          generatedAt: new Date()
        };
      }
    } catch (error) {
      this.logger.error('Multiple sessions summary failed:', error);
      throw new Error('Không thể tóm tắt các cuộc hội thoại');
    }
  }

  // Chat insights - phân tích xu hướng
  async getChatInsights(options: {
    dateFrom?: Date;
    dateTo?: Date;
    userId?: string;
  } = {}) {
    try {
      const { dateFrom, dateTo, userId } = options;
      
      const whereConditions: any = {};
      if (userId) whereConditions.userId = userId;
      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) whereConditions.createdAt.gte = dateFrom;
        if (dateTo) whereConditions.createdAt.lte = dateTo;
      }

      const sessions = await this.prisma.chatSession.findMany({
        where: whereConditions,
        include: {
          messages: true,
          user: {
            select: { email: true, name: true }
          }
        }
      });

      // Tính toán metrics
      const totalSessions = sessions.length;
      const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
      const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

      // Phân tích status
      const statusBreakdown = sessions.reduce((acc, session) => {
        acc[session.status] = (acc[session.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Phân tích sentiment từ metadata
      const sentimentBreakdown = sessions.reduce((acc, session) => {
        const sentiment = session.metadata ? (session.metadata as any).analysis?.sentiment : 'UNKNOWN';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Phân tích theo thời gian
      const dailyStats = sessions.reduce((acc, session) => {
        const date = session.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        period: {
          from: dateFrom,
          to: dateTo
        },
        metrics: {
          totalSessions,
          totalMessages,
          avgMessagesPerSession: Math.round(avgMessagesPerSession * 100) / 100,
          avgSessionDuration: this.calculateAverageSessionDuration(sessions)
        },
        breakdown: {
          status: statusBreakdown,
          sentiment: sentimentBreakdown,
          daily: dailyStats
        },
        topUsers: this.getTopUsers(sessions),
        recentSessions: sessions.slice(0, 10).map(s => ({
          id: s.id,
          userId: s.userId,
          status: s.status,
          messageCount: s.messages.length,
          createdAt: s.createdAt,
          lastMessageAt: s.messages[s.messages.length - 1]?.createdAt
        })),
        generatedAt: new Date()
      };
    } catch (error) {
      this.logger.error('Chat insights failed:', error);
      throw new Error('Không thể tạo báo cáo insights');
    }
  }

  // Helper methods
  private extractTopicsFromText(text: string): string[] {
    const commonTopics = [
      'tai nghe', 'loa', 'âm thanh', 'chất lượng', 'giá cả', 
      'bảo hành', 'giao hàng', 'thanh toán', 'hỗ trợ', 'khuyến mãi'
    ];
    
    return commonTopics.filter(topic => 
      text.toLowerCase().includes(topic.toLowerCase())
    );
  }

  private extractProductMentions(text: string): string[] {
    const productKeywords = [
      'Tai nghe Tài Lộc Pro', 'Loa Tài Lộc Classic', 'Soundbar Tài Lộc 5.1',
      'Test Audio Headphones'
    ];
    
    return productKeywords.filter(product => 
      text.toLowerCase().includes(product.toLowerCase())
    );
  }

  private calculateAverageSessionDuration(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    
    const durations = sessions.map(session => {
      if (session.messages.length < 2) return 0;
      
      const firstMessage = session.messages[0];
      const lastMessage = session.messages[session.messages.length - 1];
      
      return new Date(lastMessage.createdAt).getTime() - new Date(firstMessage.createdAt).getTime();
    });
    
    const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    return Math.round(avgDuration / 1000 / 60); // Convert to minutes
  }

  private getTopUsers(sessions: any[]): any[] {
    const userStats = sessions.reduce((acc, session) => {
      if (session.userId) {
        const userId = session.userId;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            email: session.user?.email,
            name: session.user?.name,
            sessionCount: 0,
            messageCount: 0
          };
        }
        acc[userId].sessionCount++;
        acc[userId].messageCount += session.messages.length;
      }
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(userStats)
      .sort((a: any, b: any) => b.sessionCount - a.sessionCount)
      .slice(0, 10);
  }
}

