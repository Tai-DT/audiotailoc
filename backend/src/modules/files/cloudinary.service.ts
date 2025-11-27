import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly enabled: boolean;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('CLOUDINARY_URL');
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');

    this.enabled = Boolean(url || cloudName);

    if (url) {
      cloudinary.config({ url, secure: true } as any);
    } else {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async uploadImage(
    buffer: Buffer,
    filename: string,
    folder = 'uploads',
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    if (!this.enabled) {
      throw new Error('Cloudinary is not enabled. Configure CLOUDINARY_* envs.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: 'image',
          overwrite: true,
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );

      uploadStream.end(buffer);
    });
  }

  async deleteAsset(publicId: string): Promise<void> {
    if (!this.enabled) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      this.logger.warn(`Failed to delete Cloudinary asset ${publicId}: ${err}`);
    }
  }
}
