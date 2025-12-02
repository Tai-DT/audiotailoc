import { PrismaService } from '../../prisma/prisma.service';
export declare class BookingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
            minPrice: number | null;
            maxPrice: number | null;
            metadata: string | null;
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
            minPrice: number | null;
            maxPrice: number | null;
            metadata: string | null;
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
    findByUserId(userId: string): Promise<({
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
    create(createBookingDto: any): Promise<{
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
            minPrice: number | null;
            maxPrice: number | null;
            metadata: string | null;
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
    update(id: string, updateBookingDto: any): Promise<{
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
            minPrice: number | null;
            maxPrice: number | null;
            metadata: string | null;
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
    updateStatus(id: string, status: string): Promise<{
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
            minPrice: number | null;
            maxPrice: number | null;
            metadata: string | null;
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
    assignTechnician(id: string, technicianId: string): Promise<{
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
            minPrice: number | null;
            maxPrice: number | null;
            metadata: string | null;
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
    createPayment(bookingId: string, paymentData: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        transactionId: string | null;
        provider: string;
        amountCents: number;
        paidAt: Date | null;
        bookingId: string;
    }>;
    updatePaymentStatus(id: string, status: string): Promise<{
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
