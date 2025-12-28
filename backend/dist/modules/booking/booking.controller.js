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
const create_guest_booking_dto_1 = require("./dto/create-guest-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const update_booking_status_dto_1 = require("./dto/update-booking-status.dto");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_status_dto_1 = require("./dto/update-payment-status.dto");
const assign_technician_dto_1 = require("./dto/assign-technician.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const admin_guard_1 = require("../auth/admin.guard");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async findAll(_query) {
        return this.bookingService.findAll();
    }
    async getMyBookings(req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        return this.bookingService.findByUserId(userId);
    }
    async findOne(id, req) {
        const booking = await this.bookingService.findOne(id);
        const authenticatedUserId = req.user?.sub || req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
        const bookingUserId = booking?.userId || booking?.users?.id;
        if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only view your own bookings');
        }
        return booking;
    }
    async create(createBookingDto, req) {
        const authenticatedUserId = req.user?.sub || req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
        if (createBookingDto.userId && !isAdmin && createBookingDto.userId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only create bookings for yourself');
        }
        if (!isAdmin) {
            createBookingDto.userId = authenticatedUserId;
        }
        return this.bookingService.create(createBookingDto);
    }
    async createGuestBooking(guestBookingDto) {
        return this.bookingService.createGuestBooking(guestBookingDto);
    }
    async update(id, updateBookingDto, req) {
        const booking = await this.bookingService.findOne(id);
        const authenticatedUserId = req.user?.sub || req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
        const bookingUserId = booking?.userId || booking?.users?.id;
        if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only update your own bookings');
        }
        if (updateBookingDto.userId && !isAdmin && updateBookingDto.userId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You cannot assign bookings to other users');
        }
        return this.bookingService.update(id, updateBookingDto);
    }
    async delete(id, req) {
        const booking = await this.bookingService.findOne(id);
        const authenticatedUserId = req.user?.sub || req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
        const bookingUserId = booking?.userId || booking?.users?.id;
        if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only delete your own bookings');
        }
        return this.bookingService.delete(id);
    }
    async updateStatus(id, updateStatusDto, req) {
        const booking = await this.bookingService.findOne(id);
        const authenticatedUserId = req.user?.sub || req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
        const bookingUserId = booking?.userId || booking?.users?.id;
        if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only update status of your own bookings');
        }
        return this.bookingService.updateStatus(id, updateStatusDto.status);
    }
    async assignTechnician(id, assignDto) {
        return this.bookingService.assignTechnician(id, assignDto.technicianId);
    }
    async createPayment(createPaymentDto, req) {
        const booking = await this.bookingService.findOne(createPaymentDto.bookingId || '');
        const authenticatedUserId = req.user?.sub || req.user?.id;
        const isAdmin = req.user?.role === 'ADMIN' || req.user?.email === process.env.ADMIN_EMAIL;
        const bookingUserId = booking?.userId || booking?.users?.id;
        if (!isAdmin && bookingUserId && bookingUserId !== authenticatedUserId) {
            throw new common_1.ForbiddenException('You can only create payments for your own bookings');
        }
        return this.bookingService.createPayment(createPaymentDto.bookingId || '', createPaymentDto);
    }
    async updatePaymentStatus(paymentId, updatePaymentDto) {
        return this.bookingService.updatePaymentStatus(paymentId, updatePaymentDto.status);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_guard_1.AdminGuard),
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
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('guest'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a booking as a guest (no authentication required)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Guest booking created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guest_booking_dto_1.CreateGuestBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createGuestBooking", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_status_dto_1.UpdateBookingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_guard_1.AdminGuard),
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
    (0, common_1.Post)('payments'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Put)('payments/:paymentId/status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_guard_1.AdminGuard),
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