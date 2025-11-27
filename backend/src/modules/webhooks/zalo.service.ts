import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

@Injectable()
export class ZaloService {
  constructor(
    private readonly cfg: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private get accessToken() {
    return this.cfg.get<string>('ZALO_OA_ACCESS_TOKEN') || '';
  }
  private get secret() {
    return this.cfg.get<string>('ZALO_OA_SECRET') || '';
  }

  private verifySignature(headers: Record<string, string>, body: any): boolean {
    const signatureHeader = headers['x-zalo-signature'] || headers['X-Zalo-Signature'] || '';
    if (!this.secret || !signatureHeader) {
      // If no secret or signature provided, skip verification but return false to indicate not verified
      return false;
    }

    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(payload);
    const expected = hmac.digest('hex');
    return expected === signatureHeader;
  }

  async handleIncoming(headers: Record<string, string>, body: any) {
    const signatureValid = this.verifySignature(headers, body);
    if (this.secret && !signatureValid) {
      throw new UnauthorizedException('Invalid Zalo signature');
    }

    const event = body;
    // Handle Zalo customer support messages
    const userId = null; // external user not mapped yet
    const text = event?.message?.text || event?.event_name || 'Zalo message';

    // Create a customer question instead of chat session/message
    const customerQuestion = await this.prisma.customer_questions.create({
      data: {
        id: randomUUID(),
        question: String(text),
        category: 'ZALO_SUPPORT',
        updatedAt: new Date(),
        ...(userId && { users: { connect: { id: userId } } }),
      },
    });

    return customerQuestion.id;
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
