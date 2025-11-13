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
let BookingService = class BookingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.service_bookings.findMany({
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
        });
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
    async create(createBookingDto) {
        const { items, ...bookingData } = createBookingDto;
        if (!bookingData.serviceId) {
            throw new common_1.NotFoundException('Service ID is required');
        }
        const service = await this.prisma.services.findUnique({
            where: { id: bookingData.serviceId }
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
                    where: { id: item.itemId }
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
                    role: 'USER'
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            if (availableUser) {
                userId = availableUser.id;
            }
            else {
                const adminUser = await this.prisma.users.findFirst({
                    where: {
                        role: 'ADMIN'
                    }
                });
                if (!adminUser) {
                    throw new common_1.NotFoundException('No user available for booking');
                }
                userId = adminUser.id;
            }
        }
        if (bookingData.technicianId) {
            const technician = await this.prisma.technicians.findUnique({
                where: { id: bookingData.technicianId }
            });
            if (!technician) {
                throw new common_1.NotFoundException('Technician not found');
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
                updatedAt: new Date(),
                service_booking_items: items?.length ? {
                    create: items.map((item) => ({
                        id: require('crypto').randomUUID(),
                        serviceItemId: item.itemId,
                        quantity: item.quantity,
                        price: item.price || 0,
                        updatedAt: new Date(),
                    })),
                } : undefined,
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
    async updateStatus(id, status) {
        const booking = await this.findOne(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return this.prisma.service_bookings.update({
            where: { id },
            data: { status, updatedAt: new Date() },
            include: {
                services: true,
                technicians: true,
                users: true,
            },
        });
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
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingService);
//# sourceMappingURL=booking.service.js.map