import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 200, description: 'Successfully subscribed to newsletter' })
  @ApiResponse({ status: 400, description: 'Invalid email or already subscribed' })
  async subscribe(@Body() subscribeNewsletterDto: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(subscribeNewsletterDto);
  }
}