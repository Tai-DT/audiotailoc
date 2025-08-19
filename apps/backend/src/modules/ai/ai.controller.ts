import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { IsBooleanString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AiService } from './ai.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { RateLimitGuard } from '../common/rate-limit.guard';

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

class ReindexDto {
  @IsOptional()
  @IsBooleanString()
  all?: string;
}

@UseGuards(RateLimitGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

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
}


