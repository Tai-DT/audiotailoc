import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(page?: string, active?: string, search?: string, skip?: string, take?: string): Promise<{
        items: {
            page: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            isActive: boolean;
            isDeleted: boolean;
            imageUrl: string;
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
        page: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        isActive: boolean;
        isDeleted: boolean;
        imageUrl: string;
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
        page: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        isActive: boolean;
        isDeleted: boolean;
        imageUrl: string;
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
