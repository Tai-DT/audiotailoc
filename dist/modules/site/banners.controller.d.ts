import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(page?: string, active?: string, search?: string, skip?: string, take?: string): Promise<{
        items: {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            page: string;
            title: string;
            imageUrl: string;
            isActive: boolean;
            isDeleted: boolean;
            subtitle: string;
            mobileImageUrl: string;
            linkUrl: string;
            buttonLabel: string;
            locale: string;
            position: number;
            startAt: Date;
            endAt: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getActive(page?: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        page: string;
        title: string;
        imageUrl: string;
        isActive: boolean;
        isDeleted: boolean;
        subtitle: string;
        mobileImageUrl: string;
        linkUrl: string;
        buttonLabel: string;
        locale: string;
        position: number;
        startAt: Date;
        endAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        page: string;
        title: string;
        imageUrl: string;
        isActive: boolean;
        isDeleted: boolean;
        subtitle: string;
        mobileImageUrl: string;
        linkUrl: string;
        buttonLabel: string;
        locale: string;
        position: number;
        startAt: Date;
        endAt: Date;
    }>;
}
