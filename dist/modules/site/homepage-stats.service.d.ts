import { PrismaService } from '../../prisma/prisma.service';
import { CreateHomePageStatsDto, UpdateHomePageStatsDto } from './dto/homepage-stats-create.dto';
export declare class SiteStatsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }[]>;
    findOne(id: string): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }>;
    findByKey(key: string): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }>;
    create(data: CreateHomePageStatsDto): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }>;
    update(id: string, data: UpdateHomePageStatsDto): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }>;
    updateByKey(key: string, data: UpdateHomePageStatsDto): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }>;
    remove(id: string): Promise<{
        key: string;
        value: string;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        displayOrder: number;
        icon: string;
        label: string;
    }>;
}
