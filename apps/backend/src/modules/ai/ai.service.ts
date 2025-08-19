import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService, private readonly embedder: EmbeddingService) {}

  async upsertKbEntry(input: { kind: 'PRODUCT' | 'FAQ' | 'DOC'; title: string; content: string; productId?: string | null }) {
    const embedding = await this.embedder.embed(`${input.title}\n\n${input.content}`);
    return this.prisma.knowledgeBaseEntry.create({ data: { ...input, embedding: embedding ? (embedding as any) : undefined } });
  }

  async semanticSearch(query: string, limit = 5) {
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

  async chat(input: { sessionId?: string; userId?: string | null; message: string }) {
    const session = input.sessionId
      ? await this.prisma.chatSession.findUnique({ where: { id: input.sessionId } })
      : await this.prisma.chatSession.create({ data: { userId: input.userId ?? null, source: 'WEB', status: 'OPEN' } });
    const sid = session?.id || (await this.prisma.chatSession.create({ data: { userId: input.userId ?? null } })).id;
    await this.prisma.chatMessage.create({ data: { sessionId: sid, role: 'USER', text: input.message } });
    // Retrieve context
    const context = await this.semanticSearch(input.message, 3);
    // Call LLM (stub: echo with references)
    const references = context.map((c: any) => c.title).join(', ');
    const answer = `Xin chào! Tôi tìm thấy một số thông tin liên quan: ${references}. Câu hỏi của bạn: "${input.message}". (Trả lời mẫu, cần cấu hình OPENAI_API_KEY để sinh nội dung thực.)`;
    await this.prisma.chatMessage.create({ data: { sessionId: sid, role: 'ASSISTANT', text: answer } });
    return { sessionId: sid, answer, references: context.map((c: any) => ({ id: c.id, title: c.title, productId: c.productId })) };
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
}

