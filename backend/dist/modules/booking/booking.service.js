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
        return this.prisma.serviceBooking.findMany({
            include: {
                service: true,
                technician: true,
                user: true,
                items: {
                    include: {
                        serviceItem: true,
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const booking = await this.prisma.serviceBooking.findUnique({
            where: { id },
            include: {
                service: true,
                technician: true,
                user: true,
                items: {
                    include: {
                        serviceItem: true,
                    },
                },
                payments: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async updateStatus(id, status) {
        return this.prisma.serviceBooking.update({
            where: { id },
            data: { status },
            include: {
                service: true,
                technician: true,
                user: true,
            },
        });
    }
    async createPayment(bookingId, paymentData) {
        return this.prisma.servicePayment.create({
            data: {
                bookingId,
                ...paymentData,
            },
        });
    }
    async updatePaymentStatus(id, status) {
        return this.prisma.servicePayment.update({
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