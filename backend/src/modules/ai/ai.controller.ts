import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, Param } from '@nestjs/common';
import type { Response } from 'express';
import { IsBooleanString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AiService } from './ai.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../../prisma/prisma.service';

class ChatDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}

class UpsertKbDto {
  @IsIn(['PRODUCT', 'FAQ', 'DOC'])
  kind!: 'PRODUCT' | 'FAQ' | 'DOC';

  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  productId?: string | null;
}

class SearchQueryDto {
  @IsString()
  q!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}

class ProductRecommendationDto {
  @IsString()
  query!: string;
}

class EnhanceProductDto {
  @IsString()
  productId!: string;
}

class AnalyzeChatDto {
  @IsString()
  sessionId!: string;
}

class SearchChatDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  sentiment?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

class SummarizeChatsDto {
  @IsString({ each: true })
  sessionIds!: string[];
}

class ChatInsightsDto {
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

class ReindexDto {
  @IsOptional()
  @IsBooleanString()
  all?: string;
}

@Controller('ai')
export class AiController {
  constructor(
    private readonly ai: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('chat')
  async chat(@Body() dto: ChatDto, @Req() req: any) {
    const userId = req?.user?.id || undefined;
    return this.ai.chat({ message: dto.message, sessionId: dto.sessionId, userId });
  }

  // Server-Sent Events (SSE) streaming stub
  @Post('chat/stream')
  async chatStream(@Body() dto: ChatDto, @Req() req: any, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const userId = req?.user?.id || undefined;
    const result = await this.ai.chat({ message: dto.message, sessionId: dto.sessionId, userId });
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify({ chunk: result.answer })}\n\n`);
    res.write(`event: done\n`);
    res.write(`data: ${JSON.stringify({ sessionId: result.sessionId, references: result.references })}\n\n`);
    res.end();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('kb')
  async upsert(@Body() dto: UpsertKbDto) {
    return this.ai.upsertKbEntry(dto);
  }

  @Get('search')
  async search(@Query() q: SearchQueryDto) {
    const limit = typeof q.limit === 'number' ? q.limit : 5;
    const items = await this.ai.semanticSearch(q.q, limit);
    return { items };
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('reindex')
  async reindex(@Body() body: ReindexDto) {
    const all = body?.all === 'true';
    return this.ai.reindex(all);
  }

  // Optional: escalate endpoint to mark session as ESCALATED
  @UseGuards(JwtGuard, AdminGuard)
  @Post('escalate')
  async escalate(@Body() dto: { sessionId: string }) {
    return this.ai.escalate(dto.sessionId);
  }

  // AI Product Recommendations
  @Post('recommendations')
  async getRecommendations(@Body() dto: ProductRecommendationDto) {
    return this.ai.getProductRecommendations(dto.query);
  }

  // AI Enhanced Product Description
  @UseGuards(JwtGuard, AdminGuard)
  @Post('enhance-product')
  async enhanceProduct(@Body() dto: EnhanceProductDto) {
    return this.ai.enhanceProductDescription(dto.productId);
  }

  // ======= CHAT ANALYSIS & SEARCH ENDPOINTS =======

  // Phân tích một chat session với AI
  @Post('analyze-chat')
  async analyzeChat(@Body() dto: AnalyzeChatDto) {
    return this.ai.analyzeChatSession(dto.sessionId);
  }

  // Tìm kiếm trong lịch sử chat
  @Post('search-chats')
  async searchChats(@Body() dto: SearchChatDto) {
    const options: any = {};
    
    if (dto.userId) options.userId = dto.userId;
    if (dto.dateFrom) options.dateFrom = new Date(dto.dateFrom);
    if (dto.dateTo) options.dateTo = new Date(dto.dateTo);
    if (dto.sentiment) options.sentiment = dto.sentiment;
    if (dto.status) options.status = dto.status;
    if (dto.limit) options.limit = dto.limit;

    return this.ai.searchChatHistory(dto.query, options);
  }

  // Tóm tắt nhiều chat sessions
  @Post('summarize-chats')
  async summarizeChats(@Body() dto: SummarizeChatsDto) {
    return this.ai.summarizeMultipleSessions(dto.sessionIds);
  }

  // Báo cáo insights từ chat
  @Post('chat-insights')
  async getChatInsights(@Body() dto: ChatInsightsDto) {
    const options: any = {};
    
    if (dto.dateFrom) options.dateFrom = new Date(dto.dateFrom);
    if (dto.dateTo) options.dateTo = new Date(dto.dateTo);
    if (dto.userId) options.userId = dto.userId;

    return this.ai.getChatInsights(options);
  }

  // Lấy danh sách chat sessions (để admin quản lý)
  @Get('chat-sessions')
  async getChatSessions(@Query('limit') limit?: string, @Query('status') status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.chatSession.findMany({
      where,
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        user: {
          select: { email: true, name: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit ? parseInt(limit) : 50
    });
  }

  // Lấy chi tiết một chat session
  @UseGuards(JwtGuard, AdminGuard)
  @Get('chat-sessions/:id')
  async getChatSession(@Param('id') id: string) {
    return this.prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        user: {
          select: { email: true, name: true }
        }
      }
    });
  }
}


