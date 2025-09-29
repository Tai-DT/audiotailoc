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
        phone: string;
        createdAt: Date;
        isActive: boolean;
        specialties: string;
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
