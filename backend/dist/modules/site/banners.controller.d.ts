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
            description: string | null;
            title: string;
            imageUrl: string;
            isActive: boolean;
            isDeleted: boolean;
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
        page: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        imageUrl: string;
        isActive: boolean;
        isDeleted: boolean;
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
        page: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        imageUrl: string;
        isActive: boolean;
        isDeleted: boolean;
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
