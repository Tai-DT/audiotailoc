import { TechniciansService } from './technicians.service';
import { ServiceCategory } from '../../common/enums';
export declare class TechniciansController {
    private readonly techniciansService;
    constructor(techniciansService: TechniciansService);
    createTechnician(createTechnicianDto: {
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
    getTechnicians(query: {
        isActive?: string;
        specialty?: ServiceCategory;
        page?: string;
        pageSize?: string;
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
    getTechnicianStats(): Promise<{
        totalTechnicians: number;
        activeTechnicians: number;
        totalBookings: number;
        completedBookings: number;
        topPerformers: any[];
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
    getTechnicianWorkload(id: string, query: {
        fromDate?: string;
        toDate?: string;
    }): Promise<{
        totalBookings: number;
        completedBookings: number;
        pendingBookings: number;
        completionRate: number;
        totalRevenue: any;
    }>;
    updateTechnician(id: string, updateTechnicianDto: {
        name?: string;
        phone?: string;
        email?: string;
        specialties?: ServiceCategory[];
        isActive?: boolean;
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
    deleteTechnician(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
    }>;
    setTechnicianSchedule(id: string, scheduleDto: {
        schedules: Array<{
            date: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }>;
    }): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        technicianId: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }[]>;
}
