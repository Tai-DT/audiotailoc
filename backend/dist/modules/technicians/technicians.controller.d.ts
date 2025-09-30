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
    getAvailableTechnicians(query: {
        date: string;
        time: string;
        specialty?: ServiceCategory;
        duration?: string;
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
    getTechnicianStats(): Promise<{
        totalTechnicians: number;
        activeTechnicians: number;
        totalBookings: number;
        completedBookings: number;
        topPerformers: any[];
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
            userId: string;
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
