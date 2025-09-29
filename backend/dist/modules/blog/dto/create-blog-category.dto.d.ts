export declare class CreateBlogCategoryDto {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    sortOrder?: number;
}
export declare class UpdateBlogCategoryDto {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    sortOrder?: number;
}
