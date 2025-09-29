import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';
type PromotionResponse = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    type: string;
    value: number;
    minOrderAmount?: number | null;
    maxDiscount?: number | null;
    usageLimit?: number | null;
    usageCount: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    categories: string[];
    products: string[];
    customerSegments: string[];
    createdAt: string;
    updatedAt: string;
    createdBy?: string | null;
};
export declare class PromotionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(params: ListPromotionsDto): Promise<{
        promotions: PromotionResponse[];
        total: number;
        page: number;
        pageSize: number;
        stats: {
            totalPromotions: number;
            activePromotions: number;
            expiredPromotions: number;
            totalSavings: number;
            totalUsage: number;
            conversionRate: number;
        };
    }>;
    getById(id: string): Promise<PromotionResponse>;
    create(dto: CreatePromotionDto): Promise<PromotionResponse>;
    update(id: string, dto: UpdatePromotionDto): Promise<PromotionResponse>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    duplicate(id: string): Promise<PromotionResponse>;
    validate(code?: string): Promise<{
        code: string;
        type: 'PERCENT' | 'FIXED';
        value: number;
    } | null>;
    computeDiscount(promo: {
        type: 'PERCENT' | 'FIXED';
        value: number;
    } | null, subtotal: number): number;
    private buildWhere;
    private ensureUniqueCode;
    private toCreateData;
    private toUpdateData;
    private buildMetadata;
    private toResponse;
    private buildStats;
    private mapTypeToDb;
    private mapTypeToResponse;
    private normalizeTypeForCheckout;
    private generateUniqueCode;
}
export {};
