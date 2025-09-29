import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
export declare class NewsletterService {
    private prisma;
    constructor(prisma: PrismaService);
    subscribe(subscribeNewsletterDto: SubscribeNewsletterDto): Promise<{
        message: string;
        subscription: {
            id: string;
            email: string;
            name: string;
            subscribedAt: Date;
        };
    }>;
}
