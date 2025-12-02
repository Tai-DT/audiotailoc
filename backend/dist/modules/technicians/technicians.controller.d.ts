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
        phone: string | null;
        createdAt: Date;
        isActive: boolean;
        specialties: string | null;
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
            phone: string | null;
            createdAt: Date;
            isActive: boolean;
            specialties: string | null;
        })[];
    }>;
    getAvailableTechnicians(query: {
        date: string;
        time: string;
        specialty?: ServiceCategory;
        duration?: string;
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
                metadata: string | null;
                duration: number;
                price: number;
                basePriceCents: number;
                minPrice: number | null;
                maxPrice: number | null;
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
            address: string | null;
            userId: string | null;
            scheduledAt: Date | null;
            serviceId: string;
            technicianId: string | null;
            scheduledTime: string | null;
            completedAt: Date | null;
            notes: string | null;
            estimatedCosts: number | null;
            actualCosts: number | null;
            coordinates: string | null;
            goongPlaceId: string | null;
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
    getTechnicianAvailability(id: string, date: string): Promise<{
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
