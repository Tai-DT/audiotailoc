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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const enums_1 = require("../../common/enums");
let BookingService = class BookingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(data) {
        const service = await this.prisma.services.findUnique({
            where: { id: data.serviceId },
            include: { service_items: true },
        });
        if (!service) {
            throw new common_1.NotFoundException('Không tìm thấy dịch vụ');
        }
        const booking = await this.prisma.$transaction(async (tx) => {
            const createData = {
                serviceId: data.serviceId,
                scheduledAt: data.scheduledAt,
                scheduledTime: data.scheduledTime,
                notes: data.notes,
                status: enums_1.ServiceBookingStatus.PENDING,
            };
            if (data.userId)
                createData.userId = data.userId;
            const newBooking = await tx.service_bookings.create({
                data: createData,
            });
            let estimatedCosts = service.basePriceCents || 0;
            if (data.items && data.items.length > 0) {
                for (const item of data.items) {
                    const serviceItem = service.service_items.find(si => si.id === item.itemId);
                    if (!serviceItem) {
                        throw new common_1.BadRequestException(`Không tìm thấy mục dịch vụ: ${item.itemId}`);
                    }
                    const lineTotal = serviceItem.price * item.quantity;
                    estimatedCosts += lineTotal;
                    await tx.service_booking_items.create({
                        data: {
                            bookingId: newBooking.id,
                            serviceItemId: item.itemId,
                            quantity: item.quantity,
                            price: lineTotal,
                        },
                    });
                }
            }
            await tx.service_bookings.update({
                where: { id: newBooking.id },
                data: { estimatedCosts },
            });
            await tx.serviceStatusHistory.create({
                data: {
                    bookingId: newBooking.id,
                    status: enums_1.ServiceBookingStatus.PENDING,
                    newStatus: enums_1.ServiceBookingStatus.PENDING,
                    note: 'Booking được tạo',
                },
            });
            return newBooking;
        });
        return this.getBooking(booking.id);
    }
    async getBooking(id) {
        const booking = await this.prisma.service_bookings.findUnique({
            where: { id },
            include: {
                services: {
                    include: {
                        service_types: true,
                    },
                },
                users: true,
                technicians: true,
                service_booking_items: {
                    include: {
                        service_items: true,
                    },
                },
                service_status_history: { orderBy: { createdAt: 'desc' } },
                service_payments: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Không tìm thấy booking');
        }
        return booking;
    }
    async getBookings(params) {
        const page = Math.max(1, params.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
        const where = {};
        if (params.status)
            where.status = params.status;
        if (params.technicianId)
            where.technicianId = params.technicianId;
        if (params.userId)
            where.userId = params.userId;
        if (params.serviceId)
            where.serviceId = params.serviceId;
        if (params.fromDate || params.toDate) {
            where.scheduledAt = {};
            if (params.fromDate)
                where.scheduledAt.gte = params.fromDate;
            if (params.toDate)
                where.scheduledAt.lte = params.toDate;
        }
        const [total, bookings] = await this.prisma.$transaction([
            this.prisma.service_bookings.count({ where }),
            this.prisma.service_bookings.findMany({
                where,
                include: {
                    services: {
                        include: {
                            service_types: true,
                        },
                    },
                    users: true,
                    technicians: true,
                    service_booking_items: {
                        include: {
                            service_items: true,
                        },
                    },
                },
                orderBy: { scheduledAt: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        return { total, page, pageSize, bookings };
    }
    async updateBookingStatus(id, status, note, changedBy) {
        const _booking = await this.getBooking(id);
        const _updatedBooking = await this.prisma.$transaction(async (tx) => {
            const updateData = { status };
            if (status === enums_1.ServiceBookingStatus.COMPLETED) {
                updateData.completedAt = new Date();
                const sum = await tx.service_booking_items.aggregate({
                    where: { bookingId: id },
                    _sum: { price: true },
                });
                updateData.actualCosts = sum._sum.price || 0;
            }
            const updated = await tx.service_bookings.update({
                where: { id },
                data: updateData,
            });
            await tx.serviceStatusHistory.create({
                data: {
                    bookingId: id,
                    status,
                    newStatus: status,
                    note,
                    changedBy,
                },
            });
            return updated;
        });
        return this.getBooking(id);
    }
    async updateBooking(id, updateData) {
        const booking = await this.getBooking(id);
        if (updateData.technicianId) {
            const technician = await this.prisma.technicians.findUnique({
                where: { id: updateData.technicianId },
            });
            if (!technician) {
                throw new common_1.NotFoundException('Không tìm thấy kỹ thuật viên');
            }
            if (!technician.isActive) {
                throw new common_1.BadRequestException('Kỹ thuật viên không hoạt động');
            }
        }
        if (updateData.serviceId) {
            const service = await this.prisma.services.findUnique({
                where: { id: updateData.serviceId },
            });
            if (!service) {
                throw new common_1.NotFoundException('Không tìm thấy dịch vụ');
            }
        }
        const data = {};
        if (updateData.userId !== undefined)
            data.userId = updateData.userId;
        if (updateData.serviceId !== undefined)
            data.serviceId = updateData.serviceId;
        if (updateData.technicianId !== undefined)
            data.technicianId = updateData.technicianId;
        if (updateData.scheduledAt !== undefined)
            data.scheduledAt = updateData.scheduledAt;
        if (updateData.scheduledTime !== undefined)
            data.scheduledTime = updateData.scheduledTime;
        if (updateData.status !== undefined)
            data.status = updateData.status;
        if (updateData.notes !== undefined)
            data.notes = updateData.notes;
        if (updateData.estimatedCosts !== undefined)
            data.estimatedCosts = updateData.estimatedCosts;
        if (updateData.actualCosts !== undefined)
            data.actualCosts = updateData.actualCosts;
        if (updateData.status === enums_1.ServiceBookingStatus.COMPLETED && booking.status !== enums_1.ServiceBookingStatus.COMPLETED) {
            data.completedAt = new Date();
            if (updateData.actualCosts === undefined) {
                const sum = await this.prisma.service_booking_items.aggregate({
                    where: { bookingId: id },
                    _sum: { price: true },
                });
                data.actualCosts = sum._sum.price || 0;
            }
        }
        await this.prisma.service_bookings.update({
            where: { id },
            data,
        });
        return this.getBooking(id);
    }
    async assignTechnician(bookingId, technicianId, note) {
        const _booking = await this.getBooking(bookingId);
        const technician = await this.prisma.technicians.findUnique({
            where: { id: technicianId },
        });
        if (!technician) {
            throw new common_1.NotFoundException('Không tìm thấy kỹ thuật viên');
        }
        if (!technician.isActive) {
            throw new common_1.BadRequestException('Kỹ thuật viên không hoạt động');
        }
        const _updated = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.service_bookings.update({
                where: { id: bookingId },
                data: {
                    technicianId,
                    status: enums_1.ServiceBookingStatus.ASSIGNED,
                },
            });
            await tx.serviceStatusHistory.create({
                data: {
                    bookingId,
                    status: enums_1.ServiceBookingStatus.ASSIGNED,
                    newStatus: enums_1.ServiceBookingStatus.ASSIGNED,
                    note: note || `Phân công cho ${technician.name}`,
                },
            });
            return updated;
        });
        return this.getBooking(bookingId);
    }
    async rescheduleBooking(id, newDate, newTime, note) {
        const booking = await this.getBooking(id);
        if (booking.status === enums_1.ServiceBookingStatus.COMPLETED ||
            booking.status === enums_1.ServiceBookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Không thể dời lịch booking đã hoàn thành hoặc đã hủy');
        }
        const _updated = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.service_bookings.update({
                where: { id },
                data: {
                    scheduledAt: newDate,
                    scheduledTime: newTime,
                    status: enums_1.ServiceBookingStatus.RESCHEDULED,
                },
            });
            await tx.serviceStatusHistory.create({
                data: {
                    bookingId: id,
                    status: enums_1.ServiceBookingStatus.RESCHEDULED,
                    newStatus: enums_1.ServiceBookingStatus.RESCHEDULED,
                    note: note || `Dời lịch sang ${newDate.toLocaleDateString()} ${newTime}`,
                },
            });
            return updated;
        });
        return this.getBooking(id);
    }
    async cancelBooking(id, reason) {
        const booking = await this.getBooking(id);
        if (booking.status === enums_1.ServiceBookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Không thể hủy booking đã hoàn thành');
        }
        const _updated = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.service_bookings.update({
                where: { id },
                data: {
                    status: enums_1.ServiceBookingStatus.CANCELLED,
                },
            });
            await tx.serviceStatusHistory.create({
                data: {
                    bookingId: id,
                    status: enums_1.ServiceBookingStatus.CANCELLED,
                    newStatus: enums_1.ServiceBookingStatus.CANCELLED,
                    note: reason || 'Booking bị hủy',
                },
            });
            return updated;
        });
        return this.getBooking(id);
    }
    async deleteBooking(id) {
        await this.getBooking(id);
        await this.prisma.serviceStatusHistory.deleteMany({
            where: { bookingId: id },
        });
        return this.prisma.service_bookings.delete({
            where: { id },
        });
    }
    async getBookingStats(params) {
        const where = {};
        if (params?.fromDate || params?.toDate) {
            where.scheduledAt = {};
            if (params.fromDate)
                where.scheduledAt.gte = params.fromDate;
            if (params.toDate)
                where.scheduledAt.lte = params.toDate;
        }
        if (params?.technicianId) {
            where.technicianId = params.technicianId;
        }
        const [totalBookings, pendingBookings, confirmedBookings, inProgressBookings, completedBookings, cancelledBookings, totalRevenue,] = await Promise.all([
            this.prisma.service_bookings.count({ where }),
            this.prisma.service_bookings.count({ where: { ...where, status: enums_1.ServiceBookingStatus.PENDING } }),
            this.prisma.service_bookings.count({ where: { ...where, status: enums_1.ServiceBookingStatus.CONFIRMED } }),
            this.prisma.service_bookings.count({ where: { ...where, status: enums_1.ServiceBookingStatus.IN_PROGRESS } }),
            this.prisma.service_bookings.count({ where: { ...where, status: enums_1.ServiceBookingStatus.COMPLETED } }),
            this.prisma.service_bookings.count({ where: { ...where, status: enums_1.ServiceBookingStatus.CANCELLED } }),
            this.prisma.service_booking_items.aggregate({
                where: {
                    booking: {
                        status: enums_1.ServiceBookingStatus.COMPLETED,
                    },
                },
                _sum: { price: true },
            }),
        ]);
        return {
            totalBookings,
            pendingBookings,
            confirmedBookings,
            inProgressBookings,
            completedBookings,
            cancelledBookings,
            totalRevenue: totalRevenue._sum.price || 0,
        };
    }
    async createPayment(bookingId, data) {
        await this.getBooking(bookingId);
        return this.prisma.service_payments.create({
            data: {
                bookingId,
                provider: data.paymentMethod,
                amountCents: data.amountCents,
                status: enums_1.PaymentStatus.PENDING,
                transactionId: data.transactionId,
            },
        });
    }
    async updatePaymentStatus(paymentId, status, transactionId) {
        const updateData = { status };
        if (transactionId)
            updateData.transactionId = transactionId;
        if (status === enums_1.PaymentStatus.SUCCEEDED || status === enums_1.PaymentStatus.COMPLETED) {
            updateData.paidAt = new Date();
        }
        return this.prisma.service_payments.update({
            where: { id: paymentId },
            data: updateData,
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingService);
//# sourceMappingURL=booking.service.js.map