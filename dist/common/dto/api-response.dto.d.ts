export declare class ApiResponseDto<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp?: string;
    requestId?: string;
}
export declare class PaginationDto {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
    pagination: PaginationDto;
}
export declare class ErrorResponseDto {
    success: boolean;
    message: string;
    errorCode?: string;
    errors?: string[];
    timestamp: string;
    requestId?: string;
    path?: string;
}
export declare class HealthCheckDto {
    status: string;
    uptime: number;
    version: string;
    environment?: string;
    info?: Record<string, any>;
}
