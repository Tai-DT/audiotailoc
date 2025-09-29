export declare class CreatePromotionDto {
    code: string;
    name: string;
    description?: string;
    type: string;
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    customerSegments?: string[];
    categories?: string[];
    products?: string[];
    createdBy?: string;
}
