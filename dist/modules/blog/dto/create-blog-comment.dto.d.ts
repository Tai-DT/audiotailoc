export declare class CreateBlogCommentDto {
    articleId: string;
    content: string;
    authorName?: string;
    authorEmail?: string;
}
export declare class UpdateBlogCommentDto {
    content?: string;
    authorName?: string;
    authorEmail?: string;
}
