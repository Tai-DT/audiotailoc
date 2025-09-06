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
        take: 200
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
            { name: { contains: query } },
            { description: { contains: query } },
            ...expandedKeywords.map(keyword => ({
              OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } },
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
      const items = await this.prisma.knowledgeBaseEntry.findMany({ take: 200 });
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
      let session;
      let sid: string;

      if (input.sessionId) {
        // Tìm session hiện tại
        session = await this.prisma.chatSession.findUnique({ 
          where: { id: input.sessionId } 
        });
        
        if (!session) {
          // Session không tồn tại, tạo mới
          session = await this.prisma.chatSession.create({ 
            data: { userId: input.userId ?? null, source: 'WEB', status: 'OPEN' } 
          });
        }
        sid = session.id;
      } else {
        // Tạo session mới
        session = await this.prisma.chatSession.create({ 
          data: { userId: input.userId ?? null, source: 'WEB', status: 'OPEN' } 
        });
        sid = session.id;
      }
      
      await this.prisma.chatMessage.create({ 
        data: { sessionId: sid, role: 'USER', content: input.message } 
      });

      // Retrieve context từ knowledge base
      const context = await this.semanticSearch(input.message, 5);
      
      // Lấy conversation history để cải thiện context
      const conversationHistory = await this.prisma.chatMessage.findMany({
        where: { sessionId: sid },
        orderBy: { createdAt: 'asc' },
        take: 10, // Lấy 10 messages gần nhất
        select: { role: true, content: true }
      });
      
      // Tạo conversation context
      const conversationContext = conversationHistory
        .map(msg => `${msg.role === 'USER' ? 'Khách hàng' : 'AI'}: ${msg.content}`)
        .join('\n');
      
      // Tìm sản phẩm liên quan
      const relevantProducts = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: input.message } },
            { description: { contains: input.message } },
          ]
        },
        take: 3,
        include: {
          category: true,
        }
      });

      // Tạo context string
      const contextString = context.map(item => 
        `${item.title}: ${item.content}`
      ).join('\n\n');

      const productContext = relevantProducts.map(p => 
        `${p.name}: ${p.description || ''} (Giá: ${(p.priceCents).toLocaleString('vi-VN')} VNĐ)`
      ).join('\n');

      const fullContext = `${contextString}\n\nSản phẩm liên quan:\n${productContext}\n\nLịch sử hội thoại:\n${conversationContext}`;

      // Generate response với Gemini với retry logic
      let answer: string = '';
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          answer = await this.gemini.generateResponse(input.message, fullContext);
          break; // Thành công, thoát khỏi loop
        } catch (error: any) {
          retryCount++;
          
          // Kiểm tra nếu là rate limit error
          if (error.message?.includes('rate limit') || error.message?.includes('429')) {
            if (retryCount <= maxRetries) {
              this.logger.warn(`Rate limit hit, retrying in ${retryCount * 2} seconds...`);
              await new Promise(resolve => setTimeout(resolve, retryCount * 2000)); // Wait 2s, 4s
              continue;
            } else {
              throw new Error('API rate limit exceeded. Vui lòng thử lại sau 1 phút.');
            }
          }
          
          // Nếu không phải rate limit, throw error ngay
          throw error;
        }
      }

      // Kiểm tra nếu answer vẫn rỗng
      if (!answer) {
        throw new Error('Không thể tạo câu trả lời. Vui lòng thử lại sau.');
      }

      // Lưu message của assistant
      await this.prisma.chatMessage.create({ 
        data: { sessionId: sid, role: 'ASSISTANT', content: answer } 
      });

      return {
        answer,
        sessionId: sid,
        references: context.map(item => ({
          title: item.title,
          content: item.content.substring(0, 200) + '...',
          score: item.score
        }))
      };
    } catch (error: any) {
      this.logger.error('Chat failed:', error);
      
      // Trả về error message cụ thể hơn
      if (error.message?.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Vui lòng thử lại sau 1 phút.');
      } else if (error.message?.includes('API key')) {
        throw new Error('AI service configuration error. Vui lòng liên hệ admin.');
      } else {
        throw new Error('Không thể xử lý tin nhắn. Vui lòng thử lại sau.');
      }
    }
  }

  async reindex(all = false) {
    try {
      const entries = all 
        ? await this.prisma.knowledgeBaseEntry.findMany()
        : await this.prisma.knowledgeBaseEntry.findMany({
            where: {
              OR: [
                { embedding: null },
                { embedding: undefined }
              ]
            }
          });

      let updated = 0;
      for (const entry of entries) {
        const embedding = await this.embedder.embed(`${entry.title}\n\n${entry.content}`);
        if (embedding) {
          await this.prisma.knowledgeBaseEntry.update({
            where: { id: entry.id },
            data: { embedding: embedding as any }
          });
          updated++;
        }
      }

      return { message: `Reindexed ${updated} entries` };
    } catch (error) {
      this.logger.error('Reindex failed:', error);
      throw new Error('Reindex failed');
    }
  }

  async escalate(sessionId: string) {
    try {
      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { status: 'ESCALATED' }
      });
      return { message: 'Session escalated successfully' };
    } catch (error) {
      this.logger.error('Escalate failed:', error);
      throw new Error('Failed to escalate session');
    }
  }

  async getProductRecommendations(query: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ]
        },
        take: 10,
        include: {
          category: true,
        }
      });

      const recommendation = await this.gemini.generateProductRecommendation(query, products);
      
      return {
        query,
        recommendation,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.priceCents,
          category: p.category?.name
        }))
      };
    } catch (error) {
      this.logger.error('Product recommendation failed:', error);
      throw new Error('Không thể tạo gợi ý sản phẩm. Vui lòng thử lại sau.');
    }
  }

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

      await this.prisma.product.update({
        where: { id: productId },
        data: { description: enhancedDescription }
      });

      return {
        productId,
        originalDescription: product.description,
        enhancedDescription
      };
    } catch (error) {
      this.logger.error('Product enhancement failed:', error);
      throw new Error('Không thể cải thiện mô tả sản phẩm. Vui lòng thử lại sau.');
    }
  }

  // ======= CHAT ANALYSIS METHODS =======

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

      const conversation = session.messages.map(m => `${m.role}: ${m.content}`).join('\n');
      
      const analysis = await this.gemini.generateResponse(
        `Phân tích cuộc hội thoại sau và đưa ra insights:\n\n${conversation}`,
        'Bạn là chuyên gia phân tích hội thoại khách hàng. Hãy phân tích và đưa ra insights về: 1) Ý định của khách hàng, 2) Mức độ hài lòng, 3) Các vấn đề cần giải quyết, 4) Gợi ý cải thiện.'
      );

      return {
        sessionId,
        analysis,
        messageCount: session.messages.length,
        duration: session.messages.length > 0 ? 
          new Date(session.messages[session.messages.length - 1].createdAt).getTime() - 
          new Date(session.messages[0].createdAt).getTime() : 0
      };
    } catch (error) {
      this.logger.error('Chat analysis failed:', error);
      throw new Error('Không thể phân tích cuộc hội thoại. Vui lòng thử lại sau.');
    }
  }

  async searchChatHistory(query: string, options: any = {}) {
    try {
      const where: any = {};
      
      if (options.userId) where.userId = options.userId;
      if (options.dateFrom) where.createdAt = { gte: options.dateFrom };
      if (options.dateTo) where.createdAt = { ...where.createdAt, lte: options.dateTo };
      if (options.status) where.status = options.status;

      const sessions = await this.prisma.chatSession.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          user: {
            select: { email: true, name: true }
          }
        },
        take: options.limit || 10,
        orderBy: { updatedAt: 'desc' }
      });

      // Simple text search in messages
      const results = sessions.filter(session => 
        session.messages.some(message => 
          message.content.toLowerCase().includes(query.toLowerCase())
        )
      );

      return results.map(session => ({
        id: session.id,
        userId: session.userId,
        user: session.user,
        status: session.status,
        messageCount: session.messages.length,
        lastMessage: session.messages[session.messages.length - 1]?.content,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }));
    } catch (error) {
      this.logger.error('Chat search failed:', error);
      throw new Error('Không thể tìm kiếm lịch sử chat. Vui lòng thử lại sau.');
    }
  }

  async summarizeMultipleSessions(sessionIds: string[]) {
    try {
      const sessions = await this.prisma.chatSession.findMany({
        where: { id: { in: sessionIds } },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      const summaries = await Promise.all(
        sessions.map(async (session) => {
          const conversation = session.messages.map(m => `${m.role}: ${m.content}`).join('\n');
          const summary = await this.gemini.generateResponse(
            `Tóm tắt cuộc hội thoại sau trong 2-3 câu:\n\n${conversation}`,
            'Bạn là chuyên gia tóm tắt hội thoại. Hãy tóm tắt ngắn gọn ý chính của cuộc hội thoại.'
          );
          
          return {
            sessionId: session.id,
            summary,
            messageCount: session.messages.length
          };
        })
      );

      return summaries;
    } catch (error) {
      this.logger.error('Session summarization failed:', error);
      throw new Error('Không thể tóm tắt các cuộc hội thoại. Vui lòng thử lại sau.');
    }
  }

  async getChatInsights(options: any = {}) {
    try {
      const where: any = {};
      
      if (options.dateFrom) where.createdAt = { gte: options.dateFrom };
      if (options.dateTo) where.createdAt = { ...where.createdAt, lte: options.dateTo };
      if (options.userId) where.userId = options.userId;

      const sessions = await this.prisma.chatSession.findMany({
        where,
        include: {
          messages: true,
          user: {
            select: { email: true, name: true }
          }
        }
      });

      const totalSessions = sessions.length;
      const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
      const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;
      
      const statusCounts = sessions.reduce((acc, session) => {
        acc[session.status] = (acc[session.status] || 0) + 1;
        return acc;
      }, {} as any);

      const insights = await this.gemini.generateResponse(
        `Phân tích dữ liệu chat sau và đưa ra insights:\n\nTổng số cuộc hội thoại: ${totalSessions}\nTổng số tin nhắn: ${totalMessages}\nTrung bình tin nhắn/cuộc hội thoại: ${avgMessagesPerSession.toFixed(1)}\nPhân bố trạng thái: ${JSON.stringify(statusCounts)}`,
        'Bạn là chuyên gia phân tích dữ liệu. Hãy đưa ra insights về hoạt động chat và gợi ý cải thiện.'
      );

      return {
        totalSessions,
        totalMessages,
        avgMessagesPerSession,
        statusCounts,
        insights
      };
    } catch (error) {
      this.logger.error('Chat insights failed:', error);
      throw new Error('Không thể tạo insights. Vui lòng thử lại sau.');
    }
  }

  // ======= CORE AI-POWERED FEATURES =======

  async generateContent(dto: any) {
    try {
      const prompt = this.getContentGenerationPrompt(dto.type, dto.prompt, dto.tone);
      const content = await this.gemini.generateResponse(prompt);
      
      return {
        success: true,
        content: content.substring(0, dto.maxLength || 500),
        metadata: {
          type: dto.type || 'general',
          tone: dto.tone || 'professional',
          length: content.length,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error('Content generation failed:', error);
      throw new Error('Không thể tạo nội dung');
    }
  }

  async analyzeSentiment(dto: any) {
    try {
      const prompt = `Phân tích cảm xúc của văn bản sau và trả về kết quả dạng JSON với format:
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.0-1.0,
  "emotions": ["emotion1", "emotion2"],
  "score": 0.0-1.0
}

Văn bản: "${dto.text}"
Context: ${dto.context || 'general'}`;

      const response = await this.gemini.generateResponse(prompt);
      const result = this.parseJSONResponse(response);
      
      return {
        success: true,
        sentiment: result.sentiment,
        confidence: result.confidence,
        emotions: result.emotions,
        score: result.score,
        text: dto.text
      };
    } catch (error) {
      this.logger.error('Sentiment analysis failed:', error);
      throw new Error('Không thể phân tích cảm xúc');
    }
  }

  async classifyText(dto: any) {
    try {
      const prompt = `Phân loại văn bản sau vào một trong các danh mục: ${dto.categories.join(', ')}. Trả về kết quả dạng JSON:
{
  "category": "category_name",
  "confidence": 0.0-1.0,
  "alternatives": ["alt1", "alt2"]
}

Văn bản: "${dto.text}"`;

      const response = await this.gemini.generateResponse(prompt);
      const result = this.parseJSONResponse(response);
      
      return {
        success: true,
        category: result.category,
        confidence: result.confidence,
        alternatives: result.alternatives || [],
        text: dto.text
      };
    } catch (error) {
      this.logger.error('Text classification failed:', error);
      throw new Error('Không thể phân loại văn bản');
    }
  }

  async translate(dto: any) {
    try {
      const prompt = `Dịch văn bản sau sang ${dto.targetLanguage}${dto.sourceLanguage ? ` từ ${dto.sourceLanguage}` : ''}:

"${dto.text}"

Hãy dịch chính xác và tự nhiên.`;

      const translation = await this.gemini.generateResponse(prompt);
      
      return {
        success: true,
        original: dto.text,
        translation,
        sourceLanguage: dto.sourceLanguage || 'auto',
        targetLanguage: dto.targetLanguage,
        length: translation.length
      };
    } catch (error) {
      this.logger.error('Translation failed:', error);
      throw new Error('Không thể dịch văn bản');
    }
  }

  async detectCustomerIntent(dto: any) {
    try {
      const prompt = `Phân tích ý định của khách hàng từ tin nhắn sau và trả về kết quả dạng JSON:
{
  "intent": "purchase_inquiry|technical_support|complaint|general_question|product_recommendation",
  "confidence": 0.0-1.0,
  "entities": ["entity1", "entity2"],
  "urgency": "low|medium|high"
}

Tin nhắn: "${dto.message}"`;

      const response = await this.gemini.generateResponse(prompt);
      const result = this.parseJSONResponse(response);
      
      return {
        success: true,
        intent: result.intent,
        confidence: result.confidence,
        entities: result.entities || [],
        urgency: result.urgency,
        message: dto.message,
        userId: dto.userId,
        sessionId: dto.sessionId
      };
    } catch (error) {
      this.logger.error('Customer intent detection failed:', error);
      throw new Error('Không thể xác định ý định khách hàng');
    }
  }

  async getPersonalizedRecommendations(dto: any) {
    try {
      // Phân tích preferences của user
      const userPreferences = await this.analyzeUserPreferences(dto.userId);
      
      // Tạo recommendations dựa trên preferences
      const recommendations = await this.generatePersonalizedRecommendations(userPreferences, dto.context);
      
      return {
        success: true,
        userId: dto.userId,
        recommendations,
        preferences: userPreferences,
        context: dto.context,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Personalization failed:', error);
      throw new Error('Không thể tạo gợi ý cá nhân hóa');
    }
  }

  async getHealthStatus() {
    try {
      const geminiHealth = await this.checkGeminiHealth();
      const embeddingHealth = await this.checkEmbeddingHealth();
      const databaseHealth = await this.checkDatabaseHealth();

      const isHealthy = geminiHealth && embeddingHealth && databaseHealth;
      
      return {
        success: true,
        status: isHealthy ? 'healthy' : 'degraded',
        services: {
          gemini: geminiHealth ? 'healthy' : 'unhealthy',
          embedding: embeddingHealth ? 'healthy' : 'unhealthy',
          database: databaseHealth ? 'healthy' : 'unhealthy'
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        success: true,
        status: 'unhealthy',
        services: {
          gemini: 'unhealthy',
          embedding: 'unhealthy',
          database: 'unhealthy'
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
    }
  }

  async getCapabilities() {
    return {
      success: true,
      capabilities: [
        {
          name: 'content_generation',
          description: 'Tạo nội dung tự động',
          enabled: true,
          models: ['gemini-pro']
        },
        {
          name: 'sentiment_analysis',
          description: 'Phân tích cảm xúc',
          enabled: true,
          models: ['gemini-pro']
        },
        {
          name: 'text_classification',
          description: 'Phân loại văn bản',
          enabled: true,
          models: ['gemini-pro']
        },
        {
          name: 'translation',
          description: 'Dịch thuật đa ngôn ngữ',
          enabled: true,
          models: ['gemini-pro']
        },
        {
          name: 'customer_intent',
          description: 'Phân tích ý định khách hàng',
          enabled: true,
          models: ['gemini-pro']
        },
        {
          name: 'personalization',
          description: 'Gợi ý sản phẩm cá nhân hóa',
          enabled: true,
          models: ['gemini-pro']
        }
      ],
      models: {
        'gemini-pro': {
          status: 'active',
          maxTokens: 32000,
          supportedFeatures: ['text', 'code', 'reasoning']
        }
      }
    };
  }

  // ======= HELPER METHODS =======

  private getContentGenerationPrompt(type: string, prompt: string, tone: string): string {
    const prompts: any = {
      product_description: `Tạo mô tả sản phẩm âm thanh với tone ${tone} cho: ${prompt}`,
      email_template: `Tạo template email ${tone} cho: ${prompt}`,
      marketing_copy: `Tạo nội dung marketing ${tone} cho: ${prompt}`,
      faq: `Tạo câu hỏi thường gặp ${tone} cho: ${prompt}`,
      blog_post: `Tạo bài viết blog ${tone} về: ${prompt}`
    };

    return prompts[type as keyof typeof prompts] || `Tạo nội dung ${tone} về: ${prompt}`;
  }

  private parseJSONResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      this.logger.error('JSON parsing failed:', error);
      return {};
    }
  }

  private async analyzeUserPreferences(_userId: string): Promise<any> {
    try {
      // Mock user preferences analysis
      return {
        categories: {},
        priceRange: { min: 0, max: 0 },
        brands: {},
        totalOrders: 0
      };
    } catch (error) {
      this.logger.error('User preferences analysis failed:', error);
      return {};
    }
  }

  private async generatePersonalizedRecommendations(_preferences: any, _context: string): Promise<any[]> {
    try {
      // Mock personalized recommendations
      return [
        {
          productId: 'rec_1',
          score: 0.95,
          reason: 'Based on your category preferences'
        },
        {
          productId: 'rec_2',
          score: 0.88,
          reason: 'Similar to your previous purchases'
        }
      ];
    } catch (error) {
      this.logger.error('Personalized recommendations generation failed:', error);
      return [];
    }
  }

  private async checkGeminiHealth(): Promise<boolean> {
    try {
      await this.gemini.generateResponse('test');
      return true;
    } catch (error) {
      this.logger.error('Gemini health check failed:', (error as Error).message);
      return false;
    }
  }

  private async checkEmbeddingHealth(): Promise<boolean> {
    try {
      await this.embedder.embed('test');
      return true;
    } catch (error) {
      this.logger.error('Embedding health check failed:', (error as Error).message);
      return false;
    }
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', (error as Error).message);
      return false;
    }
  }
}

