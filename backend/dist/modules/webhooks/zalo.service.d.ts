import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ZaloService {
    private readonly cfg;
    private readonly prisma;
    constructor(cfg: ConfigService, prisma: PrismaService);
    private get accessToken();
    private get secret();
    handleIncoming(headers: Record<string, string>, body: any): Promise<string>;
    replyToUser(zaloUserId: string, text: string): Promise<void>;
}
