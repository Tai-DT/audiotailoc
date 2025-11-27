import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(page?: string, active?: string, search?: string, skip?: string, take?: string): Promise<{
        items: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            imageUrl: string;
            isActive: boolean;
            page: string;
            title: string;
            subtitle: string | null;
            mobileImageUrl: string | null;
            linkUrl: string | null;
            buttonLabel: string | null;
            locale: string | null;
            position: number;
            startAt: Date | null;
            endAt: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getActive(page?: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        imageUrl: string;
        isActive: boolean;
        page: string;
        title: string;
        subtitle: string | null;
        mobileImageUrl: string | null;
        linkUrl: string | null;
        buttonLabel: string | null;
        locale: string | null;
        position: number;
        startAt: Date | null;
        endAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isDeleted: boolean;
        imageUrl: string;
        isActive: boolean;
        page: string;
        title: string;
        subtitle: string | null;
        mobileImageUrl: string | null;
        linkUrl: string | null;
        buttonLabel: string | null;
        locale: string | null;
        position: number;
        startAt: Date | null;
        endAt: Date | null;
    }>;
}
