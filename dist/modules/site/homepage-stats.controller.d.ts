import { SiteStatsService } from './homepage-stats.service';
import { CreateHomePageStatsDto, UpdateHomePageStatsDto } from './dto/homepage-stats-create.dto';
export declare class HomePageStatsController {
    private readonly siteStatsService;
    constructor(siteStatsService: SiteStatsService);
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
    create(createHomePageStatsDto: CreateHomePageStatsDto): Promise<{
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
    update(id: string, updateHomePageStatsDto: UpdateHomePageStatsDto): Promise<{
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
    updateByKey(key: string, updateHomePageStatsDto: UpdateHomePageStatsDto): Promise<{
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
