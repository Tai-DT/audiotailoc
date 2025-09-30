import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
export declare class ServiceTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServiceTypeDto: CreateServiceTypeDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    update(id: string, updateServiceTypeDto: UpdateServiceTypeDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        slug: string;
        isActive: boolean;
        icon: string | null;
        color: string | null;
    }>;
    private generateSlug;
}
