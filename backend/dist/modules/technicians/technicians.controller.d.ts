/// <reference types="node" />
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
    }): unknown;
    getTechnicians(query: {
        isActive?: string;
        specialty?: ServiceCategory;
        page?: string;
        pageSize?: string;
    }): unknown;
    getAvailableTechnicians(query: {
        date: string;
        time: string;
        specialty?: ServiceCategory;
        duration?: string;
    }): unknown;
    getTechnicianStats(): unknown;
    getTechnician(id: string): unknown;
    getTechnicianWorkload(id: string, query: {
        fromDate?: string;
        toDate?: string;
    }): unknown;
    updateTechnician(id: string, updateTechnicianDto: {
        name?: string;
        phone?: string;
        email?: string;
        specialties?: ServiceCategory[];
        isActive?: boolean;
    }): unknown;
    deleteTechnician(id: string): unknown;
    setTechnicianSchedule(id: string, scheduleDto: {
        schedules: Array<{
            date: string;
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }>;
    }): unknown;
}
