import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ZaloService {
  constructor(private readonly cfg: ConfigService, private readonly prisma: PrismaService) {}

  private get accessToken() {
    return this.cfg.get<string>('ZALO_OA_ACCESS_TOKEN') || '';
  }
  private get secret() {
    return this.cfg.get<string>('ZALO_OA_SECRET') || '';
  }

  async handleIncoming(headers: Record<string, string>, body: any) {
    // TODO: verify signature with secret if Zalo sends one
    const event = body;
    // Normalize and push into chat pipeline
    const userId = null; // external user not mapped yet
    const session = await this.prisma.chatSession.create({ data: { userId, source: 'ZALO', status: 'OPEN' } });
    const text = event?.message?.text || event?.event_name || 'Zalo message';
    await this.prisma.chatMessage.create({ data: { sessionId: session.id, role: 'USER', content: text } });
    return session.id;
  }

  async replyToUser(zaloUserId: string, text: string) {
    if (!this.accessToken) throw new UnauthorizedException('Missing ZALO_OA_ACCESS_TOKEN');
    await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
      method: 'POST',
      headers: { 'content-type': 'application/json', access_token: this.accessToken },
      body: JSON.stringify({ recipient: { user_id: zaloUserId }, message: { text } }),
    }).catch(() => undefined);
  }
}


