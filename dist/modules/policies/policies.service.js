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
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slug_utils_1 = require("../../common/utils/slug.utils");
let PoliciesService = class PoliciesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.policies.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }
    async findByType(type) {
        return this.prisma.policies.findFirst({
            where: { type },
        });
    }
    async findBySlug(slug) {
        return this.prisma.policies.findUnique({
            where: { slug },
        });
    }
    async create(data) {
        const slug = (0, slug_utils_1.slugify)(data.title);
        return this.prisma.policies.create({
            data: {
                id: crypto.randomUUID(),
                ...data,
                slug,
                isPublished: data.isPublished ?? true,
                updatedAt: new Date(),
            },
        });
    }
    async update(slug, data) {
        const existingPolicy = await this.prisma.policies.findUnique({
            where: { slug },
        });
        if (!existingPolicy) {
            throw new Error(`Policy with slug '${slug}' not found`);
        }
        return this.prisma.policies.update({
            where: { slug },
            data,
        });
    }
    async delete(slug) {
        const existingPolicy = await this.prisma.policies.findUnique({
            where: { slug },
        });
        if (!existingPolicy) {
            throw new Error(`Policy with slug '${slug}' not found`);
        }
        return this.prisma.policies.delete({
            where: { slug },
        });
    }
    async incrementViewCount(slug) {
        const existingPolicy = await this.prisma.policies.findUnique({
            where: { slug },
        });
        if (!existingPolicy) {
            throw new Error(`Policy with slug '${slug}' not found`);
        }
        await this.prisma.policies.update({
            where: { slug },
            data: { viewCount: { increment: 1 } },
        });
    }
};
exports.PoliciesService = PoliciesService;
exports.PoliciesService = PoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PoliciesService);
//# sourceMappingURL=policies.service.js.map