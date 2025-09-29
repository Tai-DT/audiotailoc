import { ZaloService } from './zalo.service';
export declare class ZaloWebhookController {
    private readonly zalo;
    constructor(zalo: ZaloService);
    handle(headers: Record<string, string>, body: any): Promise<{
        ok: boolean;
    }>;
}
