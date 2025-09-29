import { SiteStatsService } from './homepage-stats.service';
import { CreateHomePageStatsDto, UpdateHomePageStatsDto } from './dto/homepage-stats-create.dto';
export declare class HomePageStatsController {
    private readonly siteStatsService;
    constructor(siteStatsService: SiteStatsService);
    findAll(): unknown;
    findOne(id: string): unknown;
    findByKey(key: string): unknown;
    create(createHomePageStatsDto: CreateHomePageStatsDto): unknown;
    update(id: string, updateHomePageStatsDto: UpdateHomePageStatsDto): unknown;
    updateByKey(key: string, updateHomePageStatsDto: UpdateHomePageStatsDto): unknown;
    remove(id: string): unknown;
}
