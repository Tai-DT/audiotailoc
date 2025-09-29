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
    getArticles(status?: string, categoryId?: string, authorId?: string, search?: string, published?: string, page?: number, limit?: number): Promise<{
        data: ({
            blog_categories: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                imageUrl: string;
                isActive: boolean;
                parentId: string;
            };
            blog_comments: {
                content: string;
                id: string;
                createdAt: Date;
                authorName: string;
            }[];
            users: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            status: string;
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            excerpt: string;
            imageUrl: string;
            categoryId: string;
            authorId: string;
            publishedAt: Date;
            viewCount: number;
            likeCount: number;
            commentCount: number;
            seoTitle: string;
            seoDescription: string;
            seoKeywords: string;
            featured: boolean;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getArticleById(id: string): Promise<{
        blog_categories: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
        blog_comments: ({
            users: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            articleId: string;
            authorName: string;
            authorEmail: string;
            isApproved: boolean;
        })[];
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        status: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string;
        imageUrl: string;
        categoryId: string;
        authorId: string;
        publishedAt: Date;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
        featured: boolean;
    }>;
    getArticleBySlug(slug: string): Promise<{
        blog_categories: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
        blog_comments: ({
            users: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            articleId: string;
            authorName: string;
            authorEmail: string;
            isApproved: boolean;
        })[];
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        status: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string;
        imageUrl: string;
        categoryId: string;
        authorId: string;
        publishedAt: Date;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
        featured: boolean;
    }>;
    createArticle(dto: CreateBlogArticleDto, req: AuthenticatedRequest): Promise<{
        blog_categories: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        status: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string;
        imageUrl: string;
        categoryId: string;
        authorId: string;
        publishedAt: Date;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
        featured: boolean;
    }>;
    updateArticle(id: string, dto: UpdateBlogArticleDto): Promise<{
        blog_categories: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        status: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string;
        imageUrl: string;
        categoryId: string;
        authorId: string;
        publishedAt: Date;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
        featured: boolean;
    }>;
    deleteArticle(id: string): Promise<{
        status: string;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string;
        imageUrl: string;
        categoryId: string;
        authorId: string;
        publishedAt: Date;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        seoTitle: string;
        seoDescription: string;
        seoKeywords: string;
        featured: boolean;
    }>;
    getCategories(published?: string, parentId?: string, page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                blog_articles: number;
                subcategories: number;
            };
            parent: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                imageUrl: string;
                isActive: boolean;
                parentId: string;
            };
            subcategories: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                imageUrl: string;
                isActive: boolean;
                parentId: string;
            }[];
        } & {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCategoryById(id: string): Promise<{
        blog_articles: {
            id: string;
            title: string;
            slug: string;
            excerpt: string;
            imageUrl: string;
            publishedAt: Date;
            viewCount: number;
        }[];
        _count: {
            blog_articles: number;
            subcategories: number;
        };
        parent: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
        subcategories: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        }[];
    } & {
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        imageUrl: string;
        isActive: boolean;
        parentId: string;
    }>;
    getCategoryBySlug(slug: string): Promise<{
        blog_articles: {
            id: string;
            title: string;
            slug: string;
            excerpt: string;
            imageUrl: string;
            publishedAt: Date;
            viewCount: number;
        }[];
        _count: {
            blog_articles: number;
            subcategories: number;
        };
        parent: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
        subcategories: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        }[];
    } & {
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        imageUrl: string;
        isActive: boolean;
        parentId: string;
    }>;
    createCategory(dto: CreateBlogCategoryDto): Promise<{
        _count: {
            blog_articles: number;
            subcategories: number;
        };
        parent: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
    } & {
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        imageUrl: string;
        isActive: boolean;
        parentId: string;
    }>;
    updateCategory(id: string, dto: UpdateBlogCategoryDto): Promise<{
        _count: {
            blog_articles: number;
            subcategories: number;
        };
        parent: {
            description: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            parentId: string;
        };
    } & {
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        imageUrl: string;
        isActive: boolean;
        parentId: string;
    }>;
    deleteCategory(id: string): Promise<{
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        imageUrl: string;
        isActive: boolean;
        parentId: string;
    }>;
    getComments(articleId: string, approved?: string, page?: number, limit?: number): Promise<{
        data: ({
            users: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            articleId: string;
            authorName: string;
            authorEmail: string;
            isApproved: boolean;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createComment(dto: CreateBlogCommentDto, req: AuthenticatedRequest): Promise<{
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        articleId: string;
        authorName: string;
        authorEmail: string;
        isApproved: boolean;
    }>;
    updateComment(id: string, dto: UpdateBlogCommentDto): Promise<{
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        articleId: string;
        authorName: string;
        authorEmail: string;
        isApproved: boolean;
    }>;
    approveComment(id: string): Promise<{
        users: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        articleId: string;
        authorName: string;
        authorEmail: string;
        isApproved: boolean;
    }>;
    deleteComment(id: string): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        articleId: string;
        authorName: string;
        authorEmail: string;
        isApproved: boolean;
    }>;
    getAnalytics(): Promise<{
        totalArticles: number;
        publishedArticles: number;
        draftArticles: number;
        totalCategories: number;
        totalComments: number;
        approvedComments: number;
        totalViews: number;
        totalLikes: number;
    }>;
}
export {};
