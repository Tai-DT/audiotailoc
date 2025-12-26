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
    normalizeStringArrayField(value) {
        if (value === undefined || value === null)
            return undefined;
        if (Array.isArray(value)) {
            const items = value
                .map(v => (v === null || v === undefined ? '' : String(v).trim()))
                .filter(v => v && v !== '[' && v !== ']');
            return items.length ? JSON.stringify(items) : undefined;
        }
        if (typeof value !== 'string')
            return undefined;
        const trimmed = value.trim();
        if (!trimmed)
            return undefined;
        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    const items = parsed
                        .map(v => (v === null || v === undefined ? '' : String(v).trim()))
                        .filter(v => v && v !== '[' && v !== ']');
                    return items.length ? JSON.stringify(items) : undefined;
                }
                if (typeof parsed === 'string') {
                    const item = parsed.trim();
                    return item && item !== '[' && item !== ']' ? JSON.stringify([item]) : undefined;
                }
            }
            catch {
                if (trimmed === '[' || trimmed === '[]')
                    return undefined;
            }
        }
        const parts = trimmed
            .split(',')
            .map(p => p.trim())
            .filter(p => p && p !== '[' && p !== ']');
        return parts.length ? JSON.stringify(parts) : undefined;
    }
    normalizeProjectJsonFields(data) {
        const jsonFields = ['technologies', 'features', 'images', 'tags', 'galleryImages'];
        for (const field of jsonFields) {
            if (data[field] === undefined)
                continue;
            const normalized = this.normalizeStringArrayField(data[field]);
            if (normalized !== undefined) {
                data[field] = normalized;
            }
        }
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
        if (category) {
            where.category = category;
        }
        try {
            const [projects, total] = await Promise.all([
                this.prisma.projects.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: [{ createdAt: 'desc' }],
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
            let filteredProjects = projects;
            if (featured !== undefined) {
                filteredProjects = projects.filter((p) => {
                    const isFeaturedValue = p.isFeatured !== undefined
                        ? p.isFeatured
                        : p.featured !== undefined
                            ? p.featured
                            : false;
                    return featured ? isFeaturedValue : !isFeaturedValue;
                });
            }
            return {
                data: filteredProjects,
                meta: {
                    total: featured !== undefined ? filteredProjects.length : total,
                    page,
                    limit,
                    totalPages: Math.ceil((featured !== undefined ? filteredProjects.length : total) / limit),
                },
            };
        }
        catch (error) {
            if (error.message?.includes('does not exist') || error.message?.includes('featured')) {
                console.warn('Column error detected, retrying without problematic filters:', error.message);
                const safeWhere = {
                    isActive: true,
                };
                if (status) {
                    safeWhere.status = status;
                }
                if (category) {
                    safeWhere.category = category;
                }
                const [projects, total] = await Promise.all([
                    this.prisma.projects.findMany({
                        where: safeWhere,
                        skip,
                        take: limit,
                        orderBy: [{ createdAt: 'desc' }],
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
                    this.prisma.projects.count({ where: safeWhere }),
                ]);
                let filteredProjects = projects;
                if (featured !== undefined) {
                    filteredProjects = featured ? [] : projects;
                }
                return {
                    data: filteredProjects,
                    meta: {
                        total: featured !== undefined ? filteredProjects.length : total,
                        page,
                        limit,
                        totalPages: Math.ceil((featured !== undefined ? filteredProjects.length : total) / limit),
                    },
                };
            }
            throw error;
        }
    }
    async findFeatured() {
        try {
            const projects = await this.prisma.projects.findMany({
                where: {
                    isActive: true,
                },
                orderBy: [{ createdAt: 'desc' }],
                take: 20,
            });
            const featuredProjects = projects.filter((p) => {
                const isFeaturedValue = p.isFeatured !== undefined ? p.isFeatured : p.featured !== undefined ? p.featured : false;
                return isFeaturedValue === true;
            });
            return featuredProjects.slice(0, 6);
        }
        catch (error) {
            console.warn('Error fetching featured projects, returning empty array:', error.message);
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
        this.normalizeProjectJsonFields(data);
        if (data.youtubeVideoUrl) {
            data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
        }
        data.updatedAt = new Date();
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
        this.normalizeProjectJsonFields(data);
        if (data.youtubeVideoUrl) {
            data.youtubeVideoId = this.extractYouTubeId(data.youtubeVideoUrl);
        }
        data.updatedAt = new Date();
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
        try {
            const currentValue = project.isFeatured !== undefined
                ? project.isFeatured
                : project.featured !== undefined
                    ? project.featured
                    : false;
            return await this.prisma.projects.update({
                where: { id },
                data: { isFeatured: !currentValue },
            });
        }
        catch (error) {
            if (error.message?.includes('does not exist') || error.message?.includes('featured')) {
                console.warn('isFeatured column not available, cannot toggle featured status');
                return project;
            }
            throw error;
        }
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