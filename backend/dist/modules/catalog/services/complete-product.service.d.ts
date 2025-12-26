import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductListQueryDto, ProductResponseDto, ProductListResponseDto, ProductAnalyticsDto, BulkUpdateProductsDto, ProductSearchSuggestionDto } from '../dto/complete-product.dto';
export declare class CompleteProductService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto>;
    findProducts(query: ProductListQueryDto): Promise<ProductListResponseDto>;
    searchProducts(query: ProductListQueryDto): Promise<ProductListResponseDto>;
    getSearchSuggestions(query: string, limit?: number): Promise<ProductSearchSuggestionDto[]>;
    findProductById(id: string): Promise<ProductResponseDto>;
    findProductBySlug(slug: string): Promise<ProductResponseDto>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto>;
    deleteProduct(id: string): Promise<{
        deleted: boolean;
        message?: string;
    }>;
    bulkDeleteProducts(ids: string[]): Promise<void>;
    bulkUpdateProducts(bulkUpdateDto: BulkUpdateProductsDto): Promise<{
        updated: number;
    }>;
    duplicateProduct(id: string): Promise<ProductResponseDto>;
    incrementProductView(id: string): Promise<void>;
    getProductAnalytics(): Promise<ProductAnalyticsDto>;
    getTopViewedProducts(limit?: number): Promise<ProductResponseDto[]>;
    getRecentProducts(limit?: number): Promise<ProductResponseDto[]>;
    exportProductsToCsv(): Promise<string>;
    importProductsFromCsv(csvData: string): Promise<{
        imported: number;
        errors: string[];
    }>;
    private parseCsvLine;
    private generateSlug;
    private mapToProductResponse;
    checkProductDeletable(id: string): Promise<{
        canDelete: boolean;
        message: string;
        associatedOrdersCount: number;
    }>;
}
