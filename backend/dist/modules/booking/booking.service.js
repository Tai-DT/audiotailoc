"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
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
        const userId = bookingData.userId;
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required for booking');
        }
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (bookingData.technicianId) {
            const technician = await this.prisma.technicians.findUnique({
                where: { id: bookingData.technicianId },
            });
            if (!technician) {
                throw new common_1.NotFoundException('Technician not found');
            }
        }
        const booking = await this.prisma.service_bookings.create({
            data: {
                id: bookingData.id || crypto.randomUUID(),
                serviceId: bookingData.serviceId,
                userId: userId,
                technicianId: bookingData.technicianId || null,
                status: bookingData.status || 'PENDING',
                scheduledAt: new Date(bookingData.scheduledAt),
                scheduledTime: bookingData.scheduledTime,
                notes: bookingData.notes || null,
                estimatedCosts: bookingData.estimatedCosts || 0,
                updatedAt: new Date(),
                service_booking_items: items?.length
                    ? {
                        create: items.map((item) => ({
                            id: crypto.randomUUID(),
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