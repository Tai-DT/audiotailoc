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
    if (!this.enabled || !publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted Cloudinary asset: ${publicId}`);
    } catch (err) {
      this.logger.warn(`Failed to delete Cloudinary asset ${publicId}: ${err}`);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * Example: https://res.cloudinary.com/demo/image/upload/v12345/projects/thumb_123.jpg
   * Returns: projects/thumb_123
   */
  extractPublicId(url: string | null | undefined): string | null {
    if (!url || !url.includes('cloudinary.com')) return null;

    try {
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      const filename = lastPart.split('.')[0];

      // Handle folders
      const uploadIdx = parts.indexOf('upload');
      if (uploadIdx !== -1 && parts.length > uploadIdx + 2) {
        // Skip version (v123456) if present
        const startIdx = parts[uploadIdx + 1].startsWith('v') ? uploadIdx + 2 : uploadIdx + 1;
        const publicIdParts = parts.slice(startIdx);
        const last = publicIdParts[publicIdParts.length - 1].split('.')[0];
        publicIdParts[publicIdParts.length - 1] = last;
        return publicIdParts.join('/');
      }

      return filename;
    } catch (e) {
      return null;
    }
  }
  /**
   * List all resources in a specific folder
   */
  async listResources(folder = 'uploads'): Promise<any[]> {
    if (!this.enabled) return [];
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 500,
      });
      return result.resources;
    } catch (err) {
      this.logger.error(`Failed to list Cloudinary resources: ${err}`);
      return [];
    }
  }

  /**
   * Delete multiple assets by their public IDs
   */
  async deleteAssets(publicIds: string[]): Promise<void> {
    if (!this.enabled || !publicIds.length) return;
    try {
      await cloudinary.api.delete_resources(publicIds);
      this.logger.log(`Deleted ${publicIds.length} Cloudinary assets`);
    } catch (err) {
      this.logger.warn(`Failed to delete multiple Cloudinary assets: ${err}`);
    }
  }

  /**
   * Logic to cleanup orphaned files will be called from a Cron job or Admin task
   * taking 'usedPublicIds' as parameter to avoid circular dependencies.
   */
  async cleanupOrphanedAssets(folder: string, usedPublicIds: string[]): Promise<number> {
    const resources = await this.listResources(folder);
    const orphaned = resources
      .filter(r => !usedPublicIds.includes(r.public_id))
      .map(r => r.public_id);

    if (orphaned.length > 0) {
      await this.deleteAssets(orphaned);
    }
    return orphaned.length;
  }
}
