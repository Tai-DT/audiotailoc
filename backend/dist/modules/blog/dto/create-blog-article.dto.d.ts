export declare enum BlogArticleStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare class CreateBlogArticleDto {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    categoryId: string;
    status?: BlogArticleStatus;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}
export declare class UpdateBlogArticleDto {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    imageUrl?: string;
    categoryId?: string;
    status?: BlogArticleStatus;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}
