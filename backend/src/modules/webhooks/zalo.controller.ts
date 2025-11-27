import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ZaloService } from './zalo.service';

@Controller('webhooks/zalo')
export class ZaloWebhookController {
  constructor(private readonly zalo: ZaloService) {}

  @Post()
  @HttpCode(200)
  async handle(@Headers() headers: Record<string, string>, @Body() body: any) {
    // Verify signature if provided
    await this.zalo.handleIncoming(headers, body);
    return { ok: true };
  }
}
