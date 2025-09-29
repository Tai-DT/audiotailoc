import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
export declare class NewsletterService {
    private prisma;
    constructor(prisma: PrismaService);
    subscribe(subscribeNewsletterDto: SubscribeNewsletterDto): unknown;
}
