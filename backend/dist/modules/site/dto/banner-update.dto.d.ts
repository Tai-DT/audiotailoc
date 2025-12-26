import { CreateBannerDto } from './banner-create.dto';
declare const UpdateBannerDto_base: import("@nestjs/common").Type<Partial<CreateBannerDto>>;
export declare class UpdateBannerDto extends UpdateBannerDto_base {
    title?: string;
    imageUrl?: string;
    mobileImageUrl?: string;
    linkUrl?: string;
    buttonLabel?: string;
    page?: string;
    locale?: string;
    position?: number;
    isActive?: boolean;
}
export {};
