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
exports.ServiceTypesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let ServiceTypesService = class ServiceTypesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServiceTypeDto) {
        const slug = await this.generateSlug(createServiceTypeDto.name);
        return this.prisma.service_types.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                name: createServiceTypeDto.name,
                description: createServiceTypeDto.description,
                icon: createServiceTypeDto.icon,
                color: createServiceTypeDto.color,
                sortOrder: createServiceTypeDto.sortOrder || 0,
                slug,
                isActive: createServiceTypeDto.isActive ?? true,
                updatedAt: new Date(),
            },
        });
    }
    async findAll() {
        console.log('[ServiceTypesService] findAll called');
        const result = await this.prisma.service_types.findMany({
            orderBy: { sortOrder: 'asc' },
        });
        console.log('[ServiceTypesService] findAll result length:', result.length);
        console.log('[ServiceTypesService] findAll first item:', result[0]);
        return result;
    }
    async findOne(id) {
        const serviceType = await this.prisma.service_types.findUnique({
            where: { id },
        });
        if (!serviceType) {
            throw new common_1.NotFoundException(`Service type with ID "${id}" not found`);
        }
        return serviceType;
    }
    async update(id, updateServiceTypeDto) {
        console.log(`[ServiceTypesService] Updating service type ${id} with data:`, updateServiceTypeDto);
        await this.findOne(id);
        const result = await this.prisma.service_types.update({
            where: { id },
            data: updateServiceTypeDto,
        });
        console.log(`[ServiceTypesService] Updated service type ${id}:`, result);
        return result;
    }
    async remove(id) {
        console.log(`[ServiceTypesService] Deleting service type ${id}`);
        await this.findOne(id);
        const serviceCount = await this.prisma.services.count({
            where: { typeId: id },
        });
        if (serviceCount > 0) {
            throw new Error('Cannot delete service type that is being used by services');
        }
        const result = await this.prisma.service_types.delete({
            where: { id },
        });
        console.log(`[ServiceTypesService] Deleted service type ${id}:`, result);
        return result;
    }
    async generateSlug(name) {
        const baseSlug = name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.prisma.service_types.findUnique({
                where: { slug },
                select: { id: true },
            });
            if (!existing)
                break;
            slug = `${baseSlug}-${counter++}`;
        }
        return slug;
    }
};
exports.ServiceTypesService = ServiceTypesService;
exports.ServiceTypesService = ServiceTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceTypesService);
//# sourceMappingURL=service-types.service.js.map