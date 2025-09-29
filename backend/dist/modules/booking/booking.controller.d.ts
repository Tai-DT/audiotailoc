/// <reference types="node" />
import { BookingService } from './booking.service';
import { ServiceBookingStatus } from '../../common/enums';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(createBookingDto: {
        serviceId: string;
        userId?: string;
        customerName: string;
        customerPhone: string;
        customerEmail?: string;
        customerAddress: string;
        scheduledAt: string;
        scheduledTime: string;
        notes?: string;
        items?: Array<{
            itemId: string;
            quantity: number;
        }>;
    }): unknown;
    getBookings(query: {
        status?: ServiceBookingStatus;
        technicianId?: string;
        userId?: string;
        serviceId?: string;
        fromDate?: string;
        toDate?: string;
        page?: string;
        pageSize?: string;
    }): unknown;
    getBookingStats(query: {
        fromDate?: string;
        toDate?: string;
        technicianId?: string;
    }): unknown;
    getBooking(id: string): unknown;
    updateBooking(id: string, updateData: {
        userId?: string;
        serviceId?: string;
        technicianId?: string | null;
        scheduledAt?: string;
        scheduledTime?: string;
        status?: ServiceBookingStatus;
        notes?: string;
        estimatedCosts?: number;
        actualCosts?: number;
    }): unknown;
    updateBookingStatus(id: string, updateStatusDto: UpdateBookingStatusDto): unknown;
    assignTechnician(id: string, assignDto: {
        technicianId: string;
        note?: string;
    }): unknown;
    rescheduleBooking(id: string, rescheduleDto: {
        newDate: string;
        newTime: string;
        note?: string;
    }): unknown;
    cancelBooking(id: string, cancelDto: {
        reason?: string;
    }): unknown;
    createPayment(bookingId: string, createPaymentDto: CreatePaymentDto): unknown;
    updatePaymentStatus(paymentId: string, updatePaymentDto: UpdatePaymentStatusDto): unknown;
}
