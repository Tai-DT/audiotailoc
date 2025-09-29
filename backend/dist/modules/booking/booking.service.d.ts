import { PrismaService } from '../../prisma/prisma.service';
export declare class BookingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string;
            description: string;
            type: string;
            duration: number;
            slug: string;
            shortDescription: string;
            features: string;
            images: string;
            isActive: boolean;
            isFeatured: boolean;
            viewCount: number;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            seoTitle: string;
            seoDescription: string;
            requirements: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        items: ({
            serviceItem: {
                id: string;
                name: string;
                createdAt: Date;
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
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        scheduledAt: Date;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string;
            description: string;
            type: string;
            duration: number;
            slug: string;
            shortDescription: string;
            features: string;
            images: string;
            isActive: boolean;
            isFeatured: boolean;
            viewCount: number;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            seoTitle: string;
            seoDescription: string;
            requirements: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
        items: ({
            serviceItem: {
                id: string;
                name: string;
                createdAt: Date;
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
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            amountCents: number;
            transactionId: string;
            bookingId: string;
            paidAt: Date;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        scheduledAt: Date;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    updateStatus(id: string, status: string): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            name: string;
            phone: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
        service: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string;
            description: string;
            type: string;
            duration: number;
            slug: string;
            shortDescription: string;
            features: string;
            images: string;
            isActive: boolean;
            isFeatured: boolean;
            viewCount: number;
            price: number;
            metadata: string;
            basePriceCents: number;
            minPrice: number;
            maxPrice: number;
            priceType: string;
            typeId: string;
            seoTitle: string;
            seoDescription: string;
            requirements: string;
        };
        technician: {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        scheduledAt: Date;
        notes: string;
        serviceId: string;
        technicianId: string;
        scheduledTime: string;
        completedAt: Date;
        estimatedCosts: number;
        actualCosts: number;
    }>;
    createPayment(bookingId: string, paymentData: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        provider: string;
        amountCents: number;
        transactionId: string;
        bookingId: string;
        paidAt: Date;
    }>;
    updatePaymentStatus(id: string, status: string): Promise<{
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
