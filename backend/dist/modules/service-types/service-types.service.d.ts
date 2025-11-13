import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
export declare class ServiceTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServiceTypeDto: CreateServiceTypeDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    findAll(): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    update(id: string, updateServiceTypeDto: UpdateServiceTypeDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    private generateSlug;
}
