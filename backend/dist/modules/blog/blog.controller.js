"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const blog_service_1 = require("./blog.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const create_blog_article_dto_1 = require("./dto/create-blog-article.dto");
const create_blog_category_dto_1 = require("./dto/create-blog-category.dto");
const create_blog_comment_dto_1 = require("./dto/create-blog-comment.dto");
const prisma_service_1 = require("../../prisma/prisma.service");
let BlogController = class BlogController {
    constructor(blogService, prisma) {
        this.blogService = blogService;
        this.prisma = prisma;
    }
    async getArticles(status, categoryId, authorId, search, published, page, limit) {
        const publishedValue = published ? published === 'true' : undefined;
        return this.blogService.getArticles({
            status,
            categoryId,
            authorId,
            search,
            published: publishedValue,
            page,
            limit,
        });
    }
    async getArticleById(id) {
        return this.blogService.getArticleById(id);
    }
    async getArticleBySlug(slug) {
        return this.blogService.getArticleBySlug(slug);
    }
    async createArticle(dto, req) {
        let userId = req.user?.sub || req.user?.id;
        if (!userId) {
            const systemUser = await this.prisma.users.findFirst({
                where: { email: 'system@audiotailoc.com' }
            });
            if (systemUser) {
                userId = systemUser.id;
            }
            else {
                const newSystemUser = await this.prisma.users.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        email: 'system@audiotailoc.com',
                        name: 'System User',
                        password: 'system-password',
                        role: 'ADMIN',
                        updatedAt: new Date()
                    }
                });
                userId = newSystemUser.id;
            }
        }
        return this.blogService.createArticle(dto, userId);
    }
    async updateArticle(id, dto) {
        return this.blogService.updateArticle(id, dto);
    }
    async deleteArticle(id) {
        return this.blogService.deleteArticle(id);
    }
    async getCategories(published, parentId, page, limit) {
        const publishedValue = published ? published === 'true' : true;
        return this.blogService.getCategories({
            published: publishedValue,
            parentId,
            page,
            limit,
        });
    }
    async getCategoryById(id) {
        return this.blogService.getCategoryById(id);
    }
    async getCategoryBySlug(slug) {
        return this.blogService.getCategoryBySlug(slug);
    }
    async createCategory(dto) {
        return this.blogService.createCategory(dto);
    }
    async updateCategory(id, dto) {
        return this.blogService.updateCategory(id, dto);
    }
    async deleteCategory(id) {
        return this.blogService.deleteCategory(id);
    }
    async getComments(articleId, approved, page, limit) {
        const approvedValue = approved ? approved === 'true' : undefined;
        return this.blogService.getComments(articleId, approvedValue, page, limit);
    }
    async createComment(dto, req) {
        const userId = req.user?.sub || req.user?.id || 'anonymous';
        return this.blogService.createComment(dto, userId);
    }
    async updateComment(id, dto) {
        return this.blogService.updateComment(id, dto);
    }
    async approveComment(id) {
        return this.blogService.approveComment(id);
    }
    async deleteComment(id) {
        return this.blogService.deleteComment(id);
    }
    async getAnalytics() {
        return this.blogService.getAnalytics();
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('authorId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('published')),
    __param(5, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(6, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getArticleById", null);
__decorate([
    (0, common_1.Get)('articles/slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getArticleBySlug", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('articles'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_article_dto_1.CreateBlogArticleDto, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "createArticle", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Put)('articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_blog_article_dto_1.UpdateBlogArticleDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "updateArticle", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)('articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "deleteArticle", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Query)('published')),
    __param(1, (0, common_1.Query)('parentId')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Get)('categories/slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getCategoryBySlug", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_category_dto_1.CreateBlogCategoryDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "createCategory", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_blog_category_dto_1.UpdateBlogCategoryDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('articles/:articleId/comments'),
    __param(0, (0, common_1.Param)('articleId')),
    __param(1, (0, common_1.Query)('approved')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('comments'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_comment_dto_1.CreateBlogCommentDto, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Put)('comments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_blog_comment_dto_1.UpdateBlogCommentDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Post)('comments/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "approveComment", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Delete)('comments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.UseGuards)(admin_or_key_guard_1.AdminOrKeyGuard),
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getAnalytics", null);
exports.BlogController = BlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService,
        prisma_service_1.PrismaService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map