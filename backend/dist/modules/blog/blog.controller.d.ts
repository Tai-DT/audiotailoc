import { Request } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogArticleDto, UpdateBlogArticleDto } from './dto/create-blog-article.dto';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto/create-blog-category.dto';
import { CreateBlogCommentDto, UpdateBlogCommentDto } from './dto/create-blog-comment.dto';
import { PrismaService } from '../../prisma/prisma.service';
interface AuthenticatedRequest extends Request {
    user?: {
        sub?: string;
        id?: string;
        email?: string;
        role?: string;
    };
}
export declare class BlogController {
    private readonly blogService;
    private readonly prisma;
    constructor(blogService: BlogService, prisma: PrismaService);
    getArticles(status?: string, categoryId?: string, authorId?: string, search?: string, published?: string, page?: number, limit?: number): unknown;
    getArticleById(id: string): unknown;
    getArticleBySlug(slug: string): unknown;
    createArticle(dto: CreateBlogArticleDto, req: AuthenticatedRequest): unknown;
    updateArticle(id: string, dto: UpdateBlogArticleDto): unknown;
    deleteArticle(id: string): unknown;
    getCategories(published?: string, parentId?: string, page?: number, limit?: number): unknown;
    getCategoryById(id: string): unknown;
    getCategoryBySlug(slug: string): unknown;
    createCategory(dto: CreateBlogCategoryDto): unknown;
    updateCategory(id: string, dto: UpdateBlogCategoryDto): unknown;
    deleteCategory(id: string): unknown;
    getComments(articleId: string, approved?: string, page?: number, limit?: number): unknown;
    createComment(dto: CreateBlogCommentDto, req: AuthenticatedRequest): unknown;
    updateComment(id: string, dto: UpdateBlogCommentDto): unknown;
    approveComment(id: string): unknown;
    deleteComment(id: string): unknown;
    getAnalytics(): unknown;
}
export {};
