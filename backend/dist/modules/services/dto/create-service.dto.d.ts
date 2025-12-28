export declare class CreateServiceDto {
    name: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    typeId?: string;
    priceType?: string;
    minPrice?: number;
    maxPrice?: number;
    basePriceCents?: number;
    price?: number;
    priceCurrency?: string;
    estimatedDuration: number;
    duration?: number;
    imageUrl?: string;
    images?: string[];
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
    features?: string[];
    requirements?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
}
