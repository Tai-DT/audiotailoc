import { CompleteProductService } from '../services/complete-product.service';
import { CreateProductDto, UpdateProductDto, BulkUpdateProductsDto, ProductResponseDto, ProductListResponseDto, ProductAnalyticsDto, ProductListQueryDto, ProductSearchSuggestionDto } from '../dto/complete-product.dto';
export declare class CompleteProductController {
    private readonly catalogService;
    private readonly logger;
    constructor(catalogService: CompleteProductService);
    create(createProductDto: CreateProductDto): Promise<ProductResponseDto>;
    findAll(query: ProductListQueryDto): Promise<ProductListResponseDto>;
    search(query: string, limit?: number): Promise<ProductListResponseDto>;
    getSuggestions(query: string, limit?: number): Promise<ProductSearchSuggestionDto[]>;
    findOne(id: string): Promise<ProductResponseDto>;
    findBySlug(slug: string): Promise<ProductResponseDto>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto>;
    remove(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    checkDeletable(id: string): Promise<{
        canDelete: boolean;
        message: string;
        associatedOrdersCount: number;
    }>;
    bulkDelete(ids: string[]): Promise<void>;
    bulkUpdate(bulkUpdateDto: BulkUpdateProductsDto): Promise<{
        updated: number;
    }>;
    duplicate(id: string): Promise<ProductResponseDto>;
    incrementView(id: string): Promise<void>;
    getAnalytics(): Promise<ProductAnalyticsDto>;
    getTopViewed(limit?: number): Promise<ProductResponseDto[]>;
    getRecent(limit?: number): Promise<ProductResponseDto[]>;
    exportCsv(): Promise<string>;
    importCsv(csvData: string): Promise<{
        imported: number;
        errors: string[];
    }>;
    getRecentPublic(limit?: number): Promise<ProductResponseDto[]>;
    getTopViewedPublic(limit?: number): Promise<ProductResponseDto[]>;
    getOverviewPublic(): Promise<{
        totalProducts: number;
        featuredProducts: number;
        categoriesCount: number;
        recentProducts: ProductResponseDto[];
    }>;
}
