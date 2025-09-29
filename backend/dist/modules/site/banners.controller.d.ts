import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(page?: string, active?: string, search?: string, skip?: string, take?: string): unknown;
    getActive(page?: string): unknown;
    findOne(id: string): unknown;
}
