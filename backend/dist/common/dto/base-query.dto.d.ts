export declare class BaseQueryDto {
    page?: number;
    pageSize?: number;
    q?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class DateRangeDto {
    startDate?: string;
    endDate?: string;
}
export declare class PriceRangeDto {
    minPrice?: number;
    maxPrice?: number;
}
export declare class BulkActionDto {
    ids?: string[];
    action?: string;
}
