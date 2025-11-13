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
        technician_schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
        _count: {
            service_bookings: number;
        };
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
            technician_schedules: {
                id: string;
                createdAt: Date;
                date: Date;
                technicianId: string;
                startTime: string;
                endTime: string;
                isAvailable: boolean;
            }[];
            _count: {
                service_bookings: number;
            };
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
        service_bookings: ({
            services: {
                tags: string | null;
                description: string | null;
                type: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
        technician_schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
        _count: {
            service_bookings: number;
        };
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
        technician_schedules: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }[];
        _count: {
            service_bookings: number;
        };
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
    setTechnicianSchedule(technicianId: string, technician_schedules: Array<{
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
        technician_schedules: {
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
    getTechnicianAvailability(technicianId: string, date: Date): Promise<{
        technician: {
            id: string;
            name: string;
            isActive: boolean;
        };
        date: Date;
        schedule: {
            id: string;
            createdAt: Date;
            date: Date;
            technicianId: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        };
        bookings: {
            status: string;
            id: string;
            scheduledAt: Date;
            scheduledTime: string;
        }[];
        isAvailable: boolean;
        bookedSlots: number;
    }>;
    getTechnicianStats(): Promise<{
        totalTechnicians: number;
        activeTechnicians: number;
        totalBookings: number;
        completedBookings: number;
        topPerformers: any[];
    }>;
}
