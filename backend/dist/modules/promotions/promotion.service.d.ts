import { PrismaService } from '../../prisma/prisma.service';
export declare class PromotionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(code?: string): Promise<{
        code: string;
        type: 'PERCENT' | 'FIXED';
        value: number;
    } | null>;
    computeDiscount(promo: {
        type: 'PERCENT' | 'FIXED';
        value: number;
    } | null, subtotal: number): number;
}
