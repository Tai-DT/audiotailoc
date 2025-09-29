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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const enums_1 = require("../../common/enums");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createService(data) {
        const slug = data.slug || this.generateSlug(data.name);
        if (data.typeId) {
            const type = await this.prisma.serviceType.findUnique({ where: { id: data.typeId } });
            if (!type) {
                throw new common_1.BadRequestException('Invalid type ID');
            }
        }
        let priceData = {
            priceType: data.priceType || 'FIXED',
        };
        if (data.priceType === 'RANGE') {
            priceData.minPrice = data.minPrice ? Math.round(data.minPrice * 100) : null;
            priceData.maxPrice = data.maxPrice ? Math.round(data.maxPrice * 100) : null;
            priceData.basePriceCents = priceData.minPrice || 0;
            priceData.price = priceData.minPrice || 0;
        }
        else if (data.priceType === 'NEGOTIABLE' || data.priceType === 'CONTACT') {
            priceData.basePriceCents = 0;
            priceData.price = 0;
            priceData.minPrice = null;
            priceData.maxPrice = null;
        }
        else {
            const basePriceCents = data.basePriceCents ?? (data.price ? Math.round(data.price * 100) : 0);
            priceData.basePriceCents = basePriceCents;
            priceData.price = basePriceCents;
            priceData.minPrice = null;
            priceData.maxPrice = null;
        }
        return this.prisma.service.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                typeId: data.typeId,
                ...priceData,
                duration: data.estimatedDuration || 60,
                images: data.imageUrl,
                isActive: data.isActive ?? true,
            },
            include: {
                items: true,
                serviceType: true,
            },
        });
    }
    async getServices(params) {
        console.log('[DEBUG] ServicesService.getServices called with params:', params);
        const page = Math.max(1, params.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
        const where = {};
        if (params.typeId)
            where.typeId = params.typeId;
        if (params.isActive !== undefined)
            where.isActive = params.isActive;
        const [total, services] = await this.prisma.$transaction([
            this.prisma.service.count({ where }),
            this.prisma.service.findMany({
                where,
                include: {
                    items: true,
                    serviceType: true,
                    _count: {
                        select: {
                            bookings: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        const mappedServices = services.map(service => ({
            ...service,
            price: service.basePriceCents / 100,
            minPriceDisplay: service.minPrice ? service.minPrice / 100 : null,
            maxPriceDisplay: service.maxPrice ? service.maxPrice / 100 : null,
            type: service.serviceType,
        }));
        console.log('[DEBUG] ServicesService.getServices returning:', { total, page, pageSize, servicesCount: services.length });
        return { total, page, pageSize, services: mappedServices };
    }
    async getService(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                items: true,
                serviceType: true,
                bookings: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Không tìm thấy dịch vụ');
        }
        return {
            ...service,
            price: service.basePriceCents / 100,
            minPriceDisplay: service.minPrice ? service.minPrice / 100 : null,
            maxPriceDisplay: service.maxPrice ? service.maxPrice / 100 : null,
            type: service.serviceType,
        };
    }
    async getServiceBySlug(slug) {
        const service = await this.prisma.service.findUnique({
            where: { slug },
            include: {
                items: true,
                serviceType: true,
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Không tìm thấy dịch vụ');
        }
        return {
            ...service,
            price: service.basePriceCents / 100,
            type: service.serviceType,
        };
    }
    async updateService(id, data) {
        const existingService = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!existingService) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (data.typeId) {
            const type = await this.prisma.serviceType.findUnique({ where: { id: data.typeId } });
            if (!type) {
                throw new common_1.BadRequestException('Invalid type ID');
            }
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.typeId !== undefined)
            updateData.typeId = data.typeId;
        if (data.priceType !== undefined)
            updateData.priceType = data.priceType;
        if (data.priceType === 'RANGE') {
            if (data.minPrice !== undefined) {
                updateData.minPrice = Math.round(data.minPrice * 100);
                updateData.basePriceCents = updateData.minPrice;
                updateData.price = updateData.minPrice;
            }
            if (data.maxPrice !== undefined) {
                updateData.maxPrice = Math.round(data.maxPrice * 100);
            }
        }
        else if (data.priceType === 'NEGOTIABLE' || data.priceType === 'CONTACT') {
            updateData.basePriceCents = 0;
            updateData.price = 0;
            updateData.minPrice = null;
            updateData.maxPrice = null;
        }
        else if (data.priceType === 'FIXED' || data.priceType === undefined) {
            if (data.basePriceCents !== undefined) {
                updateData.basePriceCents = data.basePriceCents;
                updateData.price = data.basePriceCents;
                updateData.minPrice = null;
                updateData.maxPrice = null;
            }
            else if (data.price !== undefined) {
                const basePriceCents = Math.round(data.price * 100);
                updateData.basePriceCents = basePriceCents;
                updateData.price = basePriceCents;
                updateData.minPrice = null;
                updateData.maxPrice = null;
            }
        }
        if (data.estimatedDuration !== undefined)
            updateData.duration = data.estimatedDuration;
        if (data.imageUrl !== undefined)
            updateData.images = data.imageUrl;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        const updated = await this.prisma.service.update({
            where: { id },
            data: updateData,
            include: {
                items: true,
                serviceType: true,
            },
        });
        return {
            ...updated,
            price: updated.basePriceCents / 100,
            minPriceDisplay: updated.minPrice ? updated.minPrice / 100 : null,
            maxPriceDisplay: updated.maxPrice ? updated.maxPrice / 100 : null,
            type: updated.serviceType,
        };
    }
    async updateServiceImage(id, imagePath) {
        return this.updateService(id, { imageUrl: imagePath });
    }
    async deleteService(id) {
        const _service = await this.getService(id);
        const bookingCount = await this.prisma.serviceBooking.count({
            where: { serviceId: id },
        });
        if (bookingCount > 0) {
            throw new common_1.BadRequestException('Không thể xóa dịch vụ đã có booking');
        }
        return this.prisma.service.delete({
            where: { id },
        });
    }
    async addServiceItem(serviceId, data) {
        await this.getService(serviceId);
        return this.prisma.serviceItem.create({
            data: {
                serviceId,
                name: data.name,
                price: data.priceCents,
                quantity: 1,
            },
        });
    }
    async updateServiceItem(itemId, data) {
        const item = await this.prisma.serviceItem.findUnique({
            where: { id: itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Không tìm thấy mục dịch vụ');
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.priceCents !== undefined)
            updateData.price = data.priceCents;
        return this.prisma.serviceItem.update({
            where: { id: itemId },
            data: updateData,
        });
    }
    async deleteServiceItem(itemId) {
        const item = await this.prisma.serviceItem.findUnique({
            where: { id: itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Không tìm thấy mục dịch vụ');
        }
        const bookingItemCount = await this.prisma.serviceBookingItem.count({
            where: { serviceItemId: itemId },
        });
        if (bookingItemCount > 0) {
            throw new common_1.BadRequestException('Không thể xóa mục dịch vụ đã được sử dụng');
        }
        return this.prisma.serviceItem.delete({
            where: { id: itemId },
        });
    }
    async getServiceTypes() {
        const types = await this.prisma.serviceType.findMany({
            orderBy: { sortOrder: 'asc' },
        });
        return types.map(type => ({
            id: type.id,
            name: type.name,
            slug: type.slug,
            description: type.description,
            icon: type.icon,
            color: type.color,
            isActive: type.isActive,
            sortOrder: type.sortOrder,
            createdAt: type.createdAt.toISOString(),
            updatedAt: type.updatedAt.toISOString(),
        }));
    }
    async getServiceType(id) {
        const type = await this.prisma.serviceType.findUnique({
            where: { id },
        });
        if (!type) {
            throw new common_1.NotFoundException('Không tìm thấy loại dịch vụ');
        }
        return type;
    }
    async generateSlug(name) {
        let baseSlug = name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
        const existing = await this.prisma.serviceType.findFirst({
            where: { slug: baseSlug }
        });
        if (!existing) {
            return baseSlug;
        }
        let counter = 1;
        let uniqueSlug = `${baseSlug}-${counter}`;
        while (await this.prisma.serviceType.findFirst({ where: { slug: uniqueSlug } })) {
            counter++;
            uniqueSlug = `${baseSlug}-${counter}`;
        }
        return uniqueSlug;
    }
    async getServiceStats() {
        const [totalServices, activeServices, totalBookings, pendingBookings, completedBookings, revenue,] = await Promise.all([
            this.prisma.service.count(),
            this.prisma.service.count({ where: { isActive: true } }),
            this.prisma.serviceBooking.count(),
            this.prisma.serviceBooking.count({ where: { status: enums_1.ServiceBookingStatus.PENDING } }),
            this.prisma.serviceBooking.count({ where: { status: enums_1.ServiceBookingStatus.COMPLETED } }),
            this.prisma.serviceBookingItem.aggregate({
                where: {
                    booking: { status: enums_1.ServiceBookingStatus.COMPLETED },
                },
                _sum: { price: true },
            }),
        ]);
        return {
            totalServices,
            activeServices,
            totalBookings,
            pendingBookings,
            completedBookings,
            totalRevenue: revenue._sum.price || 0,
        };
    }
    async createServiceType(data) {
        const slug = data.slug || await this.generateSlug(data.name);
        return this.prisma.serviceType.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                isActive: data.isActive ?? true,
                sortOrder: await this.getNextSortOrder(),
            },
        });
    }
    async updateServiceType(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.slug !== undefined)
            updateData.slug = data.slug;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.sortOrder !== undefined)
            updateData.sortOrder = data.sortOrder;
        return this.prisma.serviceType.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteServiceType(id) {
        const servicesCount = await this.prisma.service.count({
            where: { typeId: id },
        });
        if (servicesCount > 0) {
            throw new common_1.BadRequestException('Không thể xóa loại dịch vụ đang được sử dụng');
        }
        return this.prisma.serviceType.delete({
            where: { id },
        });
    }
    async getNextSortOrder() {
        const maxSortOrder = await this.prisma.serviceType.aggregate({
            _max: { sortOrder: true },
        });
        return (maxSortOrder._max.sortOrder || 0) + 1;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map