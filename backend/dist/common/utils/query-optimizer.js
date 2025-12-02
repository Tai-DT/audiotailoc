"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOptimizer = void 0;
class QueryOptimizer {
    static optimizePagination(params, maxPageSize = 100) {
        const pageSize = Math.min(params.pageSize || 20, maxPageSize);
        if (params.cursor) {
            return {
                take: pageSize,
                cursor: { id: params.cursor },
                skip: 1,
                orderBy: params.orderBy || { id: 'asc' },
            };
        }
        else {
            const page = Math.max(1, params.page || 1);
            return {
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: params.orderBy || { createdAt: 'desc' },
            };
        }
    }
    static optimizeSearch(searchTerm, fields) {
        if (!searchTerm || searchTerm.length < 2) {
            return {};
        }
        if (process.env.DATABASE_URL?.includes('postgresql')) {
            return {
                search: searchTerm,
            };
        }
        const searchConditions = fields.map(field => ({
            [field]: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        }));
        return searchConditions.length === 1 ? searchConditions[0] : searchConditions;
    }
    static optimizeIncludes(baseInclude, requestedFields) {
        if (!requestedFields || requestedFields.length === 0) {
            return baseInclude;
        }
        const optimizedInclude = {};
        for (const [key, value] of Object.entries(baseInclude)) {
            if (requestedFields.includes(key)) {
                optimizedInclude[key] = value;
            }
        }
        return optimizedInclude;
    }
    static buildWhereClause(filters) {
        const where = {};
        for (const [key, value] of Object.entries(filters)) {
            if (value === undefined || value === null || value === '') {
                continue;
            }
            switch (key) {
                case 'search':
                    if (typeof value === 'string' && value.length >= 2) {
                        where.OR = [
                            { name: { contains: value, mode: 'insensitive' } },
                            { description: { contains: value, mode: 'insensitive' } },
                        ];
                    }
                    break;
                case 'minPrice':
                    where.priceCents = { ...where.priceCents, gte: value };
                    break;
                case 'maxPrice':
                    where.priceCents = { ...where.priceCents, lte: value };
                    break;
                case 'categoryId':
                    if (Array.isArray(value)) {
                        where.categoryId = { in: value };
                    }
                    else {
                        where.categoryId = value;
                    }
                    break;
                case 'tags':
                    if (Array.isArray(value) && value.length > 0) {
                        where.tags = {
                            hasSome: value,
                        };
                    }
                    break;
                case 'inStock':
                    if (typeof value === 'boolean') {
                        where.inStock = value;
                    }
                    break;
                case 'featured':
                    if (typeof value === 'boolean') {
                        where.featured = value;
                    }
                    break;
                case 'dateRange':
                    if (value.from || value.to) {
                        where.createdAt = {};
                        if (value.from)
                            where.createdAt.gte = new Date(value.from);
                        if (value.to)
                            where.createdAt.lte = new Date(value.to);
                    }
                    break;
                default:
                    where[key] = value;
            }
        }
        return where;
    }
    static optimizeOrderBy(sortBy, sortOrder, defaultSort = { createdAt: 'desc' }) {
        if (!sortBy) {
            return defaultSort;
        }
        const order = sortOrder || 'desc';
        const sortMapping = {
            'name': { name: order },
            'price': { priceCents: order },
            'created': { createdAt: order },
            'updated': { updatedAt: order },
            'popularity': [
                { featured: 'desc' },
                { viewCount: 'desc' },
                { createdAt: 'desc' },
            ],
            'relevance': [
                { featured: 'desc' },
                { _relevance: 'desc' },
                { createdAt: 'desc' },
            ],
        };
        return sortMapping[sortBy] || { [sortBy]: order };
    }
    static suggestIndexes(queryPatterns) {
        const suggestions = [];
        const tablePatterns = queryPatterns.reduce((acc, pattern) => {
            if (!acc[pattern.table]) {
                acc[pattern.table] = [];
            }
            acc[pattern.table].push(pattern);
            return acc;
        }, {});
        for (const [table, patterns] of Object.entries(tablePatterns)) {
            const fieldUsage = {};
            patterns.forEach(pattern => {
                [...pattern.whereFields, ...pattern.orderByFields].forEach(field => {
                    fieldUsage[field] = (fieldUsage[field] || 0) + pattern.frequency;
                });
            });
            for (const [field, frequency] of Object.entries(fieldUsage)) {
                if (frequency > 100) {
                    suggestions.push({
                        table,
                        fields: [field],
                        type: this.getIndexType(field),
                        priority: frequency > 1000 ? 'high' : 'medium',
                    });
                }
            }
            const commonCombinations = this.findCommonFieldCombinations(patterns);
            commonCombinations.forEach(combination => {
                suggestions.push({
                    table,
                    fields: combination.fields,
                    type: 'btree',
                    priority: combination.frequency > 500 ? 'high' : 'medium',
                });
            });
        }
        return suggestions;
    }
    static getIndexType(field) {
        if (field.includes('tags') || field.includes('search')) {
            return 'gin';
        }
        if (field.includes('location') || field.includes('geo')) {
            return 'gist';
        }
        return 'btree';
    }
    static findCommonFieldCombinations(patterns) {
        const combinations = {};
        patterns.forEach(pattern => {
            const allFields = [...pattern.whereFields, ...pattern.orderByFields];
            for (let i = 0; i < allFields.length; i++) {
                for (let j = i + 1; j < allFields.length; j++) {
                    const combo = [allFields[i], allFields[j]].sort().join(',');
                    combinations[combo] = (combinations[combo] || 0) + pattern.frequency;
                    for (let k = j + 1; k < allFields.length; k++) {
                        const combo3 = [allFields[i], allFields[j], allFields[k]].sort().join(',');
                        combinations[combo3] = (combinations[combo3] || 0) + pattern.frequency;
                    }
                }
            }
        });
        return Object.entries(combinations)
            .filter(([, frequency]) => frequency > 50)
            .map(([fields, frequency]) => ({
            fields: fields.split(','),
            frequency,
        }))
            .sort((a, b) => b.frequency - a.frequency);
    }
}
exports.QueryOptimizer = QueryOptimizer;
//# sourceMappingURL=query-optimizer.js.map