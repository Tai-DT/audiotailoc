/// <reference types="multer" />
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    createService(createServiceDto: CreateServiceDto): unknown;
    getServices(query: {
        categoryId?: string;
        typeId?: string;
        isActive?: string;
        page?: string;
        pageSize?: string;
    }): unknown;
    getServiceTypes(): unknown;
    getServiceType(id: string): unknown;
    createServiceType(data: {
        name: string;
        slug?: string;
        description?: string;
        isActive?: boolean;
    }): unknown;
    updateServiceType(id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        isActive?: boolean;
        sortOrder?: number;
    }): unknown;
    deleteServiceType(id: string): unknown;
    getServiceStats(): unknown;
    getService(id: string): unknown;
    getServiceBySlug(slug: string): unknown;
    updateService(id: string, updateServiceDto: UpdateServiceDto): unknown;
    deleteService(id: string): unknown;
    uploadServiceImage(id: string, file: Express.Multer.File): unknown;
    addServiceItem(serviceId: string, createItemDto: {
        name: string;
        priceCents: number;
    }): unknown;
    updateServiceItem(itemId: string, updateItemDto: {
        name?: string;
        priceCents?: number;
    }): unknown;
    deleteServiceItem(itemId: string): unknown;
}
