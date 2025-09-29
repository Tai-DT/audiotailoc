import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
export declare class ServiceTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServiceTypeDto: CreateServiceTypeDto): Promise<{
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string;
        color: string;
    }>;
    findAll(): Promise<{
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string;
        color: string;
    }>;
    update(id: string, updateServiceTypeDto: UpdateServiceTypeDto): Promise<{
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string;
        color: string;
    }>;
    remove(id: string): Promise<{
        description: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string;
        color: string;
    }>;
    private generateSlug;
}
