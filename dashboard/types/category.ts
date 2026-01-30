export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    parentId?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
}

export interface CreateCategoryData {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}

export interface UpdateCategoryData {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
