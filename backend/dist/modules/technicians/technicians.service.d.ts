import { PrismaService } from '../../prisma/prisma.service';
import { ServiceCategory } from '../../common/enums';
export declare class TechniciansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTechnician(data: {
        name: string;
        phone: string;
        email?: string;
        specialties: ServiceCategory[];
    }): Promise<{
        _count: {
            bookings: number;
        };
        schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
    }>;
    getTechnicians(params: {
        isActive?: boolean;
        specialty?: ServiceCategory;
        page?: number;
        pageSize?: number;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        technicians: ({
            _count: {
                bookings: number;
            };
            schedules: {
                id: string;
                createdAt: Date;
                date: Date;
                technicianId: string;
                startTime: string;
                endTime: string;
                isAvailable: boolean;
            }[];
        } & {
            id: string;
            email: string;
            name: string;
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        })[];
    }>;
    getTechnician(id: string): Promise<{
        _count: {
            bookings: number;
        };
        bookings: ({
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
        })[];
        schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
    }>;
    updateTechnician(id: string, data: Partial<{
        name: string;
        phone: string;
        email: string;
        specialties: ServiceCategory[];
        isActive: boolean;
    }>): Promise<{
        _count: {
            bookings: number;
        };
        schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
    }>;
    deleteTechnician(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
    }>;
    setTechnicianSchedule(technicianId: string, schedules: Array<{
        date: Date;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }>): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        technicianId: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }[]>;
    getAvailableTechnicians(params: {
        date: Date;
        time: string;
        specialty?: ServiceCategory;
        duration?: number;
    }): Promise<({
        schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
    })[]>;
    getTechnicianWorkload(technicianId: string, params: {
        fromDate?: Date;
        toDate?: Date;
    }): Promise<{
        totalBookings: number;
        completedBookings: number;
        pendingBookings: number;
        completionRate: number;
        totalRevenue: any;
    }>;
    getTechnicianStats(): Promise<{
        totalTechnicians: number;
        activeTechnicians: number;
        totalBookings: number;
        completedBookings: number;
        topPerformers: any[];
    }>;
}
