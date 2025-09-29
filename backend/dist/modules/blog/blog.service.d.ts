import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogArticleDto, UpdateBlogArticleDto } from './dto/create-blog-article.dto';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogCommentDto, UpdateBlogCommentDto } from './dto/create-blog-comment.dto';
interface BlogArticleQuery {
    status?: string;
    categoryId?: string;
    authorId?: string;
    search?: string;
    published?: boolean;
    page?: number;
    limit?: number;
}
interface BlogCategoryQuery {
    published?: boolean;
    parentId?: string;
    page?: number;
    limit?: number;
}
export declare class BlogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getArticles(query?: BlogArticleQuery): unknown;
    getArticleById(id: string): unknown;
    getArticleBySlug(slug: string): unknown;
    createArticle(dto: CreateBlogArticleDto, authorId: string): unknown;
    updateArticle(id: string, dto: UpdateBlogArticleDto): unknown;
    deleteArticle(id: string): unknown;
    getCategories(query?: BlogCategoryQuery): unknown;
    getCategoryById(id: string): unknown;
    getCategoryBySlug(slug: string): unknown;
    createCategory(dto: CreateBlogCategoryDto): unknown;
    updateCategory(id: string, dto: UpdateBlogCategoryDto): unknown;
    deleteCategory(id: string): unknown;
    getComments(articleId: string, approved?: boolean, page?: number, limit?: number): unknown;
    createComment(dto: CreateBlogCommentDto, authorId?: string): unknown;
    updateComment(id: string, dto: UpdateBlogCommentDto): unknown;
    approveComment(id: string): unknown;
    deleteComment(id: string): unknown;
    getAnalytics(): unknown;
}
export {};
