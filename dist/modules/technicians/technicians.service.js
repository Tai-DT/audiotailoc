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
exports.TechniciansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const enums_1 = require("../../common/enums");
let TechniciansService = class TechniciansService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTechnician(data) {
        const existingTechnician = await this.prisma.technicians.findFirst({
            where: { phone: data.phone },
        });
        if (existingTechnician) {
            throw new common_1.BadRequestException('Số điện thoại đã được sử dụng');
        }
        return this.prisma.technicians.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || '',
                specialties: JSON.stringify(data.specialties || []),
            },
            include: {
                technician_schedules: true,
                _count: { select: { service_bookings: true } },
            },
        });
    }
    async getTechnicians(params) {
        const page = Math.max(1, params.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
        const where = {};
        if (params.isActive !== undefined)
            where.isActive = params.isActive;
        if (params.specialty) {
            where.specialties = { contains: params.specialty };
        }
        const [total, technicians] = await this.prisma.$transaction([
            this.prisma.technicians.count({ where }),
            this.prisma.technicians.findMany({
                where,
                include: {
                    technician_schedules: true,
                    _count: { select: { service_bookings: true } },
                },
                orderBy: { name: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        return { total, page, pageSize, technicians };
    }
    async getTechnician(id) {
        const technician = await this.prisma.technicians.findUnique({
            where: { id },
            include: {
                technician_schedules: {
                    orderBy: { date: 'asc' },
                },
                service_bookings: {
                    orderBy: { scheduledAt: 'desc' },
                    take: 10,
                    include: {
                        services: true,
                    },
                },
                _count: {
                    select: {
                        service_bookings: true,
                    },
                },
            },
        });
        if (!technician) {
            throw new common_1.NotFoundException('Không tìm thấy kỹ thuật viên');
        }
        return technician;
    }
    async updateTechnician(id, data) {
        const technician = await this.getTechnician(id);
        if (data.phone && data.phone !== technician.phone) {
            const existingTechnician = await this.prisma.technicians.findFirst({
                where: {
                    phone: data.phone,
                    id: { not: id },
                },
            });
            if (existingTechnician) {
                throw new common_1.BadRequestException('Số điện thoại đã được sử dụng');
            }
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.specialties !== undefined)
            updateData.specialties = JSON.stringify(data.specialties || []);
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        return this.prisma.technicians.update({
            where: { id },
            data: updateData,
            include: {
                technician_schedules: true,
                _count: { select: { service_bookings: true } },
            },
        });
    }
    async deleteTechnician(id) {
        const _technician = await this.getTechnician(id);
        const activeBookings = await this.prisma.service_bookings.count({
            where: {
                technicianId: id,
                status: {
                    in: ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'],
                },
            },
        });
        if (activeBookings > 0) {
            throw new common_1.BadRequestException('Không thể xóa kỹ thuật viên có booking đang thực hiện');
        }
        return this.prisma.technicians.delete({
            where: { id },
        });
    }
    async setTechnicianSchedule(technicianId, schedules) {
        const _technician = await this.getTechnician(technicianId);
        return this.prisma.$transaction(async (tx) => {
            await tx.technician_schedules.deleteMany({
                where: { technicianId },
            });
            const createdSchedules = await Promise.all(schedules.map(schedule => tx.technician_schedules.create({
                data: {
                    technicianId,
                    date: schedule.date,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    isAvailable: schedule.isAvailable,
                },
            })));
            return createdSchedules;
        });
    }
    async getTechnicianWorkload(technicianId, params) {
        const where = { technicianId };
        if (params.fromDate || params.toDate) {
            where.scheduledAt = {};
            if (params.fromDate)
                where.scheduledAt.gte = params.fromDate;
            if (params.toDate)
                where.scheduledAt.lte = params.toDate;
        }
        const [totalBookings, completedBookings, pendingBookings, totalRevenue,] = await Promise.all([
            this.prisma.service_bookings.count({ where }),
            this.prisma.service_bookings.count({
                where: { ...where, status: enums_1.ServiceBookingStatus.COMPLETED }
            }),
            this.prisma.service_bookings.count({
                where: {
                    ...where,
                    status: { in: [
                            enums_1.ServiceBookingStatus.PENDING,
                            enums_1.ServiceBookingStatus.CONFIRMED,
                            enums_1.ServiceBookingStatus.ASSIGNED,
                            enums_1.ServiceBookingStatus.IN_PROGRESS,
                        ] }
                }
            }),
            this.prisma.service_booking_items.aggregate({
                where: {
                    service_bookings: {
                        ...where,
                        status: enums_1.ServiceBookingStatus.COMPLETED,
                    },
                },
                _sum: { price: true },
            }),
        ]);
        return {
            totalBookings,
            completedBookings,
            pendingBookings,
            completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
            totalRevenue: totalRevenue._sum.price || 0,
        };
    }
    async getTechnicianStats() {
        const [totalRevenue, totalTechnicians, activeTechnicians, totalBookings, completedBookings,] = await Promise.all([
            this.prisma.service_booking_items.aggregate({
                where: {
                    service_bookings: {
                        status: enums_1.ServiceBookingStatus.COMPLETED,
                    },
                },
                _sum: { price: true },
            }),
            this.prisma.technicians.count(),
            this.prisma.technicians.count({ where: { isActive: true } }),
            this.prisma.service_bookings.count(),
            this.prisma.service_bookings.count({ where: { status: 'COMPLETED' } }),
        ]);
        const topPerformersRaw = await this.prisma.technicians.findMany({
            where: { isActive: true },
            include: {
                service_bookings: {
                    where: { status: enums_1.ServiceBookingStatus.COMPLETED },
                    select: { id: true },
                },
            },
        });
        const topPerformers = topPerformersRaw
            .sort((a, b) => (b.service_bookings?.length || 0) - (a.service_bookings?.length || 0))
            .slice(0, 5);
        return {
            totalTechnicians,
            activeTechnicians,
            totalBookings,
            completedBookings,
            topPerformers,
        };
    }
};
exports.TechniciansService = TechniciansService;
exports.TechniciansService = TechniciansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechniciansService);
//# sourceMappingURL=technicians.service.js.map