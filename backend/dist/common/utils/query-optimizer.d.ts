import { Prisma } from '@prisma/client';
export declare class QueryOptimizer {
    static optimizePagination<_T>(params: {
        page?: number;
        pageSize?: number;
        cursor?: string;
        orderBy?: any;
    }, maxPageSize?: number): {
        skip?: number;
        take: number;
        cursor?: any;
        orderBy?: any;
    };
    static optimizeSearch(searchTerm: string, fields: string[]): Prisma.StringFilter | Prisma.StringFilter[];
    static optimizeIncludes<T>(baseInclude: T, requestedFields?: string[]): T;
    static buildWhereClause(filters: Record<string, any>): any;
    static optimizeOrderBy(sortBy?: string, sortOrder?: 'asc' | 'desc', defaultSort?: any): any;
    static suggestIndexes(queryPatterns: Array<{
        table: string;
        whereFields: string[];
        orderByFields: string[];
        frequency: number;
    }>): Array<{
        table: string;
        fields: string[];
        type: 'btree' | 'gin' | 'gist';
        priority: 'high' | 'medium' | 'low';
    }>;
    private static getIndexType;
    private static findCommonFieldCombinations;
}
