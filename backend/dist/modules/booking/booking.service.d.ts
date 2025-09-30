import { PrismaService } from '../../prisma/prisma.service';
export declare class BookingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string | null;
            description: string | null;
            type: string | null;
            duration: number;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
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
        technician: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        items: ({
            serviceItem: {
                id: string;
                name: string;
                createdAt: Date;
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
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            paidAt: Date | null;
            bookingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string | null;
            description: string | null;
            type: string | null;
            duration: number;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
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
        technician: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
        items: ({
            serviceItem: {
                id: string;
                name: string;
                createdAt: Date;
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
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            paidAt: Date | null;
            bookingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        scheduledAt: Date | null;
        notes: string | null;
        serviceId: string;
        technicianId: string | null;
        scheduledTime: string | null;
        completedAt: Date | null;
        estimatedCosts: number | null;
        actualCosts: number | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string | null;
            phone: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string | null;
            description: string | null;
            type: string | null;
            duration: number;
            slug: string;
            shortDescription: string | null;
            images: string | null;
            features: string | null;
            isActive: boolean;
            viewCount: number;
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
        technician: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
