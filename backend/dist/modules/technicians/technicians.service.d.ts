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
            phone: string;
            createdAt: Date;
            isActive: boolean;
            specialties: string;
        })[];
    }>;
    getTechnician(id: string): Promise<{
        service_bookings: ({
            services: {
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
