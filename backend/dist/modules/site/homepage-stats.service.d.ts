import { PrismaService } from '../../prisma/prisma.service';
import { CreateHomePageStatsDto, UpdateHomePageStatsDto } from './dto/homepage-stats-create.dto';
export declare class SiteStatsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): unknown;
    findOne(id: string): unknown;
    findByKey(key: string): unknown;
    create(data: CreateHomePageStatsDto): unknown;
    update(id: string, data: UpdateHomePageStatsDto): unknown;
    updateByKey(key: string, data: UpdateHomePageStatsDto): unknown;
    remove(id: string): unknown;
}
