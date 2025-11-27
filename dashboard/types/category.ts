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
}

export interface CreateCategoryData {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive?: boolean;
}

export interface UpdateCategoryData {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    isActive?: boolean;
}
