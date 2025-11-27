import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('notifications/telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() update: any,
    @Headers('x-telegram-bot-api-secret-token') secretToken: string,
  ) {
    // Verify secret token if configured
    const configuredSecret = this.telegramService.getWebhookSecret();
    if (configuredSecret && secretToken !== configuredSecret) {
      this.logger.warn(`Invalid Telegram secret token provided: ${secretToken}`);
      throw new ForbiddenException('Invalid secret token');
    }

    try {
      await this.telegramService.handleUpdate(update);
      return { ok: true };
    } catch (error) {
      this.logger.error('Failed to handle Telegram update', error);
      // Always return 200 OK to Telegram to prevent retries of bad updates
      return { ok: true };
    }
  }
}
