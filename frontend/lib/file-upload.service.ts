// File upload service for frontend
export interface UploadResult {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: Record<string, any>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
  quality?: number;
}

export class FileUploadService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private createFormData(file: File, options: FileUploadOptions = {}): FormData {
    const formData = new FormData();
    formData.append('file', file);

    // Add additional metadata
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    if (options.quality) {
      formData.append('quality', options.quality.toString());
    }

    return formData;
  }

  private validateFile(file: File, options: FileUploadOptions = {}): void {
    // Check file size
    const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileType = file.type.toLowerCase();
      const isAllowed = options.allowedTypes.some(type =>
        fileType === type.toLowerCase() ||
        fileType.startsWith(type.replace('*', ''))
      );
      if (!isAllowed) {
        throw new Error(`File type ${file.type} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
      }
    }
  }

  async uploadFile(
    file: File,
    endpoint: string = '/files/upload',
    options: FileUploadOptions = {}
  ): Promise<UploadResult> {
    this.validateFile(file, options);

    const formData = this.createFormData(file, options);
    const token = this.getAuthToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', `${this.baseUrl}${endpoint}`);

      // Set headers
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Handle progress
      if (options.onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            options.onProgress!(progress);
          }
        });
      }

      xhr.onload = () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data);
            } else {
              reject(new Error(response.message || 'Upload failed'));
            }
          } else {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || `HTTP ${xhr.status}: Upload failed`));
          }
        } catch (error) {
          reject(new Error('Invalid response from server'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      xhr.onabort = () => {
        reject(new Error('Upload was cancelled'));
      };

      xhr.send(formData);
    });
  }

  async uploadMultipleFiles(
    files: File[],
    endpoint: string = '/files/upload-multiple',
    options: FileUploadOptions = {}
  ): Promise<UploadResult[]> {
    // Validate all files first
    files.forEach(file => this.validateFile(file, options));

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    if (options.folder) {
      formData.append('folder', options.folder);
    }

    const token = this.getAuthToken();

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : undefined
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}: Upload failed`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.data;
  }

  async uploadUserAvatar(
    avatar: File,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> {
    const uploadOptions: FileUploadOptions = {
      ...options,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 2 * 1024 * 1024, // 2MB
    };

    return this.uploadFile(avatar, '/files/upload/avatar', uploadOptions);
  }

  async uploadProductImage(
    image: File,
    productId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> {
    const uploadOptions: FileUploadOptions = {
      ...options,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
    };

    const formData = this.createFormData(image, uploadOptions);
    formData.append('productId', productId);

    const token = this.getAuthToken();

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : undefined
    };

    const response = await fetch(`${this.baseUrl}/files/upload/product-image/${productId}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}: Upload failed`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.data;
  }

  async uploadBannerImage(
    banner: File,
    options: FileUploadOptions = {}
  ): Promise<UploadResult> {
    const uploadOptions: FileUploadOptions = {
      ...options,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
    };

    return this.uploadFile(banner, '/files/upload', uploadOptions);
  }

  // Utility method to get image URL with transformations
  static getImageUrl(url: string, transformation: string = ''): string {
    if (!url.includes('cloudinary')) {
      return url;
    }

    // Insert transformation before 'upload/' in Cloudinary URLs
    return url.replace('/upload/', `/upload/${transformation}/`);
  }

  // Get thumbnail URL
  static getThumbnailUrl(url: string, width: number = 300, height: number = 300): string {
    if (!url.includes('cloudinary')) {
      return url;
    }

    return url.replace('/upload/', `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`);
  }

  // Get optimized URL
  static getOptimizedUrl(url: string): string {
    if (!url.includes('cloudinary')) {
      return url;
    }

    return url.replace('/upload/', '/upload/q_auto,f_auto,w_auto/');
  }
}

// Create singleton instance
export const fileUploadService = new FileUploadService();
export default fileUploadService;