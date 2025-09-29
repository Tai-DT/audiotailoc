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
    }): Promise<any>;
    getBookings(query: {
        status?: ServiceBookingStatus;
        technicianId?: string;
        userId?: string;
        serviceId?: string;
        fromDate?: string;
        toDate?: string;
        page?: string;
        pageSize?: string;
    }): Promise<any>;
    getBookingStats(query: {
        fromDate?: string;
        toDate?: string;
        technicianId?: string;
    }): Promise<any>;
    getBooking(id: string): Promise<any>;
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
    }): Promise<any>;
    updateBookingStatus(id: string, updateStatusDto: UpdateBookingStatusDto): Promise<any>;
    assignTechnician(id: string, assignDto: {
        technicianId: string;
        note?: string;
    }): Promise<any>;
    rescheduleBooking(id: string, rescheduleDto: {
        newDate: string;
        newTime: string;
        note?: string;
    }): Promise<any>;
    cancelBooking(id: string, cancelDto: {
        reason?: string;
    }): Promise<any>;
    createPayment(bookingId: string, createPaymentDto: CreatePaymentDto): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        provider: string;
        amountCents: number;
        transactionId: string;
        bookingId: string;
        paidAt: Date;
    }>;
    updatePaymentStatus(paymentId: string, updatePaymentDto: UpdatePaymentStatusDto): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        provider: string;
        amountCents: number;
        transactionId: string;
        bookingId: string;
        paidAt: Date;
    }>;
}
