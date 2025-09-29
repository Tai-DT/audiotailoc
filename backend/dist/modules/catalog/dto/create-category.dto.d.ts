export declare class CreateCategoryDto {
    name: string;
    slug: string;
    parentId?: string;
    isActive?: boolean;
}
export declare class UpdateCategoryDto {
    name?: string;
    slug?: string;
    parentId?: string;
    isActive?: boolean;
}
