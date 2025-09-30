import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
export declare class CloudinaryService {
    private readonly config;
    private readonly logger;
    private readonly enabled;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    uploadImage(buffer: Buffer, filename: string, folder?: string, options?: UploadApiOptions): Promise<UploadApiResponse>;
    deleteAsset(publicId: string): Promise<void>;
}
