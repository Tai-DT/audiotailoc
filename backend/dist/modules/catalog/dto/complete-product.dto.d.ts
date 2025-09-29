export declare enum ProductSortBy {
    CREATED_AT = "createdAt",
    NAME = "name",
    PRICE = "price",
    UPDATED_AT = "updatedAt",
    VIEW_COUNT = "viewCount"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class ProductSpecificationDto {
    key: string;
    value: string;
}
export declare class CreateProductDto {
    name: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    priceCents: number;
    originalPriceCents?: number;
    stockQuantity?: number;
    maxStock?: number;
    sku?: string;
    warranty?: string;
    features?: string;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    tags?: string;
    categoryId?: string;
    brand?: string;
    model?: string;
    weight?: number;
    dimensions?: string;
    specifications?: Record<string, any>;
    images?: string[];
    isActive?: boolean;
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
}
export declare class UpdateProductDto {
    name?: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    priceCents?: number;
    originalPriceCents?: number;
    stockQuantity?: number;
    maxStock?: number;
    sku?: string;
    warranty?: string;
    features?: string;
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    tags?: string;
    categoryId?: string;
    brand?: string;
    model?: string;
    weight?: number;
    dimensions?: string;
    specifications?: Record<string, any>;
    images?: string[];
    isActive?: boolean;
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
}
export declare class ProductListQueryDto {
    page?: number;
    pageSize?: number;
    sortBy?: ProductSortBy;
    sortOrder?: SortOrder;
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
}
export declare class ProductResponseDto {
    id: string;
    slug: string;
    name: string;
    description?: string;
    shortDescription?: string;
    priceCents: number;
    originalPriceCents?: number;
    stockQuantity: number;
    maxStock?: number;
    sku?: string;
    warranty?: string;
    features?: string;
    minOrderQuantity: number;
    maxOrderQuantity?: number;
    tags?: string;
    categories?: any;
    brand?: string;
    model?: string;
    weight?: number;
    dimensions?: string;
    specifications?: Record<string, any>;
    images?: string[];
    isActive: boolean;
    featured: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
}
export declare class ProductListResponseDto {
    items: ProductResponseDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class ProductAnalyticsDto {
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
    outOfStockProducts: number;
    totalViews: number;
    averagePrice: number;
    productsByCategory: Record<string, number>;
    topViewedProducts: ProductResponseDto[];
    recentProducts: ProductResponseDto[];
}
export declare class BulkUpdateProductsDto {
    productIds: string[];
    isActive?: boolean;
    featured?: boolean;
    addTags?: string;
    removeTags?: string;
    categoryId?: string;
}
export declare class ProductSearchSuggestionDto {
    text: string;
    type: 'product' | 'category' | 'brand';
    count?: number;
}
export declare class ImportResultDto {
    imported: number;
    errors: string[];
}
