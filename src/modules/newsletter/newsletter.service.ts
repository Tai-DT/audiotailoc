import { Injectable, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(subscribeNewsletterDto: SubscribeNewsletterDto) {
    const { email, name } = subscribeNewsletterDto;

    // Check if email already exists
    const existingSubscription = await this.prisma.newsletter_subscriptions.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      throw new ConflictException('Email already subscribed to newsletter');
    }

    // Create subscription
    const subscription = await this.prisma.newsletter_subscriptions.create({
      data: {
        id: randomUUID(),
        email,
        name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      message: 'Successfully subscribed to newsletter',
      subscription: {
        id: subscription.id,
        email: subscription.email,
        name: subscription.name,
        subscribedAt: subscription.createdAt,
      },
    };
  }
}