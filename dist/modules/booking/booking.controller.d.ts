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
        scheduledDate: string;
        scheduledTime: string;
        notes?: string;
        items?: Array<{
            itemId: string;
            quantity: number;
        }>;
    }): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    getBookings(query: {
        status?: ServiceBookingStatus;
        technicianId?: string;
        userId?: string;
        serviceId?: string;
        fromDate?: string;
        toDate?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        bookings: ({
            service_booking_items: ({
                service_items: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    quantity: number;
                    serviceId: string;
                    price: number;
                };
            } & {
                id: string;
                createdAt: Date;
                quantity: number;
                price: number;
                bookingId: string;
                serviceItemId: string;
            })[];
            services: {
                service_types: {
                    description: string;
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    sortOrder: number;
                    slug: string;
                    isActive: boolean;
                    icon: string;
                    color: string;
                };
            } & {
                tags: string;
                description: string;
                type: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                duration: number;
                slug: string;
                viewCount: number;
                seoTitle: string;
                seoDescription: string;
                images: string;
                shortDescription: string;
                features: string;
                isActive: boolean;
                isFeatured: boolean;
                price: number;
                metadata: string;
                basePriceCents: number;
                minPrice: number;
                maxPrice: number;
                priceType: string;
                typeId: string;
                requirements: string;
            };
            technicians: {
                id: string;
                email: string;
                name: string;
                phone: string;
                createdAt: Date;
                isActive: boolean;
                specialties: string;
            };
            users: {
                id: string;
                email: string;
                password: string;
                name: string;
                phone: string;
                role: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            notes: string;
            serviceId: string;
            technicianId: string;
            scheduledAt: Date;
            scheduledTime: string;
            completedAt: Date;
            estimatedCosts: number;
            actualCosts: number;
        })[];
    }>;
    getBookingStats(query: {
        fromDate?: string;
        toDate?: string;
        technicianId?: string;
    }): Promise<{
        totalBookings: number;
        pendingBookings: number;
        confirmedBookings: number;
        inProgressBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
    }>;
    getBooking(id: string): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    updateBooking(id: string, updateData: {
        userId?: string;
        serviceId?: string;
        technicianId?: string | null;
        scheduledDate?: string;
        scheduledTime?: string;
        status?: ServiceBookingStatus;
        notes?: string;
        estimatedCosts?: number;
        actualCosts?: number;
    }): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    updateBookingStatus(id: string, updateStatusDto: UpdateBookingStatusDto): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    assignTechnician(id: string, assignDto: {
        technicianId: string;
        note?: string;
    }): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    rescheduleBooking(id: string, rescheduleDto: {
        newDate: string;
        newTime: string;
        note?: string;
    }): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    cancelBooking(id: string, cancelDto: {
        reason?: string;
    }): Promise<{
        service_booking_items: ({
            service_items: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                serviceId: string;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            quantity: number;
            price: number;
            bookingId: string;
            serviceItemId: string;
        })[];
        service_payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
        service_status_history: {
            status: string;
            id: string;
            createdAt: Date;
            bookingId: string;
            newStatus: string;
            note: string;
            changedBy: string;
        }[];
        services: {
            service_types: {
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                slug: string;
                isActive: boolean;
                icon: string;
                color: string;
            };
        } & {
            tags: string;
            description: string;
            type: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            slug: string;
            viewCount: number;
            seoTitle: string;
            seoDescription: string;
            images: string;
            shortDescription: string;
            features: string;
            isActive: boolean;
            isFeatured: boolean;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            requirements: string;
        };
        technicians: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        users: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
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
    deleteBooking(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledAt: Date;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
}
