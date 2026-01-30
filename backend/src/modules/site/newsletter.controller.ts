import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsletterSubscriptionDto } from './dto/newsletter-subscription.dto';
import { TelegramService } from '../notifications/telegram.service';
import { Optional } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@ApiTags('site')
@Controller('site/newsletter')
export class NewsletterController {
  private readonly logger = new Logger(NewsletterController.name);

  constructor(
    private readonly newsletterService: NewsletterService,
    @Optional() private readonly telegramService?: TelegramService,
  ) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Subscription received' })
  async subscribe(@Body() payload: NewsletterSubscriptionDto) {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name?.trim();

    this.logger.log(`Newsletter subscription received: ${email}`);
    const { subscription, created, reactivated } = await this.newsletterService.subscribe(
      email,
      name,
    );

    if (this.telegramService && (created || reactivated)) {
      const message = [
        '📩 Đăng ký nhận tin mới',
        `• Email: ${email}`,
        `• Tên: ${name || 'N/A'}`,
      ].join('\n');
      try {
        await this.telegramService.sendMessage(message);
      } catch (error) {
        this.logger.error('Failed to send newsletter notification', error);
      }
    }

    return {
      success: true,
      message: created ? 'Đăng ký nhận tin thành công' : 'Email đã được đăng ký trước đó',
      data: {
        id: subscription.id,
        email: subscription.email,
        name: subscription.name,
        isActive: subscription.isActive,
        createdAt: subscription.createdAt,
      },
    };
  }
}
