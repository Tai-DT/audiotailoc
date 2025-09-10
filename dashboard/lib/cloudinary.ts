export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export class CloudinaryService {
  private static readonly CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private static readonly UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'audio-tailoc';

  /**
   * Upload file to Cloudinary using API route (client-side)
   */
  static async uploadFile(
    file: File,
    folder: string = 'products',
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Add transformation options
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());
      if (options.crop) formData.append('crop', options.crop);
      if (options.quality) formData.append('quality', options.quality.toString());

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        public_id: result.publicId,
        secure_url: result.url,
        url: result.url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files to Cloudinary
   */
  static async uploadFiles(
    files: File[],
    folder: string = 'products',
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
    } = {}
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map(file =>
      this.uploadFile(file, folder, options)
    );

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Get optimized image URL
   */
  static getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
    } = {}
  ): string {
    if (!this.CLOUD_NAME) {
      throw new Error('Cloudinary cloud name is not configured');
    }

    const transformations: string[] = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);

    const transformationString = transformations.length > 0
      ? transformations.join(',') + '/'
      : '';

    return `https://res.cloudinary.com/${this.CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
  }

  /**
   * Upload file using signed upload (server-side)
   */
  static async uploadFileSigned(
    file: File,
    folder: string = 'products',
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      if (!this.CLOUD_NAME) {
        throw new Error('Cloudinary cloud name is not configured');
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!apiKey || !apiSecret) {
        throw new Error('Cloudinary API credentials not configured');
      }

      // Create signature - ONLY include folder and timestamp for signed uploads
      const params: Record<string, string | number> = {
        folder,
        timestamp,
      };

      const sortedKeys = Object.keys(params).sort();
      const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + apiSecret;

      const crypto = await import('crypto');
      const signature = crypto.default.createHash('sha1').update(signatureString).digest('hex');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('signature', signature);

      // Add transformation options
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());
      if (options.crop) formData.append('crop', options.crop);
      if (options.quality) formData.append('quality', options.quality.toString());

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result: CloudinaryUploadResult = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary signed upload error:', error);
      throw error;
    }
  }

  /**
   * Validate if URL is a Cloudinary URL
   */
  static isCloudinaryUrl(url: string): boolean {
    if (!this.CLOUD_NAME) return false;
    return url.includes(`res.cloudinary.com/${this.CLOUD_NAME}`);
  }
}

export default CloudinaryService;
