import { PrismaService } from '../../prisma/prisma.service';
import { CreateBannerDto } from './dto/banner-create.dto';
import { UpdateBannerDto } from './dto/banner-update.dto';
import { Prisma } from '@prisma/client';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        page?: string;
        isActive?: boolean;
        search?: string;
        skip?: number;
        take?: number;
        orderBy?: Prisma.BannerOrderByWithRelationInput;
    }): unknown;
    findById(id: string): unknown;
    create(data: CreateBannerDto): unknown;
    update(id: string, data: UpdateBannerDto): unknown;
    softDelete(id: string): unknown;
    reorder(idsInOrder: string[]): unknown;
    getActiveBanners(page?: string): unknown;
}
