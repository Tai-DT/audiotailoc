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
const enums_1 = require("../../common/enums");
const swagger_1 = require("@nestjs/swagger");
const update_booking_status_dto_1 = require("./dto/update-booking-status.dto");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_status_dto_1 = require("./dto/update-payment-status.dto");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async createBooking(createBookingDto) {
        const scheduledAt = new Date(createBookingDto.scheduledDate);
        if (isNaN(scheduledAt.getTime())) {
            throw new common_1.BadRequestException('Invalid scheduled date format');
        }
        return this.bookingService.createBooking({
            ...createBookingDto,
            scheduledAt,
        });
    }
    async getBookings(query) {
        return this.bookingService.getBookings({
            status: query.status,
            technicianId: query.technicianId,
            userId: query.userId,
            serviceId: query.serviceId,
            fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
            toDate: query.toDate ? new Date(query.toDate) : undefined,
            page: query.page ? parseInt(query.page) : undefined,
            pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
        });
    }
    async getBookingStats(query) {
        return this.bookingService.getBookingStats({
            fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
            toDate: query.toDate ? new Date(query.toDate) : undefined,
            technicianId: query.technicianId,
        });
    }
    async getBooking(id) {
        return this.bookingService.getBooking(id);
    }
    async updateBooking(id, updateData) {
        let scheduledAt;
        if (updateData.scheduledDate) {
            scheduledAt = new Date(updateData.scheduledDate);
            if (isNaN(scheduledAt.getTime())) {
                throw new common_1.BadRequestException('Invalid scheduled date format');
            }
        }
        return this.bookingService.updateBooking(id, {
            ...updateData,
            scheduledAt,
        });
    }
    async updateBookingStatus(id, updateStatusDto) {
        return this.bookingService.updateBookingStatus(id, updateStatusDto.status, updateStatusDto.note, updateStatusDto.changedBy);
    }
    async assignTechnician(id, assignDto) {
        return this.bookingService.assignTechnician(id, assignDto.technicianId, assignDto.note);
    }
    async rescheduleBooking(id, rescheduleDto) {
        return this.bookingService.rescheduleBooking(id, new Date(rescheduleDto.newDate), rescheduleDto.newTime, rescheduleDto.note);
    }
    async cancelBooking(id, cancelDto) {
        return this.bookingService.cancelBooking(id, cancelDto.reason);
    }
    async createPayment(bookingId, createPaymentDto) {
        return this.bookingService.createPayment(bookingId, createPaymentDto);
    }
    async updatePaymentStatus(paymentId, updatePaymentDto) {
        return this.bookingService.updatePaymentStatus(paymentId, updatePaymentDto.status, updatePaymentDto.transactionId);
    }
    async deleteBooking(id) {
        const booking = await this.bookingService.getBooking(id);
        if (booking.status === enums_1.ServiceBookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot delete a completed booking.');
        }
        return this.bookingService.deleteBooking(id);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBooking", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update booking details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update booking status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_status_dto_1.UpdateBookingStatusDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "assignTechnician", null);
__decorate([
    (0, common_1.Put)(':id/reschedule'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "rescheduleBooking", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "cancelBooking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a booking payment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment created' }),
    (0, common_1.Post)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createPayment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update payment status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment updated' }),
    (0, common_1.Put)('payments/:paymentId/status'),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_status_dto_1.UpdatePaymentStatusDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "deleteBooking", null);
exports.BookingController = BookingController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map