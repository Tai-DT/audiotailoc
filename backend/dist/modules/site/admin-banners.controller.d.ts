import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/banner-create.dto';
import { UpdateBannerDto } from './dto/banner-update.dto';
export declare class AdminBannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(page?: string, search?: string, skip?: string, take?: string): unknown;
    findOne(id: string): unknown;
    create(data: CreateBannerDto): unknown;
    update(id: string, data: UpdateBannerDto): unknown;
    remove(id: string): unknown;
    reorder(data: {
        ids: string[];
    }): unknown;
}
