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
const telegram_service_1 = require("../notifications/telegram.service");
const technicians_service_1 = require("../technicians/technicians.service");
let BookingService = class BookingService {
    constructor(prisma, telegram, techniciansService) {
        this.prisma = prisma;
        this.telegram = telegram;
        this.techniciansService = techniciansService;
    }
    validateStatusTransition(oldStatus, newStatus) {
        const allowedTransitions = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['ASSIGNED', 'CANCELLED'],
            ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
            IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
            COMPLETED: [],
            CANCELLED: [],
            RESCHEDULED: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        };
        const allowed = allowedTransitions[oldStatus] || [];
        if (!allowed.includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${oldStatus} to ${newStatus}. Allowed transitions: ${allowed.join(', ') || 'none'}`);
        }
    }
    async findAll(query = {}) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = query.status;
        const search = query.search;
        const where = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { users: { name: { contains: search, mode: 'insensitive' } } },
                { users: { email: { contains: search, mode: 'insensitive' } } },
                { users: { phone: { contains: search, mode: 'insensitive' } } },
                { services: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [bookings, total] = await Promise.all([
            this.prisma.service_bookings.findMany({
                where,
                include: {
                    services: true,
                    technicians: true,
                    users: true,
                    service_booking_items: {
                        include: {
                            service_items: true,
                        },
                    },
                    service_payments: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.service_bookings.count({ where }),
        ]);
        return {
            bookings,
            total,
            page,
            pageSize: limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const booking = await this.prisma.service_bookings.findUnique({
            where: { id },
            include: {
                services: true,
                technicians: true,
                users: true,
                service_booking_items: {
                    include: {
                        service_items: true,
                    },
                },
                service_payments: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async findByUserId(userId) {
        return this.prisma.service_bookings.findMany({
            where: { userId },
            include: {
                services: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                technicians: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
                service_booking_items: {
                    include: {
                        service_items: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                service_payments: {
                    select: {
                        id: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(createBookingDto) {
        const { items, ...bookingData } = createBookingDto;
        if (!bookingData.serviceId) {
            throw new common_1.NotFoundException('Service ID is required');
        }
        const service = await this.prisma.services.findUnique({
            where: { id: bookingData.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (!service.isActive) {
            throw new common_1.NotFoundException('Service is not available');
        }
        if (items?.length) {
            for (const item of items) {
                const serviceItem = await this.prisma.service_items.findUnique({
                    where: { id: item.itemId },
                });
                if (!serviceItem) {
                    throw new common_1.NotFoundException(`Service item not found: ${item.itemId}`);
                }
            }
        }
        let userId = bookingData.userId;
        if (!userId) {
            const availableUser = await this.prisma.users.findFirst({
                where: {
                    role: 'USER',
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            if (availableUser) {
                userId = availableUser.id;
            }
            else {
                const adminUser = await this.prisma.users.findFirst({
                    where: {
                        role: 'ADMIN',
                    },
                });
                if (!adminUser) {
                    throw new common_1.NotFoundException('No user available for booking');
                }
                userId = adminUser.id;
            }
        }
        if (bookingData.technicianId) {
            const technician = await this.techniciansService.getTechnician(bookingData.technicianId);
            if (!technician.isActive) {
                throw new common_1.BadRequestException('Technician is not active');
            }
            if (bookingData.scheduledAt && bookingData.scheduledTime) {
                const isAvailable = await this.checkTechnicianAvailability(bookingData.technicianId, new Date(bookingData.scheduledAt), bookingData.scheduledTime);
                if (!isAvailable) {
                    throw new common_1.BadRequestException('Technician is not available at this time');
                }
            }
        }
        const booking = await this.prisma.service_bookings.create({
            data: {
                id: bookingData.id || require('crypto').randomUUID(),
                serviceId: bookingData.serviceId,
                userId: userId,
                technicianId: bookingData.technicianId || null,
                status: bookingData.status || 'PENDING',
                scheduledAt: new Date(bookingData.scheduledAt),
                scheduledTime: bookingData.scheduledTime,
                notes: bookingData.notes || null,
                estimatedCosts: bookingData.estimatedCosts || 0,
                address: bookingData.address || null,
                coordinates: bookingData.coordinates || null,
                goongPlaceId: bookingData.goongPlaceId || null,
                updatedAt: new Date(),
                service_booking_items: items?.length
                    ? {
                        create: items.map((item) => ({
                            id: require('crypto').randomUUID(),
                            serviceItemId: item.itemId,
                            quantity: item.quantity,
                            price: item.price || 0,
                            updatedAt: new Date(),
                        })),
                    }
                    : undefined,
            },
            include: {
                services: true,
                technicians: true,
                users: true,
                service_booking_items: {
                    include: {
                        service_items: true,
                    },
                },
            },
        });
        try {
            await this.telegram.sendBookingNotification({
                id: booking.id,
                customerName: booking.users?.name || 'N/A',
                customerEmail: booking.users?.email || 'N/A',
                customerPhone: booking.users?.phone,
                serviceName: booking.services?.name || 'N/A',
                scheduledTime: booking.scheduledAt || booking.scheduledTime,
                technicianName: booking.technicians?.name,
                estimatedCost: booking.estimatedCosts,
                status: booking.status,
            });
        }
        catch (error) {
            console.error('Failed to send booking notification:', error);
        }
        return booking;
    }
    async update(id, updateBookingDto) {
        const existingBooking = await this.findOne(id);
        if (!existingBooking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const { items: _items, ...bookingData } = updateBookingDto;
        const updateData = {};
        if (bookingData.serviceId)
            updateData.serviceId = bookingData.serviceId;
        if (bookingData.userId !== undefined)
            updateData.userId = bookingData.userId;
        if (bookingData.technicianId !== undefined)
            updateData.technicianId = bookingData.technicianId;
        if (bookingData.status)
            updateData.status = bookingData.status;
        if (bookingData.scheduledAt)
            updateData.scheduledAt = new Date(bookingData.scheduledAt);
        if (bookingData.scheduledTime)
            updateData.scheduledTime = bookingData.scheduledTime;
        if (bookingData.notes !== undefined)
            updateData.notes = bookingData.notes;
        if (bookingData.estimatedCosts !== undefined)
            updateData.estimatedCosts = bookingData.estimatedCosts;
        if (bookingData.actualCosts !== undefined)
            updateData.actualCosts = bookingData.actualCosts;
        if (bookingData.address !== undefined)
            updateData.address = bookingData.address;
        if (bookingData.coordinates !== undefined)
            updateData.coordinates = bookingData.coordinates;
        if (bookingData.goongPlaceId !== undefined)
            updateData.goongPlaceId = bookingData.goongPlaceId;
        updateData.updatedAt = new Date();
        const booking = await this.prisma.service_bookings.update({
            where: { id },
            data: updateData,
            include: {
                services: true,
                technicians: true,
                users: true,
                service_booking_items: {
                    include: {
                        service_items: true,
                    },
                },
            },
        });
        return booking;
    }
    async delete(id) {
        const booking = await this.findOne(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        await this.prisma.service_booking_items.deleteMany({
            where: { bookingId: id },
        });
        await this.prisma.service_payments.deleteMany({
            where: { bookingId: id },
        });
        await this.prisma.service_bookings.delete({
            where: { id },
        });
        return { success: true, message: 'Booking deleted successfully' };
    }
    async updateStatus(id, status, changedBy) {
        const booking = await this.findOne(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        this.validateStatusTransition(booking.status, status);
        const updated = await this.prisma.service_bookings.update({
            where: { id },
            data: { status, updatedAt: new Date() },
            include: {
                services: true,
                technicians: true,
                users: true,
            },
        });
        try {
            await this.telegram.sendBookingStatusUpdate({
                id: updated.id,
                customerName: updated.users?.name || 'N/A',
                serviceName: updated.services?.name || 'N/A',
            }, booking.status, status);
        }
        catch (error) {
            console.error('Failed to send booking status update:', error);
        }
        return updated;
    }
    async cancelBooking(id, reason, cancelledBy) {
        const booking = await this.findOne(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed booking');
        }
        if (booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        const updated = await this.prisma.service_bookings.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                notes: booking.notes
                    ? `${booking.notes}\n\n[CANCELLED] ${reason}`
                    : `[CANCELLED] ${reason}`,
                updatedAt: new Date(),
            },
            include: {
                services: true,
                technicians: true,
                users: true,
                service_booking_items: {
                    include: {
                        service_items: true,
                    },
                },
            },
        });
        try {
            await this.telegram.sendBookingStatusUpdate({
                id: updated.id,
                customerName: updated.users?.name || 'N/A',
                serviceName: updated.services?.name || 'N/A',
            }, booking.status, 'CANCELLED');
        }
        catch (error) {
            console.error('Failed to send booking cancellation notification:', error);
        }
        return updated;
    }
    async assignTechnician(id, technicianId) {
        const booking = await this.findOne(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const technician = await this.prisma.technicians.findUnique({
            where: { id: technicianId },
        });
        if (!technician) {
            throw new common_1.NotFoundException('Technician not found');
        }
        if (!technician.isActive) {
            throw new common_1.NotFoundException('Technician is not active');
        }
        return this.prisma.service_bookings.update({
            where: { id },
            data: {
                technicianId,
                updatedAt: new Date(),
            },
            include: {
                services: true,
                technicians: true,
                users: true,
                service_booking_items: {
                    include: {
                        service_items: true,
                    },
                },
            },
        });
    }
    async createPayment(bookingId, paymentData) {
        return this.prisma.service_payments.create({
            data: {
                bookingId,
                ...paymentData,
            },
        });
    }
    async updatePaymentStatus(id, status) {
        return this.prisma.service_payments.update({
            where: { id },
            data: { status },
        });
    }
    async checkTechnicianAvailability(technicianId, date, time) {
        const availability = await this.techniciansService.getTechnicianAvailability(technicianId, date);
        if (!availability.isAvailable) {
            return false;
        }
        if (availability.schedule) {
            if (time < availability.schedule.startTime || time > availability.schedule.endTime) {
                return false;
            }
        }
        const conflict = availability.bookings.some(booking => booking.scheduledTime === time);
        return !conflict;
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService,
        technicians_service_1.TechniciansService])
], BookingService);
//# sourceMappingURL=booking.service.js.map