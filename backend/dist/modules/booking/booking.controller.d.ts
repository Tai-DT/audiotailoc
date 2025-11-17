import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    findAll(_query: any): Promise<({
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                quantity: number;
                serviceId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            quantity: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            paidAt: Date | null;
            bookingId: string;
        }[];
        services: {
            tags: string | null;
            description: string | null;
            type: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
            duration: number;
            price: number;
            metadata: string | null;
            minPrice: number | null;
            maxPrice: number | null;
            basePriceCents: number;
            priceType: string;
            typeId: string | null;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            requirements: string | null;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    })[]>;
    getMyBookings(req: any): Promise<({
        service_booking_items: ({
            service_items: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            quantity: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
        }[];
        services: {
            id: string;
            name: string;
            slug: string;
        };
        technicians: {
            id: string;
            name: string;
            phone: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    })[]>;
    findOne(id: string): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                quantity: number;
                serviceId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            quantity: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            paidAt: Date | null;
            bookingId: string;
        }[];
        services: {
            tags: string | null;
            description: string | null;
            type: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
            duration: number;
            price: number;
            metadata: string | null;
            minPrice: number | null;
            maxPrice: number | null;
            basePriceCents: number;
            priceType: string;
            typeId: string | null;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            requirements: string | null;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    }>;
    create(createBookingDto: CreateBookingDto): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                quantity: number;
                serviceId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            quantity: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        services: {
            tags: string | null;
            description: string | null;
            type: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
            duration: number;
            price: number;
            metadata: string | null;
            minPrice: number | null;
            maxPrice: number | null;
            basePriceCents: number;
            priceType: string;
            typeId: string | null;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            requirements: string | null;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    }>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                quantity: number;
                serviceId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            quantity: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        services: {
            tags: string | null;
            description: string | null;
            type: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
            duration: number;
            price: number;
            metadata: string | null;
            minPrice: number | null;
            maxPrice: number | null;
            basePriceCents: number;
            priceType: string;
            typeId: string | null;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            requirements: string | null;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateBookingStatusDto): Promise<{
        services: {
            tags: string | null;
            description: string | null;
            type: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
            duration: number;
            price: number;
            metadata: string | null;
            minPrice: number | null;
            maxPrice: number | null;
            basePriceCents: number;
            priceType: string;
            typeId: string | null;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            requirements: string | null;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    }>;
    assignTechnician(id: string, assignDto: AssignTechnicianDto): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                quantity: number;
                serviceId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            quantity: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        services: {
            tags: string | null;
            description: string | null;
            type: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
            duration: number;
            price: number;
            metadata: string | null;
            minPrice: number | null;
            maxPrice: number | null;
            basePriceCents: number;
            priceType: string;
            typeId: string | null;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            requirements: string | null;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    }>;
    createPayment(createPaymentDto: CreatePaymentDto): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        transactionId: string | null;
        provider: string;
        amountCents: number;
        paidAt: Date | null;
        bookingId: string;
    }>;
    updatePaymentStatus(paymentId: string, updatePaymentDto: UpdatePaymentStatusDto): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        transactionId: string | null;
        provider: string;
        amountCents: number;
        paidAt: Date | null;
        bookingId: string;
    }>;
}
