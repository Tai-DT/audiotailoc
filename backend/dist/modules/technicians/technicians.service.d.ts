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
        phone: string | null;
        createdAt: Date;
        isActive: boolean;
        specialties: string | null;
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
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
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
        phone: string | null;
        createdAt: Date;
        isActive: boolean;
        specialties: string | null;
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
        phone: string | null;
        createdAt: Date;
        isActive: boolean;
        specialties: string | null;
    }>;
    deleteTechnician(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        isActive: boolean;
        specialties: string | null;
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
        phone: string | null;
        createdAt: Date;
        isActive: boolean;
        specialties: string | null;
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
