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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { page = 1, limit = 10, status, featured, category } = params;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (status) {
            where.status = status;
        }
        if (featured !== undefined) {
            where.isFeatured = featured;
        }
        if (category) {
            where.category = category;
        }
        const [projects, total] = await Promise.all([
            this.prisma.projects.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { displayOrder: 'asc' },
                    { createdAt: 'desc' },
                ],
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.projects.count({ where }),
        ]);
        return {
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findFeatured() {
        try {
            return await this.prisma.projects.findMany({
                where: {
                    isActive: true,
                    isFeatured: true,
                },
                orderBy: [
                    { displayOrder: 'asc' },
                    { createdAt: 'desc' },
                ],
                take: 6,
            });
        }
        catch (error) {
            console.error('Error fetching featured projects:', error);
            return [];
        }
    }
    async findBySlug(slug) {
        const project = await this.prisma.projects.findUnique({
            where: { slug },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await this.prisma.projects.update({
            where: { id: project.id },
            data: { viewCount: { increment: 1 } },
        });
        return project;
    }
    async findById(id) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return project;
    }
    async create(data) {
        if (!data.slug) {
            data.slug = this.generateSlug(data.name);
        }
        const existingProject = await this.prisma.projects.findUnique({
            where: { slug: data.slug },
        });
        if (existingProject) {
            data.slug = `${data.slug}-${Date.now()}`;
        }
        const jsonFields = ['technologies', 'features', 'images', 'tags'];
        for (const field of jsonFields) {
            if (data[field] && typeof data[field] === 'string') {
                try {
                    data[field] = JSON.stringify(JSON.parse(data[field]));
                }
                catch (e) {
                }
            }
            else if (data[field] && Array.isArray(data[field])) {
                data[field] = JSON.stringify(data[field]);
            }
        }
        if (data.youtubeVideoUrl) {
            data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
        }
        return this.prisma.projects.create({
            data,
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (data.name && data.name !== project.name && !data.slug) {
            data.slug = this.generateSlug(data.name);
            const existingProject = await this.prisma.projects.findFirst({
                where: {
                    slug: data.slug,
                    NOT: { id },
                },
            });
            if (existingProject) {
                data.slug = `${data.slug}-${Date.now()}`;
            }
        }
        const jsonFields = ['technologies', 'features', 'images', 'tags'];
        for (const field of jsonFields) {
            if (data[field] && typeof data[field] === 'string') {
                try {
                    data[field] = JSON.stringify(JSON.parse(data[field]));
                }
                catch (e) {
                }
            }
            else if (data[field] && Array.isArray(data[field])) {
                data[field] = JSON.stringify(data[field]);
            }
        }
        if (data.youtubeVideoUrl) {
            data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
        }
        return this.prisma.projects.update({
            where: { id },
            data,
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        await this.prisma.projects.delete({
            where: { id },
        });
        return { message: 'Project deleted successfully' };
    }
    async toggleFeatured(id) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.prisma.projects.update({
            where: { id },
            data: { isFeatured: !project.isFeatured },
        });
    }
    async toggleActive(id) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.prisma.projects.update({
            where: { id },
            data: { isActive: !project.isActive },
        });
    }
    async updateDisplayOrder(id, displayOrder) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.prisma.projects.update({
            where: { id },
            data: { displayOrder },
        });
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    extractYouTubeId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    async updateImages(id, imageData) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.prisma.projects.update({
            where: { id },
            data: imageData,
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map