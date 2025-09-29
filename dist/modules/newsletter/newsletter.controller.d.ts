import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
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
