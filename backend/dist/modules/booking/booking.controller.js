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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const swagger_1 = require("@nestjs/swagger");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const update_booking_status_dto_1 = require("./dto/update-booking-status.dto");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_status_dto_1 = require("./dto/update-payment-status.dto");
const assign_technician_dto_1 = require("./dto/assign-technician.dto");
const cancel_booking_dto_1 = require("./dto/cancel-booking.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async findAll(query) {
        return this.bookingService.findAll(query);
    }
    async getMyBookings(req) {
        const userId = req.users?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        return this.bookingService.findByUserId(userId);
    }
    async findOne(id) {
        return this.bookingService.findOne(id);
    }
    async create(createBookingDto) {
        return this.bookingService.create(createBookingDto);
    }
    async update(id, updateBookingDto) {
        return this.bookingService.update(id, updateBookingDto);
    }
    async delete(id) {
        return this.bookingService.delete(id);
    }
    async updateStatus(id, updateStatusDto) {
        return this.bookingService.updateStatus(id, updateStatusDto.status);
    }
    async assignTechnician(id, assignDto) {
        return this.bookingService.assignTechnician(id, assignDto.technicianId);
    }
    async cancelBooking(id, cancelDto) {
        return this.bookingService.cancelBooking(id, cancelDto.reason, cancelDto.cancelledBy);
    }
    async getBookingSummary(id) {
        const booking = await this.bookingService.findOne(id);
        return {
            id: booking.id,
            status: booking.status,
            scheduledAt: booking.scheduledAt,
            scheduledTime: booking.scheduledTime,
            service: {
                id: booking.services?.id,
                name: booking.services?.name,
            },
            technician: booking.technicians
                ? {
                    id: booking.technicians.id,
                    name: booking.technicians.name,
                }
                : null,
            customer: {
                id: booking.users?.id,
                name: booking.users?.name,
                email: booking.users?.email,
            },
            estimatedCosts: booking.estimatedCosts,
            actualCosts: booking.actualCosts,
            paymentStatus: booking.service_payments?.[0]?.status || null,
            createdAt: booking.createdAt,
        };
    }
    async createPayment(createPaymentDto) {
        return this.bookingService.createPayment(createPaymentDto.bookingId || '', createPaymentDto);
    }
    async updatePaymentStatus(paymentId, updatePaymentDto) {
        return this.bookingService.updatePaymentStatus(paymentId, updatePaymentDto.status);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('my-bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user bookings' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_status_dto_1.UpdateBookingStatusDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign technician to booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Technician assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking or technician not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_technician_dto_1.AssignTechnicianDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "assignTechnician", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking cancelled successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot cancel booking (already cancelled or completed)',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_booking_dto_1.CancelBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns booking summary with minimal details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingSummary", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Put)('payments/:paymentId/status'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_status_dto_1.UpdatePaymentStatusDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updatePaymentStatus", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map