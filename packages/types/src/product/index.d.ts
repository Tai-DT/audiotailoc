export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice?: number;
    stock: number;
    sku?: string;
    category?: string;
    brand?: string;
    weight?: number;
    dimensions?: string;
    specifications?: string;
    tags?: string[];
    images?: ProductImage[];
    isActive: boolean;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ProductImage {
    id: string;
    url: string;
    alt?: string;
    isMain: boolean;
    order: number;
}
export interface CreateProductRequest {
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice?: number;
    stock?: number;
    sku?: string;
    category?: string;
    brand?: string;
    weight?: number;
    dimensions?: string;
    specifications?: string;
    tags?: string[];
    images?: CreateProductImageRequest[];
    isActive?: boolean;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}
export interface CreateProductImageRequest {
    url: string;
    alt?: string;
    isMain?: boolean;
}
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
}
export interface ProductFilters {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    tags?: string[];
    isActive?: boolean;
}
export interface ProductSort {
    field: 'name' | 'price' | 'createdAt' | 'updatedAt';
    order: 'asc' | 'desc';
}
//# sourceMappingURL=index.d.ts.map