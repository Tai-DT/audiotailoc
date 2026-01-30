import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async subscribe(email: string, name?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name?.trim() || null;

    const existing = await this.prisma.newsletter_subscriptions.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      const shouldReactivate = !existing.isActive;
      const shouldUpdateName = normalizedName && normalizedName !== existing.name;

      if (shouldReactivate || shouldUpdateName) {
        const updated = await this.prisma.newsletter_subscriptions.update({
          where: { email: normalizedEmail },
          data: {
            isActive: true,
            name: shouldUpdateName ? normalizedName : existing.name,
            updatedAt: new Date(),
          },
        });

        return { subscription: updated, created: false, reactivated: shouldReactivate };
      }

      return { subscription: existing, created: false, reactivated: false };
    }

    const subscription = await this.prisma.newsletter_subscriptions.create({
      data: {
        id: randomUUID(),
        email: normalizedEmail,
        name: normalizedName,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Newsletter subscription created: ${normalizedEmail}`);

    return { subscription, created: true, reactivated: false };
  }
}
