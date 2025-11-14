import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
export declare class ServiceTypesController {
    private readonly serviceTypesService;
    constructor(serviceTypesService: ServiceTypesService);
    create(createServiceTypeDto: CreateServiceTypeDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        sortOrder: number;
        icon: string | null;
        color: string | null;
    }>;
    testCreate(createServiceTypeDto: CreateServiceTypeDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        sortOrder: number;
        icon: string | null;
        color: string | null;
    }>;
    debug(): {
        message: string;
        timestamp: string;
    };
    testEndpoint(): {
        message: string;
        timestamp: string;
    };
    simpleTest(): {
        status: string;
        message: string;
    };
    findAll(): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        sortOrder: number;
        icon: string | null;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        sortOrder: number;
        icon: string | null;
        color: string | null;
    }>;
    update(id: string, updateServiceTypeDto: UpdateServiceTypeDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        sortOrder: number;
        icon: string | null;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        sortOrder: number;
        icon: string | null;
        color: string | null;
    }>;
}
