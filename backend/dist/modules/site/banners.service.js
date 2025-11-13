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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let BannersService = class BannersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { page, isActive, search, skip = 0, take = 20, orderBy = { position: 'asc' }, } = params;
        const where = {
            isDeleted: false,
            ...(page && { page }),
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                OR: [
                    { title: { contains: search } },
                    { subtitle: { contains: search } },
                    { description: { contains: search } },
                ],
            }),
        };
        const [banners, total] = await Promise.all([
            this.prisma.banners.findMany({
                where,
                skip,
                take,
                orderBy,
            }),
            this.prisma.banners.count({ where }),
        ]);
        return {
            items: banners,
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
            totalPages: Math.ceil(total / take),
        };
    }
    async findById(id) {
        const banner = await this.prisma.banners.findFirst({
            where: {
                id,
                isDeleted: false,
            },
        });
        if (!banner) {
            throw new common_1.NotFoundException('Banner not found');
        }
        return banner;
    }
    async create(data) {
        return this.prisma.banners.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                ...data,
                updatedAt: new Date(),
            },
        });
    }
    async update(id, data) {
        return this.prisma.banners.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        return this.prisma.banners.update({
            where: { id },
            data: {
                isDeleted: true,
                isActive: false,
            },
        });
    }
    async reorder(idsInOrder) {
        const updates = idsInOrder.map((id, index) => this.prisma.banners.update({
            where: { id },
            data: { position: index },
        }));
        return this.prisma.$transaction(updates);
    }
    async getActiveBanners(page) {
        const now = new Date();
        return this.prisma.banners.findMany({
            where: {
                isDeleted: false,
                isActive: true,
                ...(page && { page }),
                OR: [
                    { startAt: null, endAt: null },
                    { startAt: { lte: now }, endAt: null },
                    { startAt: null, endAt: { gte: now } },
                    { startAt: { lte: now }, endAt: { gte: now } },
                ],
            },
            orderBy: { position: 'asc' },
        });
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannersService);
//# sourceMappingURL=banners.service.js.map